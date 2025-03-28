
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SignDocument from "./pages/SignDocument";
import CertificateManager from "./pages/CertificateManager";
import AuditLogs from "./pages/AuditLogs";
import Settings from "./pages/Settings";
import { UserProvider, useUser } from "./contexts/UserContext";
import UserManagement from "./pages/UserManagement";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { cn } from "@/lib/utils";
import ApiDocumentation from "./pages/ApiDocumentation";
import AdminReadme from "./pages/AdminReadme";
import UserReadme from "./pages/UserReadme";

// Initialize the query client for API requests
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Index />} />
              <Route path="/sign" element={<SignDocument />} />
              <Route path="/certificates" element={<CertificateManager />} />
              <Route path="/audit" element={<AuditLogs />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/api-docs" element={<ApiDocumentation />} />
              <Route path="/admin-readme" element={<AdminReadme />} />
              <Route path="/user-readme" element={<UserReadme />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
