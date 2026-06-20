import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Search from "./pages/Search";
import ClinicProfile from "./pages/ClinicProfile";
import Login from "./pages/Login";
import RegisterChoice from "./pages/RegisterChoice";
import RegisterPatient from "./pages/RegisterPatient";
import RegisterProvider from "./pages/RegisterProvider";
import PatientDashboard from "./pages/PatientDashboard";
import ProviderDashboard from "./pages/ProviderDashboard";
import ChatThread from "./pages/ChatThread";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-sand-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/clinic/:id" element={<ClinicProfile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<RegisterChoice />} />
            <Route path="/register/patient" element={<RegisterPatient />} />
            <Route path="/register/provider" element={<RegisterProvider />} />
            <Route
              path="/dashboard/patient"
              element={
                <ProtectedRoute role="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/provider"
              element={
                <ProtectedRoute role="provider">
                  <ProviderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                <ProtectedRoute>
                  <ChatThread />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
