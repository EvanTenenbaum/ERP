"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Updated to use next/navigation
import SalesForm from '../../../../components/forms/SalesForm';
import Button from '../../../../components/ui/Button';

export default function NewSalePage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    // Handle form submission
    console.log('Submitting sales data:', data);
    
    // Redirect to sales list after submission
    router.push('/dashboard/sales');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Sale</h1>
        <Link href="/dashboard/sales">
          <Button variant="outline">Back to Sales</Button>
        </Link>
      </div>
      
      <SalesForm 
        initialData={{}}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
