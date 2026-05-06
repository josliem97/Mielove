"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ArrowLeft, UserPlus, Copy, Check, Info, MailOpen, UserX, Gift } from "lucide-react";

type Guest = {
    id: number;
    wedding_id: number;
    guest_name: string;
    custom_slug: string;
    status: string;
    adult_count: number;
    children_count: number;
    wish_message: string;
    category: string;
};

type Wedding = {
    id: number;
    slug: string;
    groom_name: string;
    bride_name: string;
};

export default function GuestManagement({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [wedding, setWedding] = useState<Wedding | null>(null);
    const [loading, setLoading] = useState(true);

    const [newGuestName, setNewGuestName] = useState("");
    const [newGuestSlug, setNewGuestSlug] = useState("");
    const [newGuestCategory, setNewGuestCategory] = useState("Bạn bè");
    const [activeFilter, setActiveFilter] = useState("Tất cả");
    const [creating, setCreating] = useState(false);
    const [copiedId, setCopiedId] = useState<number | null>(null);

    // Batch Import State
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [batchText, setBatchText] = useState("");
    const [importing, setImporting] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            router.push("/auth/login");
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch wedding details (requires auth token)
                const wedRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/id/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWedding(wedRes.data);

                // Fetch guests list
                const guestRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setGuests(guestRes.data);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id, router]);

    // Auto generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setNewGuestName(val);
        setNewGuestSlug(
            val.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
        );
    };

    const handleCreateGuest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newGuestName || !newGuestSlug) return;
        setCreating(true);
        try {
            const token = localStorage.getItem("access_token");
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/${params.id}`, {
                guest_name: newGuestName,
                custom_slug: newGuestSlug,
                category: newGuestCategory,
                adult_count: 1
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGuests([...guests, res.data]);
            setNewGuestName("");
            setNewGuestSlug("");
        } catch (err) {
            alert("Lỗi khi thêm khách. Có thể mã slug bị trùng.");
        } finally {
            setCreating(false);
        }
    };

    const copyLink = (guestSlug: string, guestId: number) => {
        if (!wedding) return;
        const url = `${window.location.origin}/${wedding.slug}?to=${guestSlug}`;
        navigator.clipboard.writeText(url);
        setCopiedId(guestId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDeleteGuest = async (guestId: number, guestName: string) => {
        if (!confirm(`Bạn có chắc muốn xóa khách "${guestName}"?`)) return;
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/item/${guestId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setGuests(prev => prev.filter(g => g.id !== guestId));
        } catch (err) {
            alert("Không thể xóa khách. Vui lòng thử lại.");
        }
    };

    const exportToCSV = () => {
        if (guests.length === 0) return;

        const headers = ["Tên khách", "Mã Slug", "Trạng thái", "Người lớn", "Trẻ em", "Nhóm/Họ hàng", "Lời chúc"];
        const rows = guests.map(g => [
            g.guest_name,
            g.custom_slug,
            g.status,
            g.adult_count,
            g.children_count,
            g.category,
            `"${g.wish_message || ''}"`
        ]);

        const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `khach_moi_${wedding?.slug || 'wedding'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBatchImport = async () => {
        if (!batchText.trim()) return;
        setImporting(true);
        try {
            const token = localStorage.getItem("access_token");
            const lines = batchText.split('\n').filter(line => line.trim() !== "");

            const batchData = lines.map(line => {
                const parts = line.split('\t'); // Handle Excel paste (tabs)
                const name = parts[0]?.trim();
                const category = parts[1]?.trim() || "Bạn bè";
                const slug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

                return {
                    guest_name: name,
                    custom_slug: slug,
                    category: category,
                    adult_count: 1
                };
            }).filter(g => g.guest_name);

            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/${params.id}/batch`, {
                guests: batchData
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setGuests([...guests, ...res.data]);
            setShowBatchModal(false);
            setBatchText("");
        } catch (err) {
            alert("Lỗi khi nhập dữ liệu hàng loạt. Vui lòng kiểm tra định dạng.");
        } finally {
            setImporting(false);
        }
    };

    const categories = ["Bạn bè", "Gia đình", "Đồng nghiệp", "Họ hàng", "Khác"];
    const filteredGuests = activeFilter === "Tất cả" ? guests : guests.filter(g => g.category === activeFilter);

    const renderStatusBadge = (status: string) => {
        switch (status) {
            case 'attending': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><Check size={12} /> Tham dự</span>;
            case 'not_attending': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><UserX size={12} /> Cáo lỗi</span>;
            case 'wishes_only': return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Gift size={12} /> Gửi quà/Lời chúc</span>;
            default: return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600"><Info size={12} /> Chưa xem</span>;
        }
    };

    if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center">Đang tải danh sách...</div>;

    const summary = {
        total: guests.length,
        attending: guests.filter(g => g.status === 'attending').length,
        adults: guests.filter(g => g.status === 'attending').reduce((acc, curr) => acc + curr.adult_count, 0),
        wishes: guests.filter(g => g.wish_message && g.wish_message.trim() !== "").length
    };

    return (
        <div className="min-h-screen bg-stone-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="text-stone-500 hover:text-stone-800 transition bg-white p-2 border border-stone-200 rounded-lg shadow-sm"><ArrowLeft size={18} /></Link>
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-stone-900">Quản lý Khách mời</h1>
                        <p className="text-stone-500 mt-1 uppercase text-[10px] font-bold tracking-[2px]">Đám cưới: {wedding?.groom_name} & {wedding?.bride_name}</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div className="flex gap-2 p-1 bg-stone-100 rounded-2xl overflow-x-auto max-w-full no-scrollbar">
                        {["Tất cả", ...categories].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${activeFilter === cat ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-400 hover:text-stone-600'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowBatchModal(true)}
                            className="px-6 py-3 bg-white border border-stone-200 text-stone-700 rounded-2xl text-[13px] font-bold hover:bg-stone-50 transition-all shadow-sm flex items-center gap-2"
                        >
                            Dán từ Excel
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="px-6 py-3 bg-stone-900 text-white rounded-2xl text-[13px] font-bold hover:bg-black transition-all shadow-lg shadow-stone-200 flex items-center gap-2"
                        >
                            Tải danh sách Excel (CSV)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                        <div className="text-stone-500 text-sm font-medium mb-1">Tổng link đã tạo</div>
                        <div className="text-3xl font-bold text-stone-800">{summary.total}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                        <div className="text-stone-500 text-sm font-medium mb-1">Xác nhận tham dự</div>
                        <div className="text-3xl font-bold text-green-600">{summary.attending}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                        <div className="text-stone-500 text-sm font-medium mb-1">Số chỗ dự kiến (Người lớn)</div>
                        <div className="text-3xl font-bold text-primary-600">{summary.adults}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
                        <div className="text-stone-500 text-sm font-medium mb-1">Số lời chúc</div>
                        <div className="text-3xl font-bold text-purple-600">{summary.wishes}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sticky top-8">
                            <h2 className="text-lg font-bold text-stone-800 mb-4 flex items-center gap-2"><UserPlus size={18} className="text-primary-600" /> Thêm khách mới</h2>
                            <form onSubmit={handleCreateGuest} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Tên khách / Nhóm khách</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Vd: Vợ chồng anh Tuấn..."
                                        value={newGuestName}
                                        onChange={handleNameChange}
                                        className="w-full px-4 py-2 rounded-xl border border-stone-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Mã khách (Slug)</label>
                                    <input
                                        type="text"
                                        required
                                        value={newGuestSlug}
                                        onChange={(e) => setNewGuestSlug(e.target.value)}
                                        className="w-full px-4 py-2 bg-stone-50 rounded-xl border border-stone-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition font-mono text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Phân loại (Nhóm)</label>
                                    <select
                                        value={newGuestCategory}
                                        onChange={(e) => setNewGuestCategory(e.target.value)}
                                        className="w-full px-4 py-2 bg-white rounded-xl border border-stone-200 focus:border-primary-500 outline-none transition text-sm font-semibold"
                                    >
                                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition disabled:opacity-70 mt-2"
                                >
                                    {creating ? "Đang tạo..." : "Lưu & Bắt đầu gửi thiệp"}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-stone-200 bg-stone-50">
                                <h2 className="text-lg font-bold text-stone-800">Danh sách Khách mời</h2>
                            </div>
                            {guests.length === 0 ? (
                                <div className="p-12 text-center text-stone-500">
                                    Chưa có khách nào trong danh sách. Hãy thêm khách ở cột bên trái.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-stone-50/50 border-b border-stone-200">
                                                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Tên khách</th>
                                                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center">Trạng thái</th>
                                                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center">SL Người</th>
                                                <th className="p-4 text-xs font-semibold text-stone-500 uppercase tracking-wider">Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-100">
                                            {filteredGuests.map((guest) => (
                                                <tr key={guest.id} className="hover:bg-stone-50/30 transition group">
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-stone-50 flex items-center justify-center text-[10px] font-bold text-stone-400 group-hover:bg-[#fff1f2] group-hover:text-rose-400 transition-colors">
                                                                {guest.guest_name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-stone-800 text-[13px]">{guest.guest_name}</div>
                                                                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-tight">{guest.category}</div>
                                                            </div>
                                                        </div>
                                                        {guest.wish_message && (
                                                            <div className="mt-3 text-[#6d0208] text-[11px] italic bg-[#fffcfc] p-3 rounded-2xl border border-rose-50 border-dashed leading-relaxed">"{guest.wish_message}"</div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {renderStatusBadge(guest.status)}
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        {guest.status === 'attending' ? (
                                                            <div className="text-[11px]">
                                                                <span className="font-bold text-stone-900">{guest.adult_count} Lớn</span>
                                                                {guest.children_count > 0 && <span className="text-stone-400 block">{guest.children_count} Trẻ em</span>}
                                                            </div>
                                                        ) : <span className="text-stone-300">-</span>}
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => copyLink(guest.custom_slug, guest.id)}
                                                                className={`flex-1 flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${copiedId === guest.id ? 'bg-[#fff1f2] text-rose-500 border border-rose-100' : 'bg-stone-50 border border-transparent text-stone-600 hover:bg-stone-100'}`}
                                                            >
                                                                {copiedId === guest.id ? <><Check size={14} /> Đã lưu!</> : <><Copy size={14} /> Copy Link</>}
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteGuest(guest.id, guest.guest_name)}
                                                                title="Xóa khách"
                                                                className="p-2 text-stone-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                                            >
                                                                <UserX size={16} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Batch Import Modal */}
            {showBatchModal && (
                <div className="fixed inset-0 bg-stone-900/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full shadow-2xl relative">
                        <button onClick={() => setShowBatchModal(false)} className="absolute top-6 right-6 text-stone-400 hover:text-stone-600">✕</button>
                        <h2 className="text-2xl font-bold text-stone-900 mb-2">Nhập danh sách hàng loạt</h2>
                        <p className="text-sm text-stone-500 mb-6">
                            Copy 2 cột từ Excel (Tên khách và Nhóm) rồi dán vào đây. Mỗi người một dòng.<br />
                            <span className="text-[10px] font-bold text-primary-500 uppercase">Gợi ý: Tên khách [Tab] Nhóm</span>
                        </p>

                        <textarea
                            value={batchText}
                            onChange={(e) => setBatchText(e.target.value)}
                            placeholder="Vd: Nguyễn Văn A	Bạn chú rể&#10;Trần Thị B	Bạn cô dâu"
                            className="w-full h-64 p-4 rounded-2xl border border-stone-200 focus:border-primary-500 outline-none transition font-mono text-sm leading-relaxed"
                        ></textarea>

                        <div className="flex gap-3 mt-6">
                            <button onClick={() => setShowBatchModal(false)} className="flex-1 py-3 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 transition">Hủy</button>
                            <button
                                onClick={handleBatchImport}
                                disabled={importing || !batchText.trim()}
                                className="flex-[2] py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition disabled:opacity-50"
                            >
                                {importing ? "Đang xử lý..." : "Bắt đầu nhập danh sách"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
