'use client';

import { AppProvider } from '../../lib/context/AppContext';
import DataLoader from '../../components/DataLoader';

export default function DashboardLayout({ children }) {
  return (
    <AppProvider>
      {children}
      <DataLoader />
    </AppProvider>
  );
}
