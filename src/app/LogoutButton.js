"use client";
import { useEffect, useState } from 'react';

export default function LogoutButton() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('jamlaper_auth');
      setIsAuth(auth === 'true');
    };

    // Check initially
    checkAuth();

    // Listen for custom event from AuthWrapper
    window.addEventListener('auth-change', checkAuth);
    // Listen for storage changes (if logged in/out from another tab)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('auth-change', checkAuth);
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jamlaper_auth');
    window.dispatchEvent(new Event('auth-change'));
    window.location.reload();
  };

  if (!isAuth) return null;

  return (
    <button 
      onClick={handleLogout}
      className="flex items-center justify-center p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors" 
      title="Keluar (Logout)"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
      </svg>
    </button>
  );
}
