import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SiteLayout from './components/SiteLayout';
import HomePage from './pages/HomePage';
import EquipmentPage from './pages/EquipmentPage';
import ServicesPage from './pages/ServicesPage';
import SoftwarePage from './pages/SoftwarePage';
import AboutPage from './pages/AboutPage';
import ClientsPage from './pages/ClientsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './LoginPage';
import AdminDashboard from './app/pages/AdminDashboard';
import ClientDashboard from './app/pages/ClientDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/equipos" element={<EquipmentPage />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/clientes" element={<ClientsPage />} />
          <Route path="/contacto" element={<ContactPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard/admin" element={<AdminDashboard />} />
        <Route path="/dashboard/client" element={<ClientDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
