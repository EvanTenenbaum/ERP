import { Suspense } from 'react';
import SalesClientPage from './SalesClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SalesClientPage />
    </Suspense>
  );
}
