import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/users/Home.jsx";
import Register from "./pages/auth/Register.jsx";
import Login from "./pages/auth/Login.jsx";
import Tournaments from "./pages/users/Tournament";
import Profile from "./pages/users/Profile.jsx";
import Admin from "./pages/admin/admin.jsx";

import AdminRoute from "./components/AdminRoute";
import VerifyEmailInfo from "./components/VerifyEmailInfo.jsx";
import TournamentRegister from "./components/TournamentRegister.jsx"
import Payment from "./components/Payment.jsx";

import RegistrationPending from "./components/RegistrationPending.jsx"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar /> {/* 🔥 NAVBAR HERE */}
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tournaments" element={<Tournaments />} />

          <Route path="/payment" element={<Payment />} />
          <Route path="/registration-pending" element={<RegistrationPending />} />

          <Route path="/verify-email-info" element={<VerifyEmailInfo />} />
          <Route path="/tournaments/:id/register" element={<TournamentRegister />} />

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
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-email-info"
            element={
              <ProtectedRoute>
                <VerifyEmailInfo />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/tournaments/:id/register"
            element={
              <TournamentRegister />
            }
          >

          </Route>

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
