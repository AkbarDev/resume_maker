import React, { useState } from "react";
import { User, Lock, Mail, FileText, ArrowRight, UserPlus, AlertCircle } from "lucide-react";

export default function AuthGate({ onLogin, onGuestLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getStoredUsers = () => {
    try {
      const users = localStorage.getItem("cv_maker_users_list");
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || (!isLoginMode && !email)) {
      setError("Please fill out all fields.");
      return;
    }

    const users = getStoredUsers();

    if (isLoginMode) {
      // Login Flow
      const foundUser = users.find(
        (u) => 
          (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) && 
          u.password === password
      );

      if (foundUser) {
        onLogin({ username: foundUser.username, email: foundUser.email });
      } else {
        setError("Invalid username/email or password.");
      }
    } else {
      // Signup Flow
      const nameExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
      const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

      if (nameExists) {
        setError("Username is already taken.");
        return;
      }
      if (emailExists) {
        setError("Email is already registered.");
        return;
      }

      const newUser = { username, email, password };
      users.push(newUser);
      localStorage.setItem("cv_maker_users_list", JSON.stringify(users));

      setSuccess("Account created successfully! Switching to Login.");
      setTimeout(() => {
        setIsLoginMode(true);
        setUsername(newUser.username);
        setPassword("");
        setSuccess("");
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex items-center justify-center p-6 font-inter">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-dark-card/60 backdrop-blur-xl border border-dark-border/80 rounded-2xl shadow-2xl p-8 relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3.5 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-3">
            <FileText className="text-white" size={28} />
          </div>
          <h1 className="font-outfit font-extrabold text-2xl tracking-wide text-white">
            ApexCV
          </h1>
          <p className="text-xs text-gray-400 mt-1">Free & Open-Source ATS CV Maker</p>
        </div>

        <h2 className="text-lg font-bold text-white mb-6 text-center">
          {isLoginMode ? "Sign in to your account" : "Create your free account"}
        </h2>

        {error && (
          <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/50 p-3.5 rounded-xl text-xs text-red-300 mb-4">
            <AlertCircle className="shrink-0" size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 p-3.5 rounded-xl text-xs text-emerald-300 mb-4">
            <CheckIcon className="shrink-0 text-emerald-400" size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">
              {isLoginMode ? "Username or Email" : "Username"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <User size={15} />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-900/60 border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder={isLoginMode ? "username or email" : "choose username"}
                autoFocus
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Mail size={15} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="name@example.com"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                <Lock size={15} />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/60 border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-150 mt-6"
          >
            <span>{isLoginMode ? "Sign In" : "Register Account"}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="relative my-6 text-center">
          <span className="absolute inset-x-0 top-1/2 border-t border-dark-border/60 -z-10" />
          <span className="bg-[#0f1422] px-3 text-[10px] uppercase font-bold tracking-widest text-gray-500">
            or
          </span>
        </div>

        {/* Guest access */}
        <button
          type="button"
          onClick={onGuestLogin}
          className="w-full border border-dark-border hover:border-gray-500 bg-slate-900/30 py-2.5 rounded-xl text-sm font-bold text-gray-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <span>Continue as Guest</span>
        </button>

        {/* Switch Mode Link */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError("");
            }}
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 mx-auto"
          >
            {isLoginMode ? (
              <>
                <UserPlus size={13} />
                Don't have an account? Sign Up
              </>
            ) : (
              <>
                <User size={13} />
                Already have an account? Sign In
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}

// Simple internal icon
function CheckIcon({ className, size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
