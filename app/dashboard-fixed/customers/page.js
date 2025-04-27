import { Suspense } from 'react';
import CustomersClientPage from './CustomersClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CustomersClientPage />
    </Suspense>
  );
}
