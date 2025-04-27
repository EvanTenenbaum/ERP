import { Suspense } from 'react';
import ReportsClientPage from './ReportsClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ReportsClientPage />
    </Suspense>
  );
}
