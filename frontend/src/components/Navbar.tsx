import Link from 'next/link';
import { User, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-[100] px-6 py-4 flex items-center justify-between text-stone-800 border-b border-white/20 bg-white/70 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold font-serif shadow-lg shadow-primary-500/30">M</div>
        <span className="text-2xl font-bold font-serif tracking-wide text-primary-600">Mielove</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-[15px] font-medium">
        <Link href="/" className="text-primary-600 font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Trang chủ</Link>
        <Link href="/templates" className="text-stone-700 hover:text-primary-600 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Mẫu thiệp</Link>
        <Link href="/dashboard" className="text-stone-700 hover:text-primary-600 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Thiệp đã tạo</Link>
        <Link href="/pricing" className="text-stone-700 hover:text-primary-600 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Gói dịch vụ</Link>
        <Link href="/contact" className="text-stone-700 hover:text-primary-600 transition-colors drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Liên hệ</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/auth/login" className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-white text-primary-600 shadow-md hover:bg-primary-50 transition-all border border-primary-100">
          <User size={18} />
        </Link>
        <button className="md:hidden p-2 text-stone-600 hover:bg-white/50 rounded-lg">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
