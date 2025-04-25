'use client';

import { AppProvider } from '@/lib/context/AppContext';
import MainLayout from '../../components/ui/layout/MainLayout';
import DataLoader from '../../components/DataLoader';

export default function DashboardLayout({ children }) {
  return (
    <AppProvider>
      <MainLayout>
        {children}
        <DataLoader />
      </MainLayout>
    </AppProvider>
  );
}
