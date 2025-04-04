"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Updated to use next/navigation
import VendorForm from '../../../../components/forms/VendorForm';
import Button from '../../../../components/ui/Button';

export default function VendorPage({ params }) {
  const router = useRouter();
  const { id } = params;
  const isNewVendor = id === 'new';

  const handleSubmit = (data) => {
    // Handle form submission
    console.log('Submitting vendor data:', data);
    
    // Redirect to vendors list after submission
    router.push('/dashboard/vendors');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isNewVendor ? 'Add New Vendor' : 'Edit Vendor'}
        </h1>
        <Link href="/dashboard/vendors">
          <Button variant="outline">Back to Vendors</Button>
        </Link>
      </div>
      
      <VendorForm 
        initialData={isNewVendor ? {} : { id, name: 'Sample Vendor', /* other fields */ }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
