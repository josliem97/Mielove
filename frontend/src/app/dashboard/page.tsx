"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Plus, Edit, Users, Eye, X, Copy, Trash2, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Wedding = {
  id: number;
  slug: string;
  groom_name: string;
  bride_name: string;
  wedding_date: string;
  guest_count?: number;
  confirmed_count?: number;
  is_paid?: boolean;
  plan_type?: string;
};

type Stats = {
    total: number;
    attending: number;
    wishes_only: number;
    not_attending: number;
    unread: number;
    total_adults: number;
    total_children: number;
};

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateIdParam = searchParams.get("create");

  const [weddings, setWeddings] = useState<Wedding[]>([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newWeddingData, setNewWeddingData] = useState({ groom_name: "", bride_name: "", wedding_date: "", template_id: "1" });
  const [creating, setCreating] = useState(false);
  const [errorInfo, setErrorInfo] = useState("");

  // Stats Modal
  const [showStats, setShowStats] = useState<number | null>(null);
  const [statsData, setStatsData] = useState<Stats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const fetchWeddings = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/me`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setWeddings(res.data);
    } catch (err: any) {
        if(err.response?.status === 401) router.push('/auth/login');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeddings();
    if (templateIdParam) {
        setNewWeddingData(prev => ({ ...prev, template_id: templateIdParam }));
        setShowCreateModal(true);
    }
  }, [router, templateIdParam]);

  const handleCreateWedding = async (e: React.FormEvent) => {
      e.preventDefault();
      setCreating(true);
      setErrorInfo("");
      try {
          const token = localStorage.getItem("access_token");
          
          let generatedSlug = (newWeddingData.groom_name + '-' + newWeddingData.bride_name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
          if (newWeddingData.wedding_date) {
            generatedSlug += '-' + newWeddingData.wedding_date.split('T')[0];
          }
          if (!generatedSlug) generatedSlug = `wedding-${Date.now()}`;

          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/`, {
              slug: generatedSlug,
              groom_name: newWeddingData.groom_name,
              bride_name: newWeddingData.bride_name,
              wedding_date: newWeddingData.wedding_date || null,
              template_id: parseInt(newWeddingData.template_id) || 1
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setShowCreateModal(false);
          router.push(`/builder/${res.data.id}`);
      } catch (err: any) {
          setErrorInfo(err.response?.data?.detail || "Có lỗi xảy ra, vui lòng thử lại.");
          setCreating(false);
      }
  };

  const handleClone = async (id: number) => {
    if (!confirm("Bạn muốn nhân bản thiệp cưới này?")) return;
    try {
        const token = localStorage.getItem("access_token");
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/${id}/clone`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchWeddings();
    } catch (err) {
        alert("Không thể nhân bản thiệp.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xoá thiệp cưới này? Mọi dữ liệu khách mời cũng sẽ mất.")) return;
    try {
        const token = localStorage.getItem("access_token");
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchWeddings();
    } catch (err) {
        alert("Không thể xoá thiệp.");
    }
  };

  const openStats = async (id: number) => {
    setShowStats(id);
    setLoadingStats(true);
    try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/stats/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setStatsData(res.data);
    } catch (err) {
        console.error(err);
    } finally {
        setLoadingStats(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-stone-900">Dashboard của bạn</h1>
           <Link href="/templates" className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl shadow-md hover:bg-primary-700 transition-all font-medium">
             <Plus size={18} />
             Tạo thiệp mới
           </Link>
        </div>

        {loading ? (
             <div className="text-center py-20 text-stone-500">Đang tải dữ liệu...</div>
        ) : weddings.length === 0 ? (
             <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-stone-100">
                <div className="w-16 h-16 bg-primary-50 text-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus size={32} />
                </div>
                <h3 className="text-xl font-bold mb-2">Chưa có thiệp cưới nào</h3>
                <p className="text-stone-500 mb-6">Bạn chưa tạo thiệp cưới nào. Hãy bắt đầu chọn mẫu và thiết kế nhé.</p>
                <Link href="/templates" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-full font-medium hover:bg-primary-700 transition">Khám phá kho giao diện</Link>
             </div>
        ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {weddings.map((w) => {
                    // Calculate progress if data exists
                    const confirmed = w.confirmed_count || 0;
                    const total = w.guest_count || 0;
                    const progress = total > 0 ? (confirmed / total) * 100 : 0;

                    return (
                    <div key={w.id} className="bg-white border border-stone-100 rounded-[32px] p-0 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500 overflow-hidden flex flex-col group relative">
                        {/* Dynamic Plan Badge */}
                        <div className="absolute top-6 right-[-35px] rotate-45 z-10 shadow-sm">
                            {w.plan_type === 'premium' ? (
                                <div className="bg-[#6d0208] text-white text-[9px] font-bold uppercase tracking-[2px] py-1.5 px-10">
                                    Premium
                                </div>
                            ) : w.plan_type === 'basic' ? (
                                <div className="bg-primary-600 text-white text-[9px] font-bold uppercase tracking-[2px] py-1.5 px-10">
                                    Basic
                                </div>
                            ) : (
                                <div className="bg-stone-400 text-white text-[9px] font-bold uppercase tracking-[2px] py-1.5 px-10">
                                    Free
                                </div>
                            )}
                        </div>

                        {/* Top Banner / Status */}
                        <div className="h-32 bg-[#FAF9F6] relative overflow-hidden flex items-center justify-center border-b border-stone-50">
                             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
                             <div className="relative z-10 text-center">
                                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-sm mb-2 group-hover:scale-110 transition-transform duration-500">
                                     {w.is_paid ? (
                                         <Eye size={20} className="text-[#6d0208]" />
                                     ) : (
                                         <Plus size={20} className="text-stone-300" />
                                     )}
                                 </div>
                                 <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{w.slug}</span>
                             </div>
                        </div>
                        
                        <div className="p-8 flex-grow">
                            <div className="mb-6">
                                <h3 className="text-2xl font-serif font-bold text-stone-900 mb-1 leading-tight group-hover:text-[#6d0208] transition-colors">{w.groom_name || 'Chú rể'} & {w.bride_name || 'Cô dâu'}</h3>
                                <p className="text-[11px] text-stone-400 font-medium uppercase tracking-wider">{w.wedding_date ? new Date(w.wedding_date).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Ngày chưa xác định'}</p>
                            </div>

                            {/* RSVP Progress Bar */}
                            <div className="mb-8 space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-tight">Tỷ lệ phản hồi</span>
                                    <span className="text-[11px] font-bold text-[#6d0208]">{confirmed}/{total} khách đã xác nhận</span>
                                </div>
                                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-gradient-to-r from-[#de7b9e] to-[#6d0208]"
                                    />
                                </div>
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <Link href={`/builder/${w.id}`} className="flex items-center justify-center gap-2 py-3.5 bg-stone-900 text-white rounded-2xl text-[13px] font-bold hover:bg-black transition-all shadow-lg shadow-stone-200">
                                    Thiết kế thiệp
                                </Link>
                                <button 
                                    onClick={() => {
                                        if (!w.is_paid) {
                                            if (confirm("Bạn cần nâng cấp gói dịch vụ để Xem thực tế thiệp mời này. Đi tới trang bảng giá?")) {
                                                router.push('/pricing');
                                            }
                                        } else {
                                            window.open(`/${w.slug}`, '_blank');
                                        }
                                    }}
                                    className="flex items-center justify-center gap-2 py-3.5 border border-stone-100 rounded-2xl text-[13px] font-bold hover:bg-stone-50 transition-all text-stone-700"
                                >
                                    Xem thực tế
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                <button onClick={() => openStats(w.id)} className="flex items-center justify-center gap-2 py-3 border border-[#fff1f2] bg-[#fffcfc] text-[#de7b9e] rounded-2xl text-[13px] font-bold hover:bg-[#fff1f2] transition-all">
                                    Thống kê
                                </button>
                                <Link href={`/dashboard/guests/${w.id}`} className="flex items-center justify-center gap-2 py-3 border border-stone-100 rounded-2xl text-[13px] font-bold hover:bg-stone-50 transition-all text-stone-700">
                                    Khách mời
                                </Link>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-stone-50 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <button onClick={() => handleClone(w.id)} className="flex items-center gap-2 text-[11px] font-bold text-stone-400 hover:text-stone-600 transition-all">
                                    <Copy size={14} /> Nhân bản
                                </button>
                                <button onClick={() => handleDelete(w.id)} className="flex items-center gap-2 text-[11px] font-bold text-stone-400 hover:text-red-500 transition-all">
                                    <Trash2 size={14} /> Xoá bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                 )})}
             </div>
        )}
      </div>

      {/* Stats Modal */}
      <AnimatePresence>
          {showStats !== null && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-stone-900/60 z-[100] flex items-center justify-center p-4"
                onClick={() => setShowStats(null)}
              >
                  <motion.div 
                    initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
                    className="bg-white rounded-[32px] p-8 max-w-lg w-full shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                      <button onClick={() => setShowStats(null)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><X size={24} /></button>
                      
                      <div className="flex items-center gap-4 mb-8">
                          <div className="p-4 bg-rose-50 text-rose-500 rounded-3xl"><BarChart2 size={32} /></div>
                          <div>
                              <h2 className="text-2xl font-bold text-stone-900">Thống kê RSVP</h2>
                              <p className="text-sm text-stone-400">Xem nhanh phản hồi từ khách mời</p>
                          </div>
                      </div>

                      {loadingStats ? (
                          <div className="py-20 text-center text-stone-400 font-medium">Đang phân tích dữ liệu...</div>
                      ) : statsData && (
                          <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="bg-[#fff1f2] p-6 rounded-3xl border border-rose-100">
                                      <div className="text-rose-600 font-black text-4xl mb-1">{statsData.attending}</div>
                                      <div className="text-rose-400 text-xs font-bold uppercase">Sẽ tham dự</div>
                                  </div>
                                  <div className="bg-stone-50 p-6 rounded-3xl border border-stone-100">
                                      <div className="text-stone-800 font-black text-4xl mb-1">{statsData.total}</div>
                                      <div className="text-stone-400 text-xs font-bold uppercase">Tổng thiệp</div>
                                  </div>
                              </div>

                              <div className="bg-white border border-stone-100 rounded-3xl p-6 space-y-4">
                                  <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2"><div className="w-2 h-2 bg-rose-400 rounded-full"></div><span className="text-sm font-medium text-stone-600">Người lớn</span></div>
                                      <span className="font-bold text-stone-900">{statsData.total_adults} người</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                      <div className="flex items-center gap-2"><div className="w-2 h-2 bg-rose-300 rounded-full"></div><span className="text-sm font-medium text-stone-600">Trẻ em</span></div>
                                      <span className="font-bold text-stone-900">{statsData.total_children} người</span>
                                  </div>
                                  <div className="h-px bg-stone-50 w-full"></div>
                                  <div className="flex justify-between items-center pt-2">
                                      <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">Loại phản hồi</span>
                                      <div className="flex gap-4">
                                          <div className="text-center"><div className="font-bold text-stone-700">{statsData.wishes_only}</div><div className="text-[10px] text-stone-400">Lời chúc</div></div>
                                          <div className="text-center"><div className="font-bold text-stone-700">{statsData.not_attending}</div><div className="text-[10px] text-stone-400">Tiếc nuối</div></div>
                                          <div className="text-center"><div className="font-bold text-stone-700">{statsData.unread}</div><div className="text-[10px] text-stone-400">Chưa xem</div></div>
                                      </div>
                                  </div>
                              </div>

                              <button onClick={() => router.push(`/dashboard/guests/${showStats}`)} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold shadow-lg hover:bg-stone-800 transition">Xem chi tiết danh sách</button>
                          </div>
                      )}
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>

      <AnimatePresence>
          {showCreateModal && (
              <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-stone-900/60 z-[100] flex items-center justify-center p-4"
              >
                  <motion.div 
                      initial={{ scale: 0.95, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.95, y: 20 }}
                      className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl relative"
                  >
                      <button onClick={() => { setShowCreateModal(false); router.push('/dashboard'); }} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600"><X size={24} /></button>
                      
                      <h2 className="text-2xl font-bold text-stone-900">Tạo thiệp cưới nhanh</h2>
                      <p className="text-sm text-stone-500 mb-6 mt-1">Nhập vài thông tin quan trọng, rồi vào thẳng Builder để chỉnh chi tiết.</p>
                      
                      {errorInfo && <div className="p-3 bg-red-50 text-red-600 rounded-xl mb-4 text-sm font-medium">{errorInfo}</div>}
                      
                      <form onSubmit={handleCreateWedding} className="space-y-5">
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Tên chú rể</label>
                                  <input type="text" required placeholder="VD: Quang Huy" value={newWeddingData.groom_name} onChange={(e) => setNewWeddingData({...newWeddingData, groom_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition" />
                              </div>
                              <div>
                                  <label className="block text-sm font-semibold text-stone-700 mb-1.5">Tên cô dâu</label>
                                  <input type="text" required placeholder="VD: Thảo Uyên" value={newWeddingData.bride_name} onChange={(e) => setNewWeddingData({...newWeddingData, bride_name: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition" />
                              </div>
                          </div>

                          <div>
                              <label className="block text-sm font-semibold text-stone-700 mb-1.5">Ngày cưới chính</label>
                              <input type="datetime-local" value={newWeddingData.wedding_date} onChange={(e) => setNewWeddingData({...newWeddingData, wedding_date: e.target.value})} className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition text-stone-600" />
                          </div>

                          <div className="pt-2 flex justify-between items-end border-t border-stone-100">
                             <div className="text-[11px] text-stone-400 pb-2 truncate max-w-[150px]">
                                 /{(newWeddingData.groom_name || newWeddingData.bride_name) ? (newWeddingData.groom_name + '-' + newWeddingData.bride_name).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') : "wedding"}
                             </div>
                             <div className="flex gap-3">
                                 <button type="button" onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 bg-white border border-stone-200 text-stone-600 rounded-xl hover:bg-stone-50 transition text-sm font-medium">Bỏ qua</button>
                                 <button type="submit" disabled={creating} className="px-5 py-2.5 bg-[#de7b9e] text-white rounded-xl hover:bg-[#c9668a] transition text-sm font-bold disabled:opacity-70 shadow-lg shadow-rose-200">{creating ? "Đang tạo..." : "Tạo ngay"}</button>
                             </div>
                          </div>
                      </form>
                  </motion.div>
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
