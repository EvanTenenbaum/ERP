"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Updated to use next/navigation
import InventoryForm from '../../../../components/forms/InventoryForm';
import Button from '../../../../components/ui/Button';

export default function AddInventoryPage() {
  const router = useRouter();

  const handleSubmit = (data) => {
    // Handle form submission
    console.log('Submitting inventory data:', data);
    
    // Redirect to inventory list after submission
    router.push('/dashboard/inventory');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <Link href="/dashboard/inventory">
          <Button variant="outline">Back to Inventory</Button>
        </Link>
      </div>
      
      <InventoryForm 
        initialData={{}}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
