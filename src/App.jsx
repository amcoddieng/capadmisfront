import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import APropos from './pages/APropos';
import Procedure from './pages/Procedure';
import Tarifs from './pages/Tarifs';
import Pourquoi from './pages/Pourquoi';
import Analyse from './pages/Analyse';
import Temoignages from './pages/Temoignages';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Auth from './pages/Auth';
import AuthPersonnel from './pages/AuthPersonnel';
import DashboardStudent from './pages/DashboardStudent';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardSuperAdmin from './pages/DashboardSuperAdmin';
import DashboardConseillerAdmission from './pages/DashboardConseillerAdmission';
import DashboardConseillerVisa from './pages/DashboardConseillerVisa';

function Layout({ children }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/connexion' || location.pathname === '/inscription';

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/a-propos" element={<Layout><APropos /></Layout>} />
        <Route path="/procedure" element={<Layout><Procedure /></Layout>} />
        <Route path="/tarifs" element={<Layout><Tarifs /></Layout>} />
        <Route path="/pourquoi" element={<Layout><Pourquoi /></Layout>} />
        <Route path="/analyse" element={<Layout><Analyse /></Layout>} />
        <Route path="/temoignages" element={<Layout><Temoignages /></Layout>} />
        <Route path="/faq" element={<Layout><FAQ /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/connexion" element={<Auth />} />
        <Route path="/inscription" element={<Auth />} />
        <Route path="/dashboard" element={<DashboardStudent />} />
        <Route path="/espace-pro" element={<AuthPersonnel />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-superadmin" element={<DashboardSuperAdmin />} />
        <Route path="/dashboard-conseiller-admission" element={<DashboardConseillerAdmission />} />
        <Route path="/dashboard-conseiller-visa" element={<DashboardConseillerVisa />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
