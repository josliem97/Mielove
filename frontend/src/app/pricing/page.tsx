"use client";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Check, CreditCard, QrCode, ShieldCheck, Zap } from 'lucide-react';

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<null | { name: string, price: string, amount: number }>(null);

  const plans = [
    {
      name: "Gói Cơ Bản",
      price: "100.000",
      amount: 100000,
      description: "Dành cho cá nhân muốn tự tạo thiệp nhanh chóng.",
      features: [
        "Tạo 01 thiệp cưới online",
        "Sử dụng 100+ mẫu có sẵn",
        "Chỉnh sửa nội dung, hình ảnh",
        "Quản lý danh sách khách mời",
        "Nhận lời chúc từ khách",
        "Lưu trữ trong 6 tháng"
      ],
      buttonText: "Bắt đầu ngay",
      popular: false
    },
    {
      name: "Gói Cao Cấp",
      price: "150.000",
      amount: 150000,
      description: "Đầy đủ tính năng, hỗ trợ chuyên nghiệp.",
      features: [
        "Tất cả tính năng gói Cơ bản",
        "Không giới hạn ảnh Album",
        "Nhạc nền tự chọn (Upload)",
        "Hiệu ứng hiệu ứng bay bổng",
        "Quản lý RSVP (Xác nhận tham dự)",
        "Lưu trữ trọn đời (Vĩnh viễn)",
        "Hỗ trợ chỉnh sửa lỗi 24/7"
      ],
      buttonText: "Chọn Gói Premium",
      popular: true
    }
  ];

  const handleSelectPlan = (plan: any) => {
    setSelectedPlan(plan);
  };

  // VietQR generation URL
  const getQrUrl = (amount: number, description: string) => {
    const bankId = "970407"; // Techcombank
    const accountNo = "1903893801013";
    return `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.jpg?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=Pham%20Duc%20Liem`;
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      
      <main className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            Bảng giá dịch vụ
          </h1>
          <p className="text-stone-600 text-lg max-w-2xl mx-auto">
            Lựa chọn gói dịch vụ phù hợp với nhu cầu và ngân sách của bạn để tạo ra những website cưới, thiệp mời tuyệt đẹp và ấn tượng.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white rounded-3xl p-8 shadow-xl border-2 transition-all hover:scale-[1.02] ${
                plan.popular ? 'border-primary-500 ring-4 ring-primary-500/10' : 'border-stone-100'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                  Phổ biến nhất
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-stone-800 mb-2">{plan.name}</h3>
                <p className="text-stone-500 text-sm h-10">{plan.description}</p>
                <div className="mt-6 flex items-baseline">
                  <span className="text-5xl font-bold text-stone-900">{plan.price}</span>
                  <span className="ml-2 text-stone-500 font-medium">VNĐ</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-50 rounded-full p-1">
                      <Check size={14} className="text-green-600" />
                    </div>
                    <span className="text-stone-600 text-[15px]">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSelectPlan(plan)}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  plan.popular 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700' 
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <ShieldCheck className="text-primary-600" />, title: "Thanh toán an toàn", text: "Mọi giao dịch đều được bảo mật tuyệt đối qua hệ thống ngân hàng." },
            { icon: <Zap className="text-primary-600" />, title: "Kích hoạt tức thì", text: "Thiệp của bạn sẽ được kích hoạt ngay sau khi hệ thống nhận được thanh toán." },
            { icon: <CreditCard className="text-primary-600" />, title: "Hỗ trợ 24/7", text: "Chúng tôi luôn sẵn sàng hỗ trợ bạn trong suốt quá trình sử dụng." }
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h4 className="font-bold text-stone-800 mb-2">{item.title}</h4>
              <p className="text-stone-500 text-sm">{item.text}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Payment Modal */}
      {selectedPlan && (
        <div 
          className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-stone-900/80 backdrop-blur-md"
          onClick={() => setSelectedPlan(null)}
        >
          <div 
            className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedPlan(null)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/10 text-stone-600 hover:bg-black/20 transition-colors z-10"
            >
              ✕
            </button>

            <div className="bg-primary-600 p-6 text-white text-center">
              <h3 className="text-xl font-bold">Thanh toán chuyển khoản</h3>
              <p className="text-primary-100 text-sm mt-1">Quét mã QR để kích hoạt {selectedPlan.name}</p>
            </div>
            
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white border-2 border-stone-100 rounded-2xl shadow-inner relative group">
                  <img 
                    src={`https://img.vietqr.io/image/970407-1903893801013-compact2.jpg?amount=${selectedPlan.amount}&addInfo=MIELOVE%20${selectedPlan.name.toUpperCase().replace(/\s/g, '%20')}&accountName=Pham%20Duc%20Liem`} 
                    alt="Payment QR Code"
                    className="w-64 h-64"
                  />
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors pointer-events-none rounded-xl" />
                </div>
              </div>

              <div className="space-y-4 bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Chủ tài khoản:</span>
                  <span className="font-bold text-stone-800 uppercase text-right">Pham Duc Liem</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Số tài khoản:</span>
                  <span className="font-bold text-stone-800 tracking-wider">1903 8938 9010 13</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Ngân hàng:</span>
                  <span className="font-bold text-stone-800">Techcombank</span>
                </div>
                <div className="flex justify-between text-sm border-t border-stone-200 pt-4">
                  <span className="text-stone-500">Số tiền:</span>
                  <span className="font-bold text-primary-600 text-lg">{selectedPlan.price} VNĐ</span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-[13px] text-stone-500 leading-relaxed italic">
                  * Hệ thống sẽ tự động kích hoạt sau khi nhận được thanh toán. 
                  Vui lòng giữ nguyên nội dung chuyển khoản để được xác nhận nhanh nhất.
                </p>
                <button 
                  onClick={() => setSelectedPlan(null)}
                  className="mt-6 w-full py-3 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 font-semibold text-sm transition-all"
                >
                  Đã hiểu và đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
