import { Suspense } from 'react';
import VendorsClientPage from './VendorsClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VendorsClientPage />
    </Suspense>
  );
}
