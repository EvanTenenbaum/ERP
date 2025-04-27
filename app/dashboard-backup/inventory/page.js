import { Suspense } from 'react';
import InventoryClientPage from './InventoryClientPage';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InventoryClientPage />
    </Suspense>
  );
}
