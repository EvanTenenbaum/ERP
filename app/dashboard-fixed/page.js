import { Suspense } from 'react';
import DashboardClientPage from './DashboardClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardClientPage />
    </Suspense>
  );
}
