"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Menu, LogOut, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      let token = localStorage.getItem('access_token');
      if (!token) {
        token = localStorage.getItem('mielove_token');
        if (token) {
          localStorage.setItem('access_token', token);
          localStorage.removeItem('mielove_token');
        }
      }
      
      const storedUser = localStorage.getItem('mielove_user');
      setIsLoggedIn(!!token);
      
      // Handle edge cases where localStorage might store string 'undefined'
      if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
        setUsername(storedUser);
      } else {
        setUsername(null);
      }
    };

    checkAuth();
    
    // Listen for storage changes (helpful for multi-tab sync)
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('mielove_user');
    window.location.href = '/';
  };

  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex items-center justify-between text-stone-800 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold font-serif shadow-lg shadow-primary-500/30">M</div>
          <span className="text-2xl font-bold font-serif tracking-wide text-primary-600">Mielove</span>
        </Link>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-[15px] font-medium">
        <Link href="/about" className="text-stone-700 hover:text-primary-600 transition-colors">Về Mielove</Link>
        <Link href="/templates" className="text-stone-700 hover:text-primary-600 transition-colors">Mẫu thiệp</Link>
        <Link href="/dashboard" className="text-stone-700 hover:text-primary-600 transition-colors">Thiệp đã tạo</Link>
        <Link href="/pricing" className="text-stone-700 hover:text-primary-600 transition-colors">Gói dịch vụ</Link>
      </div>

      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-stone-600 mr-2">
              <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center shrink-0">
                <User size={14} className="text-stone-400" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="max-w-[100px] truncate text-stone-800 font-bold">{username || "Người dùng"}</span>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-tighter">Thành viên Mielove</span>
              </div>
            </div>
            <Link href="/dashboard" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-600 text-sm font-semibold hover:bg-primary-100 transition-all border border-primary-100">
              <LayoutDashboard size={16} />
              Quản lý
            </Link>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-stone-600 shadow-sm hover:bg-red-50 hover:text-red-600 transition-all border border-stone-100"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <Link href="/auth/login" className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20">
            <User size={16} />
            Đăng nhập
          </Link>
        )}
        <button className="md:hidden p-2 text-stone-600 hover:bg-white/50 rounded-lg">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
