"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Updated to use next/navigation
import { Plus } from 'lucide-react'; // Fixed: Added missing import for Plus icon
import CustomerForm from '../../../../components/forms/CustomerForm';
import Button from '../../../../components/ui/Button';

export default function CustomerPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const isNewCustomer = id === 'new';

  const handleSubmit = (data) => {
    // Handle form submission
    console.log('Submitting customer data:', data);
    
    // Redirect to customers list after submission
    router.push('/dashboard/customers');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewCustomer ? 'Add New Customer' : 'Edit Customer'}
        </h1>
        <Link href="/dashboard/customers">
          <Button variant="outline">Back to Customers</Button>
        </Link>
      </div>
      
      <CustomerForm 
        initialData={isNewCustomer ? {} : { id, name: 'Sample Customer', /* other fields */ }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
