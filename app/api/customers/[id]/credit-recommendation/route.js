import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import { requirePermission } from '../../../../../lib/api-auth';
import { PERMISSIONS } from '../../../../../lib/rbac';

export async function GET(request, { params }) {
  const auth = await requirePermission(request, PERMISSIONS.VIEW_CUSTOMERS);
  
  if (!auth.authorized) {
    return auth.response;
  }
  
  const { session } = auth;
  const { id } = params;
  
  try {
    // Verify customer exists and belongs to tenant
    const customer = await prisma.customer.findUnique({
      where: {
        id,
        tenantId: session.user.tenantId,
      },
    });
    
    if (!customer) {
      return NextResponse.json(
        { 
          error: { 
            code: 'RESOURCE_NOT_FOUND', 
            message: `Customer with ID ${id} not found`,
            details: { resourceType: 'customer', resourceId: id }
          } 
        },
        { status: 404 }
      );
    }
    
    // Get payment history and analyze for credit recommendation
    const paymentAnalysis = await prisma.$transaction(async (tx) => {
      // Get all sales
      const sales = await tx.sale.findMany({
        where: {
          customerId: id,
          tenantId: session.user.tenantId,
        },
        select: {
          id: true,
          saleDate: true,
          paymentDate: true,
          total: true,
          paymentStatus: true,
        },
        orderBy: {
          saleDate: 'desc',
        },
      });
      
      // Get total unpaid amount
      const unpaidAmount = sales
        .filter(sale => sale.paymentStatus !== 'paid')
        .reduce((sum, sale) => sum + Number(sale.total), 0);
      
      // Calculate average payment time (in days)
      const paidSales = sales.filter(sale => 
        sale.paymentStatus === 'paid' && sale.paymentDate
      );
      
      let avgPaymentTime = 0;
      if (paidSales.length > 0) {
        const totalDays = paidSales.reduce((sum, sale) => {
          const saleDate = new Date(sale.saleDate);
          const paymentDate = new Date(sale.paymentDate);
          const days = Math.floor((paymentDate - saleDate) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0);
        avgPaymentTime = totalDays / paidSales.length;
      }
      
      // Calculate payment reliability score (0-100)
      let reliabilityScore = 100;
      
      // Reduce score for late payments
      if (avgPaymentTime > 30) {
        reliabilityScore -= Math.min(30, (avgPaymentTime - 30) * 2);
      }
      
      // Reduce score for unpaid amounts
      const currentCreditLimit = customer.creditLimit || 0;
      if (unpaidAmount > currentCreditLimit * 0.8) {
        reliabilityScore -= Math.min(30, ((unpaidAmount / currentCreditLimit) - 0.8) * 100);
      }
      
      // Calculate recommended credit limit
      let recommendedCreditLimit = currentCreditLimit;
      
      // If reliability is good, consider increasing limit
      if (reliabilityScore > 80 && sales.length >= 5) {
        const averageSaleAmount = sales.reduce((sum, sale) => sum + Number(sale.total), 0) / sales.length;
        recommendedCreditLimit = Math.max(
          currentCreditLimit,
          Math.min(averageSaleAmount * 3, currentCreditLimit * 1.5)
        );
      }
      
      // If reliability is poor, consider decreasing limit
      if (reliabilityScore < 60) {
        recommendedCreditLimit = Math.max(
          unpaidAmount,
          currentCreditLimit * 0.7
        );
      }
      
      return {
        currentCreditLimit,
        recommendedCreditLimit,
        reliabilityScore,
        avgPaymentTime,
        unpaidAmount,
        totalSales: sales.length,
        paidSales: paidSales.length,
      };
    });
    
    return NextResponse.json({
      customer: {
        id: customer.id,
        name: customer.name,
        code: customer.code,
        currentCreditLimit: customer.creditLimit,
      },
      creditRecommendation: paymentAnalysis,
    });
  } catch (error) {
    console.error('Error generating credit recommendation:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}
