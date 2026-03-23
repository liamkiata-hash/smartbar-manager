import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { DataProvider, useData } from './context/DataContext';
import { AuthPage } from './pages/AuthPage';
import { Layout } from './components/Layout';
import { DashboardPage } from './pages/DashboardPage';
import { TablesPage } from './pages/TablesPage';
import { ProductsPage } from './pages/ProductsPage';
import { InventoryPage } from './pages/InventoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { HistoryPage } from './pages/HistoryPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode, roles?: string[] }> = ({ children, roles }) => {
  const { currentUser } = useData();
  
  if (!currentUser) return <Navigate to="/auth" replace />;
  
  if (roles && !roles.includes(currentUser.role)) {
    return <Navigate to="/tables" replace />; // Default for unauthorized
  }
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { currentUser } = useData();

  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/auth" element={currentUser ? <Navigate to="/" replace /> : <AuthPage />} />
        
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/" element={
            <ProtectedRoute roles={['boss']}>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/tables" element={<TablesPage />} />
          <Route path="/products" element={
            <ProtectedRoute roles={['boss']}>
              <ProductsPage />
            </ProtectedRoute>
          } />
          <Route path="/inventory" element={
            <ProtectedRoute roles={['boss']}>
              <InventoryPage />
            </ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute roles={['boss']}>
              <HistoryPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute roles={['boss']}>
              <SettingsPage />
            </ProtectedRoute>
          } />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

function App() {
  return (
    <DataProvider>
      <AppRoutes />
    </DataProvider>
  );
}

export default App;