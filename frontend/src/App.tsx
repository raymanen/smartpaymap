import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { MappingPage } from './pages/MappingPage';
import { SkillsPage } from './pages/SkillsPage';
import CompliancePage from './pages/CompliancePage';
import { theme } from './theme/theme';
import { LoadingOverlay } from './components/LoadingOverlay';
import { Suspense } from 'react';

// Error page component
const NotFound = () => (
  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    alignItems: 'center', 
    justifyContent: 'center', 
    height: '100vh', 
    textAlign: 'center', 
    padding: '20px' 
  }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/" style={{ color: '#2563eb', marginTop: '20px' }}>Return to Home</a>
  </div>
);

// Layout with conditional full-width support
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<LoadingOverlay message="Loading..." />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/mapping" element={<MappingPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/compliance" element={<CompliancePage />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </Suspense>
        </AppLayout>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
