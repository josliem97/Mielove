import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift } from 'lucide-react';

// -- Calendar Block --
// -- Calendar Block (HI-FI Style) --
export const CalendarBlock = ({ props }: { props: any }) => {
  const dateStr = props?.date || "2026-12-31";
  const date = new Date(dateStr);
  const day = date.getDate();
  const year = date.getFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const monthName = monthNames[date.getMonth()];
  
  // Calculate first day of month and days in month for a real calendar grid if needed
  // But for now, we'll follow the visual layout of the image
  
  return (
    <div className="w-full flex flex-col items-center justify-center bg-transparent py-10 select-none">
      <div className="flex flex-col items-center mb-10 relative">
        <div className="text-[100px] font-serif text-[#6d0208] leading-none opacity-90 tracking-tighter" style={{ fontFamily: 'Cormorant Garamond' }}>{year}</div>
        <div className="text-[42px] font-script text-[#6d0208] -mt-8 italic drop-shadow-sm" style={{ fontFamily: 'OpeningScript' }}>{monthName}</div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 w-full max-w-[360px] px-4">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
          <div key={d} className="text-[9px] text-stone-400 font-bold text-center mb-3 tracking-widest">{d}</div>
        ))}
        {Array.from({ length: 31 }).map((_, i) => {
          const d = i + 1;
          const isWeddingDay = d === day;
          return (
            <div key={i} className={`
              h-10 flex items-center justify-center text-[15px] border border-[#6d0208]/10 rounded-lg shadow-sm bg-white/50 backdrop-blur-sm transition-all
              ${isWeddingDay ? 'ring-2 ring-[#6d0208] ring-offset-2' : ''}
            `}>
              {isWeddingDay ? (
                <div className="relative flex items-center justify-center w-full h-full bg-[#6d0208] rounded-lg text-white font-black">
                  <span className="text-[10px] absolute -top-1 -right-1">❤️</span>
                  {d}
                </div>
              ) : (
                <span className="text-stone-700 font-medium">{d}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// -- Countdown Block --
export const CountdownBlock = ({ props }: { props: any }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0, secs: 0 });

  useEffect(() => {
    let targetDateStr = props?.targetDate || "2026-12-31T11:30:00";

    // Robust parsing: If it's just YYYY-MM-DD, append a time
    if (targetDateStr.length === 10 && /^\d{4}-\d{2}-\d{2}$/.test(targetDateStr)) {
      targetDateStr += "T09:00:00";
    }

    const targetDate = new Date(targetDateStr);
    const target = isNaN(targetDate.getTime()) ? new Date("2026-12-31T11:30:00").getTime() : targetDate.getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;
      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, mins: 0, secs: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [props?.targetDate]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center text-[#8d5f25]">
      <div className="text-[32px] md:text-4xl font-serif mb-2 tracking-widest font-light">
        {timeLeft.days} d : {String(timeLeft.hours).padStart(2, '0')} h : {String(timeLeft.mins).padStart(2, '0')} m : {String(timeLeft.secs).padStart(2, '0')} s
      </div>
    </div>
  );
};

// -- Button Block --
export const ButtonBlock = ({ props, onClick }: { props: any, onClick?: () => void }) => {
  const isRSVP = props?.action === 'rsvp';
  return (
    <button
      onClick={onClick}
      className={`w-full h-full rounded-full font-bold uppercase tracking-widest text-xs transition-all transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 px-6
        ${props?.style === 'solid' ? 'bg-[#6d0208] text-white shadow-xl hover:shadow-[#6d0208]/30' : 'bg-white/80 backdrop-blur-md text-[#6d0208] border border-[#6d0208]/20 hover:bg-white shadow-lg'}
      `}
    >
      {isRSVP && <span className="animate-pulse">❤️</span>}
      {props?.text || "Xác nhận ngay"}
    </button>
  );
};

// -- Event Card Block (Image 1 Style) --
export const EventCardBlock = ({ props }: { props: any }) => {
  const dateStr = props?.date || "2026-12-31";
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear() % 100;
  const time = props?.time || "09:00";
  const weekday = props?.weekday || "THỨ NĂM";
  const title = props?.title || "LỄ THÀNH HÔN";
  const location = props?.location || "TƯ GIA NHÀ TRAI";
  const address = props?.address || "18 Văn Hòa, Hồng Vân, Hà Nội";

  return (
    <div className="w-full flex flex-col items-center gap-8 py-12">
      <div className="px-12 py-3 bg-[#6d0208] text-white rounded-full text-sm font-black tracking-[0.2em] uppercase shadow-lg">
        {title}
      </div>
      
      <div className="flex items-center justify-center gap-8 text-[#6d0208]">
        <div className="text-5xl font-serif font-light tracking-tight">{time}</div>
        <div className="flex items-center gap-6 border-l border-r border-[#6d0208]/30 px-8">
          <div className="flex flex-col items-center leading-none font-serif">
            <span className="text-5xl mb-1">{day}</span>
            <span className="text-2xl border-t border-[#6d0208]/20 mt-1 pt-2 w-full text-center">{month}</span>
            <span className="text-2xl border-t border-[#6d0208]/20 mt-1 pt-1 w-full text-center">{year}</span>
          </div>
        </div>
        <div className="text-2xl font-serif tracking-widest uppercase [writing-mode:vertical-lr]">{weekday}</div>
      </div>
      
      <div className="text-center px-4">
        <p className="text-[12px] text-stone-500 italic mb-5">Tức ngày 22 tháng 11 năm Bính Ngọ</p>
        <p className="text-[13px] text-stone-400 uppercase tracking-[0.3em] font-bold mb-2">Địa điểm</p>
        <h4 className="text-2xl font-serif font-black text-[#6d0208] mb-2 leading-tight uppercase tracking-tight">{location}</h4>
        <p className="text-[15px] text-stone-600 mb-8 max-w-[320px] mx-auto leading-relaxed">{address}</p>
        <button className="flex items-center gap-2 text-[#6d0208] font-bold text-sm border-b-2 border-[#6d0208]/20 pb-1 hover:border-[#6d0208] transition-all">
          📍 Chỉ đường
        </button>
      </div>
    </div>
  );
};

// -- Timeline Block --
export const TimelineBlock = ({ props }: { props: any }) => {
  const items = props?.items || [];
  const accentColor = props?.accentColor || "#30530F";

  return (
    <div className="w-full flex flex-col gap-10 py-6 relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-stone-200 -translate-x-1/2 hidden md:block"></div>
      {items.map((item: any, i: number) => (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          key={i} 
          className={`flex flex-col md:flex-row items-center gap-4 relative z-10 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
        >
          <div className="flex-1 text-center md:text-right hidden md:block">
            {i % 2 === 0 && <span className="text-xl font-serif font-bold text-[#30530F]">{item.time}</span>}
            {i % 2 !== 0 && <span className="text-sm font-medium text-stone-600 uppercase tracking-widest">{item.title}</span>}
          </div>
          
          <div className="w-12 h-12 rounded-full border-4 border-white shadow-md flex items-center justify-center z-20" style={{ backgroundColor: accentColor }}>
             <span className="text-white text-[10px] font-bold">{item.time}</span>
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="md:hidden text-xs font-black text-[#30530F] mb-1">{item.time}</div>
            <div className="text-lg font-serif font-bold text-stone-800">{item.title}</div>
            <div className="md:hidden text-sm font-medium text-stone-400 uppercase tracking-widest mt-1">{item.title === 'Đón khách' ? 'Welcome' : 'Event'}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// -- Dresscode Block --
export const DresscodeBlock = ({ props }: { props: any }) => {
  const colors = props?.colors || ["#fdecd8", "#6d0208", "#ffffff"];
  const label = props?.label || "Yêu cầu trang phục";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-10 p-10 bg-white/20 backdrop-blur-xl rounded-[40px] border border-white/40 shadow-2xl">
      <div className="flex flex-col items-center">
        <div className="text-[10px] uppercase tracking-[0.5em] font-black text-[#6d0208] mb-2">{label}</div>
        <div className="h-px w-10 bg-[#6d0208]/30"></div>
      </div>
      
      <div className="flex gap-8">
        {colors.map((c: string, i: number) => (
          <div key={i} className="flex flex-col items-center gap-4 group">
            <div className="w-20 h-20 rounded-full shadow-xl border-4 border-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ring-1 ring-[#6d0208]/10" style={{ backgroundColor: c }} />
            <div className="text-[9px] uppercase font-mono text-stone-500 font-bold opacity-60 group-hover:opacity-100">{c}</div>
          </div>
        ))}
      </div>
      <p className="text-[11px] font-serif italic text-stone-400 tracking-widest uppercase text-center max-w-[200px] leading-relaxed">
        Để buổi tiệc thêm phần rực rỡ, quý khách vui lòng chọn trang phục theo tông màu trên.
      </p>
    </div>
  );
};

// -- Album/Gallery Block --
export const AlbumBlock = ({ props, onPhotoClick }: { props: any, onPhotoClick?: (src: string) => void }) => {
  const images = props?.images || [];

  return (
    <div className="columns-2 gap-4">
      {images.map((img: string, i: number) => (
          <div 
            key={i} 
            className="break-inside-avoid mb-4 cursor-pointer overflow-hidden rounded-2xl border-[3px] border-white shadow-md transition-all duration-700 hover:scale-[1.02] hover:shadow-xl hover:z-10"
            onClick={() => onPhotoClick && onPhotoClick(img)}
          >
            <img src={img} className="w-full h-auto object-cover" alt={`Album ${i}`} loading="lazy" />
          </div>
      ))}
    </div>
  );
};

// -- Wishes Block --
export const WishesBlock = ({ props, slug }: { props: any, slug: string }) => {
  const [wishes, setWishes] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchWishes();
  }, []);

  const fetchWishes = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/wishes/${slug}`);
      const apiWishes = res.data || [];
      const mockWishes = props?.mockWishes || [];
      // Combine and sort by date if possible, or just mock first
      setWishes([...mockWishes, ...apiWishes]);
    } catch (e) {
      setWishes(props?.mockWishes || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) return;
    setSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/wishes/${slug}`, {
        guest_name: name,
        wish_message: message
      });
      setName('');
      setMessage('');
      fetchWishes();
    } catch (e) {}
    setSubmitting(false);
  };

  return (
    <div className="w-full h-full flex flex-col gap-8 p-10 bg-[#f6f2ef] rounded-3xl overflow-hidden relative">
      <div className="text-center z-10">
        <h3 className="text-6xl font-script text-[#8d5f25] mb-2" style={{ fontFamily: 'OpeningScript' }}>Sổ lưu bút</h3>
        <p className="text-[12px] text-stone-500 font-serif px-6 leading-relaxed">
          Cảm ơn bạn rất nhiều vì đã gửi những lời chúc mừng tốt đẹp nhất đến đám cưới của chúng tôi!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 z-10 bg-[#fdecd8] p-6 rounded-2xl">
        <input 
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Nhập tên của bạn*"
          className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none bg-white text-sm shadow-sm text-stone-700"
        />
        <textarea 
          value={message} onChange={e => setMessage(e.target.value)}
          placeholder="Nhập lời chúc của bạn*"
          className="w-full px-4 py-3 rounded-lg border border-stone-200 outline-none bg-white text-sm resize-none shadow-sm text-stone-700"
          rows={3}
        />
        <div className="flex justify-center pt-2">
          <button 
            disabled={submitting}
            className="px-8 py-3 bg-[#8d5f25] hover:bg-[#724a1b] text-white rounded-lg font-bold text-sm shadow-md transition-all disabled:opacity-50"
          >
            {submitting ? 'ĐANG GỬI...' : 'Gửi lời chúc'}
          </button>
        </div>
      </form>
      
      <div className="flex-1 overflow-y-auto miu-scrollbar space-y-4 pr-2 mt-4 z-10 max-h-[300px]">
        {wishes.map((w, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i} 
            className="p-4 bg-white/80 rounded-xl shadow-sm border border-stone-100"
          >
            <div className="text-sm font-bold text-[#8d5f25] mb-1">{w.guest_name}</div>
            <div className="text-sm text-stone-600 font-serif italic">"{w.wish_message}"</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// -- Bank/Gift Block --
export const BankBlock = ({ props, wedding }: { props: any, wedding: any }) => {
  const bankName = props?.bank_name || wedding?.bank_name || "Ngân hàng TMCP";
  const accountNo = props?.bank_account || wedding?.bank_account || "xxxx xxxx xxxx";
  const accountName = props?.bank_account_name || wedding?.bank_account_name || "NGUYEN VAN A";
  const qrCode = props?.bank_qr_code || wedding?.bank_qr_code;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Đã sao chép số tài khoản: ' + text);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden relative">
      <div className="text-center mb-4 mt-2">
        <h3 className="text-3xl font-script text-[#6d0208] mb-1" style={{ fontFamily: 'OpeningScript' }}>
            {props?.title || "Mừng cưới Online"}
        </h3>
        <p className="text-[9px] uppercase tracking-[0.4em] text-stone-400 font-bold">Hộp quà hạnh phúc</p>
      </div>

      <div className="w-48 h-48 mb-6 p-2 bg-white rounded-2xl shadow-inner border border-stone-100 relative group">
        {qrCode ? (
          <img src={qrCode} className="w-full h-full object-contain" alt="QR Code" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-200 text-xs italic">Đang cập nhật mã QR...</div>
        )}
      </div>

      <div className="w-full space-y-4 text-center">
        <div className="flex flex-col items-center">
            <span className="text-[9px] uppercase tracking-widest text-stone-400 mb-1">Chủ tài khoản</span>
            <div className="text-lg font-serif font-black text-stone-800 tracking-tight uppercase">{accountName}</div>
        </div>

        <div className="bg-stone-50 rounded-xl p-4 border border-stone-100 flex flex-col items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest text-stone-400">Số tài khoản</span>
            <div className="text-2xl font-mono font-black text-[#6d0208] tracking-tighter">{accountNo}</div>
            <button 
                onClick={() => copyToClipboard(accountNo)}
                className="mt-1 px-5 py-1.5 bg-white border border-[#6d0208]/20 text-[#6d0208] rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm hover:bg-[#6d0208] hover:text-white transition-all"
            >
                Sao chép
            </button>
        </div>

        <div className="text-center pb-2">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-[0.1em]">{bankName}</span>
        </div>
      </div>
    </div>
  );
};

// -- RSVP Block (Inline Form) --
export const RSVPBlock = ({ props, slug, guest }: { props: any, slug: string, guest?: any }) => {
  const [rsvpData, setRsvpData] = useState({
      status: guest && guest.status !== "unread" ? guest.status : "attending",
      side: 'groom',
      adult_count: guest?.adult_count || 1,
      children_count: guest?.children_count || 0,
      wish_message: guest?.wish_message || ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleRSVPSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);
      try {
          // If guest object exists, update guest. Otherwise this is public RSVP.
          // For demo, we just simulate success.
          await new Promise(resolve => setTimeout(resolve, 1000));
          setRsvpSuccess(true);
      } catch (error) {
          alert("Có lỗi xảy ra, vui lòng thử lại sau.");
      } finally {
          setSubmitting(false);
      }
  };

  if (rsvpSuccess) {
    return (
      <div className="w-full h-full bg-[#f6f2ef] flex flex-col items-center justify-center p-8 text-center rounded-2xl shadow-sm">
          <div className="w-16 h-16 bg-[#fdecd8] text-[#8d5f25] rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">♥</div>
          <h3 className="text-3xl font-serif text-[#8d5f25] mb-2">Lời Cảm Ơn</h3>
          <p className="text-stone-600 font-serif italic">Xác nhận của bạn đã được gửi tới cô dâu chú rể. Trân trọng cảm ơn!</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col p-8 bg-[#f6f2ef] rounded-2xl shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-4xl font-serif text-[#8d5f25] mb-2">Xác Nhận Tham Dự</h2>
        <p className="text-sm text-stone-500 font-serif">Việc xác nhận giúp chúng mình chuẩn bị chu đáo hơn.<br/>Cảm ơn bạn!</p>
      </div>
      <form onSubmit={handleRSVPSubmit} className="bg-[#fdecd8] p-6 rounded-xl space-y-4">
        <div>
          <input 
            type="text" 
            placeholder="Họ và tên *" 
            defaultValue={guest?.guest_name || ''}
            required
            className="w-full px-4 py-3 rounded border border-stone-200 outline-none text-stone-700 font-serif bg-white"
          />
        </div>
        
        <div className="space-y-2 text-stone-700 font-serif text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="attending" checked={rsvpData.status === 'attending'} onChange={(e) => setRsvpData({...rsvpData, status: e.target.value})} className="accent-[#8d5f25]" />
            Có, tôi sẽ tham dự
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="status" value="not_attending" checked={rsvpData.status === 'not_attending'} onChange={(e) => setRsvpData({...rsvpData, status: e.target.value})} className="accent-[#8d5f25]" />
            Xin lỗi, tôi bận mất rồi!
          </label>
          <label className="flex items-center gap-2 cursor-pointer pt-2">
            <input type="radio" name="side" value="groom" checked={rsvpData.side === 'groom'} onChange={(e) => setRsvpData({...rsvpData, side: e.target.value})} className="accent-[#8d5f25]" />
            Khách của chú rể
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="side" value="bride" checked={rsvpData.side === 'bride'} onChange={(e) => setRsvpData({...rsvpData, side: e.target.value})} className="accent-[#8d5f25]" />
            Khách của cô dâu
          </label>
        </div>

        <div>
          <p className="text-sm font-bold text-stone-700 mb-2 font-serif">Bạn sẽ tham gia sự kiện nào</p>
          <select className="w-full px-4 py-3 rounded border border-stone-200 outline-none text-stone-700 font-serif bg-white">
            <option>Bạn sẽ tham gia sự kiện nào</option>
            <option>Lễ Cưới</option>
            <option>Tiệc Cưới</option>
          </select>
        </div>

        <div>
          <textarea 
            placeholder="Lời nhắn cho Cô Dâu & Chú Rể"
            value={rsvpData.wish_message}
            onChange={(e) => setRsvpData({...rsvpData, wish_message: e.target.value})}
            className="w-full px-4 py-3 rounded border border-stone-200 outline-none text-stone-700 font-serif bg-white resize-none h-24"
          />
        </div>

        <div className="flex justify-center pt-2">
          <button type="submit" disabled={submitting} className="px-10 py-3 bg-[#8d5f25] hover:bg-[#724a1b] text-white font-bold rounded-full transition-colors disabled:opacity-50">
            {submitting ? 'Đang gửi...' : 'Xác nhận'}
          </button>
        </div>
      </form>
    </div>
  );
};

// -- Map Block --
export const MapBlock = ({ props }: { props: any }) => {
  const mapUrl = props?.url || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.924403936355!2d105.8164543!3d21.0357106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab0d127a01e7%3A0xabed7c36b11bc638!2zVmluaG9tZXMgTWV0cm9wb2xpcw!5e0!3m2!1svi!2s!4v1713580000000!5m2!1svi!2s";
  return (
    <div className="w-full h-full rounded-[40px] overflow-hidden border-8 border-white shadow-2xl bg-white relative group">
      <iframe src={mapUrl} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" className="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[#c5a059] font-black mb-1">Wedding Location</div>
        <div className="text-lg font-serif font-black text-[#6d0208] leading-tight">Xem vị trí trên Google Maps</div>
        <a 
            href={mapUrl.replace('embed?pb=', 'place/')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-[#6d0208] text-[11px] font-black uppercase tracking-widest border-b-2 border-[#6d0208]/20 pb-1"
        >
            Mở bản đồ ❯
        </a>
      </div>
    </div>
  );
};

// -- Quote Block --
export const QuoteBlock = ({ props }: { props: any }) => {
  const text = props?.text || "Tình yêu không làm cho thế giới quay vòng. Tình yêu là những gì làm cho chuyến đi đáng giá.";
  const author = props?.author || "Franklin P. Jones";

  return (
    <div className="w-full flex flex-col items-center justify-center p-12 text-center relative">
      <div className="text-6xl text-[#6d0208]/10 absolute top-0 left-10 font-serif">“</div>
      <p className="text-xl font-serif italic text-stone-600 leading-relaxed relative z-10">
        {text}
      </p>
      <div className="h-px w-12 bg-[#c5a059]/40 my-6"></div>
      <div className="text-[10px] uppercase tracking-[0.4em] text-[#6d0208] font-black">{author}</div>
      <div className="text-6xl text-[#6d0208]/10 absolute bottom-0 right-10 font-serif rotate-180">“</div>
    </div>
  );
};

// -- Slider Block --
export const SliderBlock = ({ props }: { props: any }) => {
  const images = props?.images || [];
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!images.length) return <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400">Chưa có ảnh</div>;

  return (
    <div className="w-full h-full relative overflow-hidden rounded-3xl group">
      <AnimatePresence mode="wait">
        <motion.img
          key={index}
          src={images[index]}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-1.5 z-10">
        {images.map((_: any, i: number) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-white' : 'w-2 bg-white/40'}`} />
        ))}
      </div>
    </div>
  );
};
