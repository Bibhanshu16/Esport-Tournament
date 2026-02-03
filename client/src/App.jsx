import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

const Home = lazy(() => import("./pages/users/Home.jsx"));
const Register = lazy(() => import("./pages/auth/Register.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Tournaments = lazy(() => import("./pages/users/Tournament.jsx"));
const Profile = lazy(() => import("./pages/users/Profile.jsx"));
const Admin = lazy(() => import("./pages/admin/admin.jsx"));

const VerifyEmailInfo = lazy(() => import("./components/VerifyEmailInfo.jsx"));
const TournamentRegister = lazy(() => import("./components/TournamentRegister.jsx"));
const Payment = lazy(() => import("./components/Payment.jsx"));
const RegistrationPending = lazy(() => import("./components/RegistrationPending.jsx"));
const MyRegistrationDetails = lazy(() => import("./components/MyRegistrationDetails.jsx"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar /> {/* 🔥 NAVBAR HERE */}
        <Suspense fallback={<AppLoading />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/payment" element={<Payment />} />
            <Route
              path="/registration-pending"
              element={<RegistrationPending />}
            />
            <Route path="/verify-email-info" element={<VerifyEmailInfo />} />
            <Route
              path="/tournaments/:id/register"
              element={<TournamentRegister />}
            />

            {/* Protected */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tournaments/:id/my-registration"
              element={
                <ProtectedRoute>
                  <MyRegistrationDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <Admin />
                </AdminRoute>
              }
            />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

function AppLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-300">
      Loading...
    </div>
  );
}
