import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import APropos from './pages/APropos';
import Procedure from './pages/Procedure';
import Tarifs from './pages/Tarifs';
import Pourquoi from './pages/Pourquoi';
import Analyse from './pages/Analyse';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import { getSession, getPersonnelSession, initSession } from './api/auth';
import DashboardStudent from './pages/DashboardStudent';
import AuthPersonnel from './pages/AuthPersonnel';
import DashboardPersonnel from './pages/DashboardPersonnel';
import DashboardConseiller from './pages/DashboardConseiller';
import DashboardSuperAdmin from './pages/DashboardSuperAdmin';
import { MessageModalProvider } from './context/MessageModalContext';
import ScrollToTop from './components/ScrollToTop';

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
    </div>
  );
}

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    initSession().finally(() => setAuthReady(true));
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <MessageModalProvider>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/a-propos" element={<Layout><APropos /></Layout>} />
          <Route path="/procedure" element={<Layout><Procedure /></Layout>} />
          <Route path="/tarifs" element={<Layout><Tarifs /></Layout>} />
          <Route path="/pourquoi" element={<Layout><Pourquoi /></Layout>} />
          <Route path="/analyse" element={<Layout><Analyse /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/connexion" element={<Auth />} />
          <Route path="/inscription" element={<Auth />} />
          <Route path="/dashboard" element={<PrivateRoute authReady={authReady}><DashboardStudent /></PrivateRoute>} />
          <Route path="/personnel" element={<AuthPersonnel />} />
          <Route path="/dashboard/admin" element={<PrivatePersonnelRoute authReady={authReady} roles={['admin']}><DashboardPersonnel /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/superadmin" element={<PrivatePersonnelRoute authReady={authReady} roles={['superadmin']}><DashboardSuperAdmin /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/superadmin/:section" element={<PrivatePersonnelRoute authReady={authReady} roles={['superadmin']}><DashboardSuperAdmin /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/conseiller-admission" element={<PrivatePersonnelRoute authReady={authReady} roles={['admission']}><DashboardConseiller /></PrivatePersonnelRoute>} />
          <Route path="/dashboard/conseiller-visa" element={<PrivatePersonnelRoute authReady={authReady} roles={['visa']}><DashboardConseiller /></PrivatePersonnelRoute>} />
        </Routes>
      </MessageModalProvider>
    </BrowserRouter>
  );
}

export default App;
