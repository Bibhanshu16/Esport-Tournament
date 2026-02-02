import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Menu, X, LayoutDashboard, User, LogOut, Trophy } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex-shrink-0 flex items-center group">
            <div className="bg-indigo-600 p-2 rounded-lg mr-3 group-hover:rotate-12 transition-transform">
              <Trophy className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-black text-white tracking-tighter italic uppercase">
              ESPORTS<span className="text-indigo-500">PRO</span>
            </h2>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/tournaments">Tournaments</NavLink>

            {user ? (
              <div className="flex items-center gap-6 border-l border-slate-800 pl-10">
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-amber-400 hover:text-amber-300 font-bold transition-all text-sm uppercase tracking-widest"
                  >
                    <LayoutDashboard size={18} />
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="text-slate-300 hover:text-white transition-all font-medium">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-5 py-2 rounded-lg text-sm font-bold transition-all border border-red-500/20 shadow-lg shadow-red-500/5"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/login" className="text-slate-300 hover:text-white transition font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-black transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-wider"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800/50 border border-slate-700 focus:outline-none transition-all"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <div className="px-4 py-6 space-y-4">
            <MobileNavLink to="/" onClick={toggleMenu}>Home</MobileNavLink>
            <MobileNavLink to="/tournaments" onClick={toggleMenu}>Tournaments</MobileNavLink>

            {user ? (
              <div className="pt-4 mt-4 border-t border-slate-800 space-y-4">
                {/* ADMIN LINK IN MOBILE VIEW */}
                {user.role === "ADMIN" && (
                  <Link
                    to="/admin"
                    onClick={toggleMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-amber-400 bg-amber-400/10 font-black border border-amber-400/20 uppercase tracking-widest"
                  >
                    <LayoutDashboard size={20} />
                    Admin Panel
                  </Link>
                )}
                
                <Link
                  to="/profile"
                  onClick={toggleMenu}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 bg-slate-800 hover:text-white transition font-bold"
                >
                  <User size={20} />
                  Profile
                </Link>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 bg-red-500/10 font-bold border border-red-500/10"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 mt-4 border-t border-slate-800 flex flex-col gap-3">
                <Link to="/login" onClick={toggleMenu} className="text-center text-slate-300 font-bold py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={toggleMenu}
                  className="bg-indigo-600 text-white text-center py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg"
                >
                  Join the Arena
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Internal Helpers
function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-sm font-bold text-slate-400 hover:text-white uppercase tracking-widest transition-all">
      {children}
    </Link>
  );
}

function MobileNavLink({ to, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 rounded-xl text-lg font-bold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
    >
      {children}
    </Link>
  );
}