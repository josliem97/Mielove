import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white text-stone-600 py-16 px-6 border-t border-stone-100">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-bold font-serif shadow-sm">M</div>
                        <span className="text-xl font-bold text-primary-600 font-serif tracking-widest">Mielove</span>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed mb-8 text-stone-500">
                        Nền tảng tạo thiệp cưới online cao cấp, thiết kế kéo thả dễ sử dụng. Giúp bạn lưu giữ và lan tỏa kỷ niệm ngày trọng đại một cách tinh tế.
                    </p>
                    <p className="text-xs flex items-center gap-1 font-medium text-stone-400">
                        Sản phẩm tạo ra với <Heart size={14} className="text-primary-500 mx-1 fill-primary-500" /> tại Việt Nam
                    </p>
                </div>
                <div>
                    <h4 className="text-stone-800 font-bold mb-6 text-lg font-serif">Sản phẩm</h4>
                    <ul className="space-y-4 text-sm text-stone-500">
                        <li><Link href="/templates" className="hover:text-primary-600 transition-colors flex items-center gap-2"> Kho giao diện</Link></li>
                        <li><Link href="/pricing" className="hover:text-primary-600 transition-colors flex items-center gap-2"> Bảng giá tham khảo</Link></li>
                        <li><Link href="/features" className="hover:text-primary-600 transition-colors flex items-center gap-2"> Tính năng nổi bật</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-stone-800 font-bold mb-6 text-lg font-serif">Hỗ trợ</h4>
                    <ul className="space-y-4 text-sm text-stone-500">
                        <li><Link href="/faq" className="hover:text-primary-600 transition-colors flex items-center gap-2"> Câu hỏi thường gặp</Link></li>
                        <li><Link href="/contact" className="hover:text-primary-600 transition-colors flex items-center gap-2"> Liên hệ đội ngũ</Link></li>
                        <li><Link href="/terms" className="hover:text-primary-600 transition-colors flex items-center gap-2"> Điều khoản dịch vụ</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
}
