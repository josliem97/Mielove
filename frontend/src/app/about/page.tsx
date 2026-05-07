"use client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, MessageCircle, CheckCircle2, User, Code, Palette, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const workflow = [
    { id: 1, title: "Tiếp nhận yêu cầu", desc: "Khách hàng gửi thông tin qua Facebook, Zalo hoặc trực tiếp trên website" },
    { id: 2, title: "Tư vấn & Chọn mẫu", desc: "Chuyên viên tư vấn mẫu thiệp phù hợp với phong cách và ngân sách" },
    { id: 3, title: "Nhập nội dung", desc: "Khách cung cấp thông tin đám cưới, hình ảnh và yêu cầu tùy chỉnh" },
    { id: 4, title: "Thiết kế & Duyệt", desc: "Đội ngũ thiết kế thực hiện, khách duyệt và chỉnh sửa nếu cần" },
    { id: 5, title: "Xuất bản & Hỗ trợ", desc: "Thiệp được xuất bản, hỗ trợ kỹ thuật suốt vòng đời sử dụng" }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-stone-800">
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                Về <span className="text-primary-600">Mielove</span>
              </h1>
              <p className="text-xl text-stone-600 leading-relaxed mb-8">
                Chúng tôi tạo ra những thiệp cưới online đẹp và ý nghĩa, giúp mỗi đám cưới trở nên đặc biệt hơn. Mielove ra đời từ mong muốn mang đến những thiệp cưới online hiện đại, tiện lợi và thân thiện cho các cặp đôi Việt Nam.
              </p>
              <div className="flex gap-4">
                <button className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all">
                  Xem mẫu thiệp
                </button>
                <button className="px-8 py-4 border-2 border-primary-100 text-primary-600 rounded-full font-bold hover:bg-primary-50 transition-all">
                  Liên hệ ngay
                </button>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-[40px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop" 
                  alt="Mielove Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-3xl shadow-xl hidden md:block border border-stone-50">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="font-bold text-lg">1000+ Thiệp cưới</span>
                </div>
                <p className="text-stone-400 text-sm">Đã được tạo và đồng hành cùng các cặp đôi</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Contact & Founder Section */}
        <section className="bg-stone-50 py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-serif font-bold mb-4">Thông tin liên hệ</h2>
              <div className="w-20 h-1 bg-primary-600 mx-auto rounded-full" />
            </div>

            <div className="bg-white rounded-[40px] p-8 md:p-16 shadow-xl border border-stone-100 flex flex-col md:flex-row gap-12 items-center">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-[32px] bg-stone-100 shrink-0 overflow-hidden shadow-inner flex items-center justify-center">
                {/* Profile Image Placeholder */}
                <User size={80} className="text-stone-300" />
              </div>
              
              <div className="flex-grow">
                <h3 className="text-4xl font-serif font-bold text-stone-900 mb-2">Phạm Đức Liêm</h3>
                <div className="flex flex-wrap gap-3 mb-6">
                  {["Designer", "Website", "Phần Mềm", "Giải Pháp Doanh Nghiệp"].map(tag => (
                    <span key={tag} className="px-3 py-1 bg-stone-50 text-stone-500 text-xs font-bold rounded-full border border-stone-100">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <p className="text-stone-600 mb-8 italic text-lg leading-relaxed border-l-4 border-primary-200 pl-6">
                  "Sản phẩm chỉ thực sự tốt khi vừa đẹp, vừa đơn giản và luôn hoạt động ổn định."
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-stone-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-600 shadow-sm"><Phone size={20} /></div>
                    <div><p className="text-[10px] uppercase font-bold text-stone-400">Số điện thoại</p><p className="font-bold">0981 242068</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-stone-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-blue-500 shadow-sm"><MessageCircle size={20} /></div>
                    <div><p className="text-[10px] uppercase font-bold text-stone-400">Zalo</p><p className="font-bold">0981 242068</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-stone-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-rose-500 shadow-sm"><Mail size={20} /></div>
                    <div><p className="text-[10px] uppercase font-bold text-stone-400">Email</p><p className="font-bold">phamliem1997@gmail.com</p></div>
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-stone-50 hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-stone-100">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-green-600 shadow-sm"><MapPin size={20} /></div>
                    <div><p className="text-[10px] uppercase font-bold text-stone-400">Địa chỉ</p><p className="font-bold">Thanh Liêm, Ninh Bình</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-serif font-bold text-stone-900 mb-4">Quy trình làm việc</h2>
            <p className="text-stone-500">Chúng tôi tối ưu hóa quy trình để mang lại trải nghiệm tốt nhất cho bạn</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-stone-100 -translate-y-1/2 hidden lg:block" />
            
            <div className="grid lg:grid-cols-5 gap-8">
              {workflow.map((item, idx) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl transition-all group z-10"
                >
                  <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-2xl font-black text-stone-200 group-hover:bg-primary-600 group-hover:text-white transition-all mb-6">
                    {item.id}
                  </div>
                  <h4 className="text-lg font-bold text-stone-800 mb-3 group-hover:text-primary-600 transition-colors">{item.title}</h4>
                  <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
