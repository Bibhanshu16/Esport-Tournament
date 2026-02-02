import React, { useContext } from "react";
import { Link } from "react-router-dom";
import TournamentCards from "../../components/TournamentCards";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      {/* HERO SECTION WITH CINEMATIC BACKGROUND */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center px-6 md:px-20 overflow-hidden">
        
        {/* Background Layer */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-img.png"
            alt="Esports Background"
            className="w-full h-full object-cover"
          />
          {/* Side Fade: Ensures text readability on the left */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
          {/* Bottom Fade: Smoothes transition to next section */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.9]">
            Compete. Win. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]">
              Dominate.
            </span>
          </h1>

          <p className="mt-8 text-lg md:text-2xl text-slate-300 max-w-xl font-light leading-relaxed">
            The ultimate arena for competitive squads. Join the next generation of 
            champions and claim your prize.
          </p>

          <div className="mt-12 flex flex-wrap gap-5">
            <Link
              to="/tournaments"
              className="px-10 py-4 bg-purple-600 hover:bg-white hover:text-purple-600 rounded-sm font-bold transition-all duration-300 uppercase tracking-widest text-sm shadow-lg shadow-purple-600/20"
            >
              View Tournaments
            </Link>

            {!isLoggedIn ? (
              <Link
                to="/register"
                className="px-10 py-4 border border-white/30 hover:border-white hover:bg-white/10 backdrop-blur-sm rounded-sm font-bold transition-all duration-300 uppercase tracking-widest text-sm"
              >
                Join Now
              </Link>
            ) : (
              <Link
                to="/tournaments"
                className="px-10 py-4 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 backdrop-blur-sm rounded-sm font-bold transition-all duration-300 uppercase tracking-widest text-sm"
              >
                Go to Dashboard
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* TOURNAMENT SECTION */}
      <section className="relative z-10 px-6 py-24 md:px-20 bg-slate-950">
        <div className="flex items-center gap-4 mb-16 border-l-4 border-purple-600 pl-6">
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight italic">
            Active Tournaments
          </h2>
        </div>
        
        <div className="grid grid-cols-1 gap-8">
          <TournamentCards />
        </div>
      </section>
    </div>
  );
}