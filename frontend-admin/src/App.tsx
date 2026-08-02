import { Navigate, Route, Routes } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from './store/authStore';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ToastHost } from './components/ToastHost';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { MarketsPage } from './pages/MarketsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { UsersPage } from './pages/UsersPage';

function RequireAdmin({ children }: { children: ReactNode }) {
  const { token, user } = useAuthStore();
  if (!token || user?.role !== 'ADMIN') return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <RequireAdmin>
              <AdminLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/markets" element={<MarketsPage />} />
                  <Route path="/categories" element={<CategoriesPage />} />
                  <Route path="/users" element={<UsersPage />} />
                </Routes>
              </AdminLayout>
            </RequireAdmin>
          }
        />
      </Routes>
      <ToastHost />
    </>
  );
}

export default App;
