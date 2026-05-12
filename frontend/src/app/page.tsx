"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, Paintbrush, Share2, MousePointer2, MessageCircle, BarChart3, Music } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-primary-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary-200 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-amber-100 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-4xl"
        >
          <h1 className="text-5xl md:text-[5rem] font-bold mb-6 font-serif tracking-tight text-primary-600 leading-tight uppercase shadow-sm">
            Mielove
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold mb-8 text-stone-800">
            Viết tiếp câu chuyện tình yêu
          </h2>
          <p className="text-lg md:text-xl text-stone-600 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
            Hãy để Mielove giúp bạn lưu giữ thanh xuân qua từng tấm thiệp điện tử – tinh tế, tràn đầy sức sống và mang đậm dấu ấn cá nhân của chính bạn.
          </p>
          
          <Link href="/templates" className="inline-flex items-center gap-2 px-10 py-4 bg-primary-500 text-white rounded-full font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 hover:bg-primary-600 transition-all hover:-translate-y-1">
            Bắt đầu tạo thiệp <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>

      {/* Popular Templates */}
      <section className="py-20 px-6 max-w-7xl mx-auto relative z-10">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h2 className="text-3xl font-bold text-stone-800 font-serif">Mẫu thiết kế nổi bật</h2>
                <p className="text-stone-500 mt-2 text-sm">Được thiết kế bởi đội ngũ Mielove — sẵn sàng để bạn cá nhân hoá</p>
            </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
            {[
                { name: "Hoa Mộc Xanh", style: "Premium", img: "https://cdn.chungdoi.com/uploads/296d082d-c2bf-4510-a9e3-c7bdea13f850.webp", premium: true, preview_url: "/hoa-moc-xanh" },
                { name: "Quang Huy - Thảo Uyên", style: "Hiện đại", img: "/images/templates/53/1773995333916-1770739033371-z7522565669715_eece88b42ebab4a5b591cf73c816cf19.webp", premium: true, preview_url: "/quang-huy-thao-uyen-2026-05-09" },
                { name: "Thanh Sơn - Diệu Nhi", style: "Tối giản", img: "/uploads/69b95065dcc4597893deb84b/1773752594568-1768964174030-615120422_925471073144357_5596178545909683221_n.webp", premium: true, preview_url: "/thanh-son-dieu-nhi-demo" },
            ].map((tpl, id) => (
                <motion.div 
                    key={id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: id * 0.1, duration: 0.5 }}
                    className="bg-white rounded-2xl overflow-hidden group relative border border-stone-100 hover:border-primary-300 transition-all shadow-sm hover:shadow-xl"
                >
                    <div className="aspect-[3/4] relative overflow-hidden bg-stone-50">
                        {tpl.premium && <div className="absolute top-2 right-2 bg-gradient-to-r from-primary-500 to-rose-400 text-white text-[10px] uppercase font-bold px-2 py-1 rounded z-10 shadow">Premium</div>}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={tpl.img} alt={tpl.name} className="object-cover w-full h-full group-hover:scale-105 transition-all duration-700" />
                        <div className="absolute inset-0 bg-white/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-3 items-center justify-center backdrop-blur-[2px]">
                            <Link href="/templates" className="px-8 py-2.5 bg-primary-500 text-white rounded-full text-sm font-medium hover:bg-primary-600 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl w-[120px] text-center">Dùng mẫu</Link>
                            <a href={tpl.preview_url} target="_blank" rel="noreferrer" className="px-8 py-2.5 bg-white text-primary-600 rounded-full text-sm font-bold border-2 border-primary-500 hover:bg-primary-50 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-xl w-[120px] text-center">Xem thử</a>
                        </div>
                    </div>
                    <div className="p-3">
                        <p className="text-sm font-bold text-stone-800 truncate">{tpl.name}</p>
                        <p className="text-[11px] text-stone-400 mt-0.5">{tpl.style}</p>
                    </div>
                </motion.div>
            ))}
        </div>
        <div className="mt-14 text-center">
             <Link href="/templates" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-stone-700 rounded-full font-medium hover:bg-stone-50 transition-colors border border-stone-200 shadow-sm">
                Xem thêm mẫu thiết kế <ArrowRight size={16} />
             </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
                <h2 className="text-4xl md:text-5xl font-bold text-primary-600 font-serif mb-6 leading-tight">
                    MIELOVE - Nơi thiệp cưới trở thành những kỷ niệm đáng nhớ
                </h2>
                <p className="text-stone-600 mb-12 text-lg leading-relaxed">
                    Mielove mang đến giải pháp thiệp cưới online hiện đại, giúp bạn dễ dàng tạo nên những tấm thiệp độc đáo, đầy cảm xúc mà không cần bất kỳ thao tác phức tạp nào.
                </p>

                <div className="space-y-10">
                    <div className="flex gap-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 shadow-sm border border-primary-100">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 className="text-stone-800 font-bold text-xl mb-2">Kho mẫu thiệp đa dạng & tinh tế</h3>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed">Hàng trăm mẫu thiệp trực tuyến được thiết kế chỉn chu, từ phong cách tối giản thanh lịch hiện đại cho đến retro.</p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 shadow-sm border border-primary-100">
                            <Paintbrush size={24} />
                        </div>
                        <div>
                            <h3 className="text-stone-800 font-bold text-xl mb-2">Cá nhân hoá theo cách của bạn</h3>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed">Dễ dàng tuỳ chỉnh màu sắc, phông chữ, hình ảnh và nội dung để tạo nên một tấm thiệp mang đậm phong cách tuyệt đối.</p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="flex-shrink-0 w-14 h-14 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 shadow-sm border border-primary-100">
                            <Share2 size={24} />
                        </div>
                        <div>
                            <h3 className="text-stone-800 font-bold text-xl mb-2">Chia sẻ nhanh – Trân trọng từng khách mời</h3>
                            <p className="text-stone-600 text-sm md:text-base leading-relaxed">Gửi link thiệp cực chóng. Đặc biệt, bạn có thể cá nhân hoá tên từng người tham dự để họ nhận được phiên bản riêng.</p>
                        </div>
                    </div>
                </div>

                <div className="mt-14">
                    <Link href="/templates" className="inline-flex items-center px-10 py-4 bg-primary-500 text-white rounded-full font-medium hover:bg-primary-600 transition-colors shadow-lg shadow-primary-500/20">
                        Bắt đầu tạo thiệp
                    </Link>
                </div>
            </div>

            <div className="relative mt-10 lg:mt-0">
                <div className="relative bg-white border border-stone-100 rounded-3xl p-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 ease-out z-10">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80&w=800" alt="Mockup" className="rounded-2xl w-full h-auto opacity-95 shadow-inner" />
                    
                    <div className="absolute -bottom-10 -left-6 md:-left-12 bg-white p-5 rounded-2xl border border-stone-100 shadow-[0_10px_40px_rgba(0,0,0,0.1)] flex items-center gap-4 z-20">
                         <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-100">
                             <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" alt="Guest" />
                         </div>
                         <div>
                             <p className="text-xs text-stone-500 mb-0.5">Trân trọng kính mời</p>
                             <p className="font-serif text-xl text-primary-600 font-bold">Chị Thủy Phương</p>
                         </div>
                    </div>

                    <div className="absolute -top-6 -right-6 bg-white px-4 py-2 rounded-xl border border-stone-100 shadow-xl flex items-center gap-2 z-20">
                        <Music size={16} className="text-primary-500" />
                        <span className="text-xs font-medium text-stone-600">A Thousand Years</span>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Real Customers */}
      <section className="py-24 px-6 max-w-[1400px] mx-auto bg-white rounded-[3rem] shadow-sm mb-24 border border-stone-100">
        <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-stone-800 font-serif">Thiệp đã thiết kế từ khách hàng</h2>
            <p className="text-stone-500 mt-3 text-sm max-w-lg mx-auto">Hàng ngàn cặp đôi đã tin tưởng Mielove để tạo nên khoảnh khắc đáng nhớ nhất đời mình</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 px-6">
             {[
                 { couple: "Minh Quân & Thu Hà", date: "24/05/2026", img: "https://cdn.chungdoi.com/uploads/296d082d-c2bf-4510-a9e3-c7bdea13f850.webp", link: "/hoa-moc-xanh" },
                 { couple: "Quang Huy & Thảo Uyên", date: "09/05/2026", img: "/images/templates/53/1773995333916-1770739033371-z7522565669715_eece88b42ebab4a5b591cf73c816cf19.webp", link: "/quang-huy-thao-uyen-2026-05-09" },
                 { couple: "Thành Liêm & Trà My", date: "16/05/2026", img: "/uploads/69b95065dcc4597893deb84b/1773752594568-1768964174030-615120422_925471073144357_5596178545909683221_n.webp", link: "/thanh-liem-tra-my-2026-05-16" },
                 { couple: "Thanh Sơn & Diệu Nhi", date: "31/12/2026", img: "/uploads/69b95065dcc4597893deb84b/1774080179841-1768964157102-615400830_925471493144315_1411328482513847053_n.webp", link: "/thanh-son-dieu-nhi-demo" },
                 { couple: "Hoàng Long & Ngọc Mai", date: "05/05/2026", img: "/previews/template_4.png" },
                 { couple: "Văn Khoa & Bích Ngọc", date: "10/06/2026", img: "/previews/template_5.png" },
                 { couple: "Thanh Tùng & Hải Yến", date: "25/09/2026", img: "/previews/template_1.png" },
             ].map((item, i) => (
                 <motion.div 
                     key={i}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.07, duration: 0.4 }}
                     className="aspect-[2/3] bg-stone-100 rounded-xl overflow-hidden group relative border border-stone-200 cursor-pointer"
                     onClick={() => item.link && window.open(item.link, '_blank')}
                 >
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={item.img} className="object-cover w-full h-full group-hover:scale-110 transition-all duration-700" alt={item.couple} />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent group-hover:from-black/60 transition-all"></div>
                     <div className="absolute bottom-0 left-0 p-4 w-full">
                         <p className="text-sm text-white font-bold truncate">{item.couple}</p>
                         <p className="text-[10px] text-stone-300">{item.date}</p>
                     </div>
                     {i === 0 && (
                         <div className="absolute top-2 left-2 bg-primary-500/90 backdrop-blur-sm text-white text-[9px] uppercase font-bold px-2 py-1 rounded shadow">
                             Xem demo
                         </div>
                     )}
                 </motion.div>
             ))}
        </div>
      </section>

      {/* More Reasons */}
      <section className="py-24 px-6 bg-primary-50 border-t border-primary-100">
         <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-stone-800 font-serif text-center mb-16">Thêm lý do để chọn Mielove</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-stone-100 hover:border-primary-300 transition-colors shadow-sm hover:shadow-xl">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-6">
                        <MousePointer2 size={24} />
                    </div>
                    <h3 className="text-stone-800 font-bold mb-3 text-lg">
                        Thiết kế kéo thả dễ dàng
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        Tùy biến thiệp cưới không giới hạn với công cụ thân thiện. Thay đổi bất kỳ thành phần nào theo ý bạn.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-stone-100 hover:border-primary-300 transition-colors shadow-sm hover:shadow-xl">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-6">
                        <MessageCircle size={24} />
                    </div>
                    <h3 className="text-stone-800 font-bold mb-3 text-lg">
                        Tương tác với khách mời
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        Khách mời có thể gửi lời chúc, bình luận, xác nhận tham gia vô cùng ấm áp thân thiết.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-stone-100 hover:border-primary-300 transition-colors shadow-sm hover:shadow-xl">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-6">
                        <BarChart3 size={24} />
                    </div>
                    <h3 className="text-stone-800 font-bold mb-3 text-lg">
                        Thống kê chi tiết
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        Theo dõi lượt xem thiệp, cập nhật số lượng khách mời xác nhận tham dự tự động và linh hoạt.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-stone-100 hover:border-primary-300 transition-colors shadow-sm hover:shadow-xl">
                    <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-500 mb-6">
                        <Music size={24} />
                    </div>
                    <h3 className="text-stone-800 font-bold mb-3 text-lg">
                        Nhạc nền lãng mạn
                    </h3>
                    <p className="text-sm text-stone-600 leading-relaxed">
                        Thêm nhạc tự động theo nội dung thiệp đong đầy cảm xúc yêu thương cho đôi uyên ương.
                    </p>
                </div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}
