import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import { getSession, getPersonnelSession, initSession } from './api/auth';
import { MessageModalProvider } from './context/MessageModalContext';
import ScrollToTop from './components/ScrollToTop';
import WhatsAppFloat from './components/WhatsAppFloat';
import CookieBanner from './components/CookieBanner';

const APropos = lazy(() => import('./pages/APropos'));
const Procedure = lazy(() => import('./pages/Procedure'));
const Tarifs = lazy(() => import('./pages/Tarifs'));
const Pourquoi = lazy(() => import('./pages/Pourquoi'));
const Analyse = lazy(() => import('./pages/Analyse'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Confidentialite = lazy(() => import('./pages/Confidentialite'));
const Temoignages = lazy(() => import('./pages/Temoignages'));
const Auth = lazy(() => import('./pages/Auth'));
const AuthPersonnel = lazy(() => import('./pages/AuthPersonnel'));
const DashboardStudent = lazy(() => import('./pages/DashboardStudent'));
const DashboardPersonnel = lazy(() => import('./pages/DashboardPersonnel'));
const DashboardConseiller = lazy(() => import('./pages/DashboardConseiller'));
const DashboardSuperAdmin = lazy(() => import('./pages/DashboardSuperAdmin'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogArticle = lazy(() => import('./pages/BlogArticle'));

/* ── Guards de route ── */
function AuthLoading() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c1c3f' }}>
      <div style={{ width: 40, height: 40, border: '3px solid rgba(197,161,80,.3)', borderTopColor: '#c5a150', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function PrivateRoute({ children, authReady }) {
  if (!authReady) return <AuthLoading />;
  const { token } = getSession();
  return token ? children : <Navigate to="/connexion" replace />;
}

function PrivatePersonnelRoute({ children, roles, authReady }) {
  if (!authReady) return <AuthLoading />;
  const { token, personnel } = getPersonnelSession();
  if (!token || !personnel) return <Navigate to="/personnel" replace />;
  if (roles) {
    const r = (personnel.role || '').toLowerCase();
    const ok = roles.some(allowed =>
      allowed === 'admin'      ? r === 'admin' :
      allowed === 'superadmin' ? r === 'superadmin' :
      r.includes(allowed)
    );
    if (!ok) return <Navigate to="/personnel" replace />;
  }
  return children;
}

function Layout({ children }) {
  const location = useLocation();
  const noLayoutPages = ['/connexion', '/inscription', '/personnel'];
  const isAuthPage = noLayoutPages.includes(location.pathname)
    || location.pathname.startsWith('/dashboard');

  return (
    <div className="page-wrapper">
      {!isAuthPage && <Navbar />}
      <div className="page-wrapper__content">
        {children}
      </div>
      {!isAuthPage && <Footer />}
      {!isAuthPage && <WhatsAppFloat />}
    </div>
  );
}

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const run = () => initSession().finally(() => setAuthReady(true));
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(run, { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const t = window.setTimeout(run, 100);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MessageModalProvider>
        <Suspense fallback={<AuthLoading />}>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/a-propos" element={<Layout><APropos /></Layout>} />
          <Route path="/procedure" element={<Layout><Procedure /></Layout>} />
          <Route path="/tarifs" element={<Layout><Tarifs /></Layout>} />
          <Route path="/pourquoi" element={<Layout><Pourquoi /></Layout>} />
          <Route path="/analyse" element={<Layout><Analyse /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/temoignages" element={<Layout><Temoignages /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/confidentialite" element={<Layout><Confidentialite /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/blog/:slug" element={<Layout><BlogArticle /></Layout>} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/inscription" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute authReady={authReady}><DashboardStudent /></PrivateRoute>} />
          <Route path="/personnel" element={<AuthPersonnel />} />
          <Route path="/dashboard/admin" element={<PrivatePersonnelRoute authReady={authReady} roles={['admin']}><DashboardPersonnel /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/superadmin" element={<PrivatePersonnelRoute authReady={authReady} roles={['superadmin']}><DashboardSuperAdmin /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/superadmin/:section" element={<PrivatePersonnelRoute authReady={authReady} roles={['superadmin']}><DashboardSuperAdmin /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/conseiller-admission" element={<PrivatePersonnelRoute authReady={authReady} roles={['admission']}><DashboardConseiller /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/conseiller-visa" element={<PrivatePersonnelRoute authReady={authReady} roles={['visa']}><DashboardConseiller /></PrivatePersonnelRoute>} />
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
        </Suspense>
        <CookieBanner />
      </MessageModalProvider>
    </BrowserRouter>
  );
}

export default App;
