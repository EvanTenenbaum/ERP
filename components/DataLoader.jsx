// Load data from API instead of dummy data
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import db from '@/lib/database';

// Create a button to initialize the database with seed data
export default function DataLoader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLoadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the seed endpoint to initialize the database
      const response = await fetch('/api/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to seed database');
      }
      
      const result = await response.json();
      
      alert('Database seeded successfully! The page will refresh to load the new data.');
      router.reload();
    } catch (error) {
      console.error('Error seeding database:', error);
      setError(error.message);
      alert(`Error seeding database: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={handleLoadData}
        disabled={loading}
        className={`${
          loading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'
        } text-white font-bold py-2 px-4 rounded shadow-lg`}
      >
        {loading ? 'Seeding Database...' : 'Seed Database'}
      </button>
      {error && (
        <div className="mt-2 text-red-600 text-sm bg-white p-2 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
}
