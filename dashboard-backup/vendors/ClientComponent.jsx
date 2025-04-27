'use client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ClientComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  return (
    <div>
      {/* Insert your interactive UI here */}
    </div>
  );
}
