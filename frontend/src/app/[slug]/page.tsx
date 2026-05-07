"use client";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MailOpen, Gift, Music, Navigation, Heart, ChevronRight } from 'lucide-react';
import { 
    CalendarBlock, CountdownBlock, ButtonBlock, TimelineBlock, 
    DresscodeBlock, AlbumBlock, WishesBlock, BankBlock, MapBlock, SliderBlock, EventCardBlock, QuoteBlock, RSVPBlock
} from "@/components/canvas/blocks";
import { Opening } from "@/components/canvas/Opening";
import { FABDock } from "@/components/canvas/FABDock";


type WeddingData = {
    id: number;
    groom_name: string;
    bride_name: string;
    wedding_date: string;
    location: string;
    map_url?: string;
    music_url?: string;
    bank_qr_code?: string;
    bank_name?: string;
    bank_account?: string;
    bank_account_name?: string;
    template_id: number;
    config_data: any;
};

type GuestData = {
    id: number;
    guest_name: string;
    custom_slug: string;
    status: string;
    adult_count: number;
    children_count: number;
    wish_message: string | null;
};

export default function WeddingCard({ params }: { params: { slug: string } }) {
    const searchParams = useSearchParams();
    const guestSlug = searchParams.get('to');

    const [wedding, setWedding] = useState<WeddingData | null>(null);
    const [guest, setGuest] = useState<GuestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);

    // RSVP Modal State
    const [showRSVP, setShowRSVP] = useState(false);
    const [rsvpData, setRsvpData] = useState({
        status: "attending",
        adult_count: 1,
        children_count: 0,
        wish_message: ""
    });
    const [submitting, setSubmitting] = useState(false);
    const [rsvpSuccess, setRsvpSuccess] = useState(false);
    const [showEnvelope, setShowEnvelope] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const [clickParticles, setClickParticles] = useState<{id: number, x: number, y: number}[]>([]);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const id = Date.now();
            setClickParticles(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => {
                setClickParticles(prev => prev.filter(p => p.id !== id));
            }, 1000);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Dynamic SEO: update title and meta description when wedding loads
    useEffect(() => {
        if (!wedding) return;
        const title = `Thiệp cưới ${wedding.groom_name} & ${wedding.bride_name} — ${wedding.wedding_date?.split('T')[0] || ''}`;
        document.title = title;

        // Update or create meta description
        let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = `Trân trọng kính mời bạn đến dự lễ thành hôn của ${wedding.groom_name} và ${wedding.bride_name}. Tổ chức vào ngày ${wedding.wedding_date?.split('T')[0]}.`;

        // Open Graph tags
        const ogTags: Record<string, string> = {
            'og:title': title,
            'og:description': metaDesc.content,
            'og:type': 'website',
        };
        Object.entries(ogTags).forEach(([property, content]) => {
            let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute('property', property);
                document.head.appendChild(tag);
            }
            tag.content = content;
        });
    }, [wedding]);

    // Premium Features State
    const [isPlaying, setIsPlaying] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [wishes, setWishes] = useState<any[]>([]);
    const [activeGiftTab, setActiveGiftTab] = useState<'groom' | 'bride'>('groom');
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Canvas Scale Logic
    const [canvasScale, setCanvasScale] = useState(1);
    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = winScroll / height;
            setScrollProgress(scrolled);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const w = Math.min(window.innerWidth, 575); // Max width of presentation wrapper
            setCanvasScale(w / 575);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const weddingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/${params.slug}?t=${Date.now()}`, { cache: 'no-store' });
                if (!weddingRes.ok) throw new Error("Wedding not found");
                const weddingData = await weddingRes.json();
                setWedding(weddingData);

                if (guestSlug) {
                    setShowEnvelope(true);
                    try {
                        const guestRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/public/${params.slug}/${guestSlug}`);
                        if (guestRes.ok) {
                            const guestData = await guestRes.json();
                            setGuest(guestData);
                            setRsvpData(prev => ({
                                ...prev,
                                status: guestData.status !== "unread" ? guestData.status : "attending",
                                adult_count: guestData.adult_count || 1,
                                children_count: guestData.children_count || 0,
                                wish_message: guestData.wish_message || ""
                            }));
                        }
                    } catch (e) {
                        console.error("Guest not found");
                    }
                }
            } catch (error) {
                setNotFoundError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();

        // Fetch Wishes separately
        const fetchWishes = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/wishes/${params.slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setWishes(data);
                }
            } catch (e) {
                console.error("Wishes fetch err", e);
            }
        };
        fetchWishes();
    }, [params.slug, guestSlug]);

    const replacePlaceholders = (text: string) => {
        if (!text || !wedding) return text;
        const groomFather = wedding.config_data?.parents?.groom_father || "Nguyễn Văn A";
        const groomMother = wedding.config_data?.parents?.groom_mother || "Trần Thị B";
        const brideFather = wedding.config_data?.parents?.bride_father || "Lê Văn C";
        const brideMother = wedding.config_data?.parents?.bride_mother || "Phạm Thị D";

        return text
            .replace(/{{groom_name\|upper}}/g, (wedding.groom_name || "Chú rể").toUpperCase())
            .replace(/{{bride_name\|upper}}/g, (wedding.bride_name || "Cô dâu").toUpperCase())
            .replace(/{{groom_name}}/g, wedding.groom_name || "Chú rể")
            .replace(/{{bride_name}}/g, wedding.bride_name || "Cô dâu")
            .replace(/{{groom_father}}/g, groomFather)
            .replace(/{{groom_mother}}/g, groomMother)
            .replace(/{{bride_father}}/g, brideFather)
            .replace(/{{bride_mother}}/g, brideMother)
            .replace(/{{wedding_date}}/g, wedding.wedding_date?.split('T')[0] || "Chưa xác định")
            .replace(/{{location}}/g, wedding.location || "Địa điểm chưa xác định");
    };

    const handleRSVPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guest) return;
        setSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/rsvp/${guest.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rsvpData)
            });
            if (!response.ok) throw new Error("RSVP failed");
            setRsvpSuccess(true);
            setTimeout(() => {
                setShowRSVP(false);
                setRsvpSuccess(false);
            }, 3000);
        } catch (error) {
            alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        } finally {
            setSubmitting(false);
        }
    };

    const openEnvelope = () => {
        setShowEnvelope(false);
        // Autoplay music on open — use canvas.musicUrl or wedding.music_url
        const musicSrc = wedding?.config_data?.canvas?.musicUrl || wedding?.music_url;
        if (musicSrc && audioRef.current) {
            audioRef.current.src = musicSrc;
            audioRef.current.volume = 0.5;
            audioRef.current.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF0F5] font-serif text-rose-500">Đang chuẩn bị thiệp...</div>;

    if (notFoundError || !wedding) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 text-stone-800">
                <h1 className="text-3xl font-serif mb-4">Không tìm thấy thiệp cưới</h1>
                <p className="text-stone-500">Liên kết bạn nhập có thể không tồn tại hoặc đã bị gỡ.</p>
                <a href="/" className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-full">Về trang chủ</a>
            </div>
        );
    }
    // Fallback Mock for missing custom config
    const isCanvasMode = wedding.config_data?.canvasProps !== undefined || wedding.config_data?.canvas !== undefined;
    const canvasConfig = isCanvasMode ? wedding.config_data : {
        canvas: { width: 575, height: 1200, backgroundColor: "#fdf8f5" },
        components: [
            { id: "bg-shape", type: "element_shape", x: 0, y: 0, w: 575, h: 400, z: 1, props: { fill: "#6d0208", borderRadius: 0 } },
            {
                id: "title-text", type: "element_text", x: 20, y: 150, w: 535, h: 100, z: 10,
                props: { text: "Thanh Sơn & Diệu Nhi", fontSize: 44, color: "#ffffff", align: "center", fontFamily: "'High Spirited', cursive" },
                animation: { preset: "miu-baseline", duration: 1200 }
            },
            {
                id: "desc-text", type: "element_text", x: 20, y: 240, w: 535, h: 60, z: 10,
                props: { text: "TRÂN TRỌNG KÍNH MỜI", fontSize: 14, color: "#fdecd8", align: "center", fontFamily: "serif" },
                animation: { preset: "miu-fadeIn", duration: 1500, delay: 500 }
            },
            {
                id: "main-img", type: "element_image", x: 50, y: 450, w: 475, h: 600, z: 5,
                props: { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", borderRadius: 20 },
                animation: { preset: "miu-zoomIn", duration: 1000, delay: 300 }
            },
            {
                id: "cal", type: "element_calendar", x: 85, y: 1080, w: 405, h: 180, z: 20,
                props: { date: "2026-12-31", time: "09:00", label: "LỄ THÀNH HÔN" },
                animation: { preset: "miu-stomp", duration: 800, delay: 800 }
            }
        ]
    };

    const canvas = (canvasConfig.canvas || canvasConfig.canvasProps) || { width: 575, height: 2000, backgroundColor: "#ffffff" };

    const getAnimationVariants = (preset: string) => {
        const baseTrans: any = { duration: 1.2, ease: "easeOut" };
        switch (preset) {
            case 'miu-softReveal':
                return {
                    initial: { opacity: 0, scale: 0.95, y: 30 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: baseTrans }
                };
            case 'miu-baseline':
                return {
                    initial: { opacity: 0, y: 60 },
                    visible: { opacity: 1, y: 0, transition: { ...baseTrans, duration: 1.5 } }
                };
            case 'miu-fadeUp':
            case 'miu-fadeInUp':
                return {
                    initial: { opacity: 0, y: 40 },
                    visible: { opacity: 1, y: 0, transition: baseTrans }
                };
            case 'miu-zoomIn':
                return {
                    initial: { opacity: 0, scale: 0.8 },
                    visible: { opacity: 1, scale: 1, transition: { ...baseTrans, duration: 1 } }
                };
            case 'miu-stagger-fade':
                return {
                    initial: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0, transition: { ...baseTrans, duration: 1.5 } }
                };
            case 'miu-slideIn':
                return {
                    initial: { opacity: 0, x: 50 },
                    visible: { opacity: 1, x: 0, transition: { ...baseTrans, duration: 1 } }
                };
            case 'miu-fadeIn':
                return {
                    initial: { opacity: 0 },
                    visible: { opacity: 1, transition: { duration: 0.8 } }
                };
            case 'miu-fadeInDown':
                return {
                    initial: { opacity: 0, y: -40 },
                    visible: { opacity: 1, y: 0, transition: baseTrans }
                };
            case 'miu-fadeInRight':
                return {
                    initial: { opacity: 0, x: 40 },
                    visible: { opacity: 1, x: 0, transition: baseTrans }
                };
            case 'miu-fadeInLeft':
                return {
                    initial: { opacity: 0, x: -40 },
                    visible: { opacity: 1, x: 0, transition: baseTrans }
                };
            case 'miu-stomp':
                return {
                    initial: { opacity: 0, scale: 0.82 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 20 } }
                };
            case 'miu-bounceIn':
                return {
                    initial: { opacity: 0, scale: 0.3 },
                    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 10 } }
                };
            case 'miu-blurIn':
                return {
                    initial: { opacity: 0, filter: 'blur(10px)', y: 20 },
                    visible: { opacity: 1, filter: 'blur(0px)', y: 0, transition: { ...baseTrans, duration: 1.5 } }
                };
            default:
                return {
                    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: "easeOut" } }
                };
        }
    };

    const renderCanvasComponent = (comp: any) => {
        const preset = comp.animation?.preset;
        const variants = getAnimationVariants(preset);

        return (
            <motion.div
                key={comp.id}
                initial="initial"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={variants}
                style={{
                    position: "absolute",
                    left: comp.x, top: comp.y, width: comp.w, height: comp.h, zIndex: comp.z,
                    "--miu-node-rotate": `${comp.rotation || 0}deg`,
                    animationName: (comp.animation?.loop) ? (comp.animation?.preset || "none") : "none",
                    animationDuration: `${comp.animation?.duration || 1000}ms`,
                    animationDelay: `${comp.animation?.delay || 0}ms`,
                    animationIterationCount: comp.animation?.loop ? "infinite" : "1",
                    animationTimingFunction: comp.animation?.easing || "ease-in-out"
                } as React.CSSProperties}
            >
                {comp.type === "container" && (
                    <div style={{ width: '100%', height: '100%', backgroundColor: comp.props?.fill || 'transparent', borderRadius: comp.props?.borderRadius || 0, overflow: comp.props?.overflow || 'visible', ...(comp.style || {}) }}>
                        {comp.components?.map((child: any) => renderCanvasComponent(child))}
                    </div>
                )}
                {comp.type === "element_text" && (
                    <div style={{
                        width: "100%", height: "100%",
                        color: comp.props?.color || "#000",
                        fontSize: comp.props?.fontSize || 16,
                        textAlign: comp.props?.align || "left",
                        fontFamily: comp.props?.fontFamily || "inherit",
                        fontWeight: comp.props?.fontWeight || "normal",
                        lineHeight: comp.props?.lineHeight || 1.4,
                        letterSpacing: comp.props?.letterSpacing || "normal",
                        textTransform: comp.props?.textTransform || "none" as any,
                        whiteSpace: "pre-wrap",
                        display: 'flex', flexDirection: 'column',
                        justifyContent: comp.props?.valign || 'center',
                        textShadow: comp.props?.fontFamily === 'OpeningScript' ? '2px 2px 4px rgba(0,0,0,0.1)' : 'none',
                        ...(comp.style || {})
                    }}>
                        {replacePlaceholders(String(comp.props?.text || ""))}
                    </div>
                )}
                {comp.type === "element_shape" && (
                    <div style={{
                        width: "100%", height: "100%",
                        backgroundColor: comp.props.fill || "transparent",
                        borderRadius: comp.props.borderRadius || 0,
                        boxShadow: comp.style?.boxShadow || 'none',
                        ...(comp.style || {})
                    }}></div>
                )}
                {comp.type === "element_image" && comp.props?.src && (
                    <motion.div 
                        className="group" 
                        style={{
                            width: "100%", height: "100%",
                            overflow: "hidden",
                            borderRadius: comp.props?.borderRadius || 0,
                            boxShadow: comp.props?.isDecor ? 'none' : (comp.props?.boxShadow || 'none'),
                            ...(comp.style || {})
                        }}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <motion.img
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 1 }}
                            src={comp.props.src}
                            alt=""
                            className="w-full h-full block"
                            style={{
                                objectFit: (comp.props?.objectFit as any) || "cover",
                                objectPosition: (comp.props?.objectPosition as any) || "center",
                            }}
                        />
                    </motion.div>
                )}
                {comp.type === "element_rsvp" && (
                    <RSVPBlock props={comp.props} slug={params.slug} guest={guest} />
                )}
                {comp.type === "element_calendar" && <CalendarBlock props={{...comp.props, date: replacePlaceholders(comp.props.date)}} />}
                {comp.type === "element_countdown" && <CountdownBlock props={{...comp.props, targetDate: replacePlaceholders(comp.props.targetDate)}} />}
                {comp.type === "element_button" && (
                    <ButtonBlock
                        props={comp.props}
                        onClick={() => {
                            if (comp.props.action === 'rsvp') setShowRSVP(true);
                            if (comp.props.action === 'map' && wedding.map_url) window.open(wedding.map_url, '_blank');
                            if (comp.props.action === 'gift') {
                                const text = (comp.props.text || "").toLowerCase();
                                if (text.includes("cô dâu") || text.includes("nhà gái")) setActiveGiftTab('bride');
                                else if (text.includes("chú rể") || text.includes("nhà trai")) setActiveGiftTab('groom');
                                setShowGiftModal(true);
                            }
                        }}
                    />
                )}
                {comp.type === "element_timeline" && <TimelineBlock props={comp.props} />}
                {comp.type === "element_dresscode" && <DresscodeBlock props={comp.props} />}
                {comp.type === "element_album" && <AlbumBlock props={comp.props} onPhotoClick={(src) => setSelectedPhoto(src)} />}
                {comp.type === "element_slider" && <SliderBlock props={comp.props} />}
                {comp.type === "element_wishes" && <WishesBlock props={comp.props} slug={params.slug} />}
                {comp.type === "element_event_card" && <EventCardBlock props={comp.props} />}
                {comp.type === "element_quote" && <QuoteBlock props={comp.props} />}
                {comp.type === "element_bank" && <BankBlock props={comp.props} wedding={wedding} />}
                {comp.type === "element_map" && <MapBlock props={comp.props} />}
            </motion.div>
        );
    };

    return (
        <div className="bg-stone-100 min-h-screen flex justify-center font-sans overflow-x-hidden">
            {/* Envelope Overlay (Global/Full Screen) */}
            <AnimatePresence>
                {showEnvelope && (
                    <Opening
                        guestName={guest?.guest_name || guestSlug?.replace(/-/g, ' ') || "Bạn và gia đình"}
                        groomName={wedding?.groom_name || "Chú Rể"}
                        brideName={wedding?.bride_name || "Cô Dâu"}
                        onOpen={openEnvelope}
                    />
                )}
            </AnimatePresence>

            {/* Decorative Floating Elements Layer (Luxury Particles) - FIXED & CENTERED */}
            {isMounted && (
                <div 
                    className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[575px] pointer-events-none z-[200] overflow-hidden"
                >
                    {[...Array(20)].map((_, i) => {
                        const randomLeft = Math.random() * 100;
                        const randomDelay = Math.random() * 20;
                        const randomDuration = 15 + Math.random() * 10;
                        return (
                            <motion.div
                                key={i}
                                className={`absolute ${i % 2 === 0 ? 'text-[#c5a059]' : 'text-[#6d0208]'} text-[10px]`}
                                style={{ left: `${randomLeft}%` }}
                                initial={{ y: -50, opacity: 0 }}
                                animate={{ 
                                    y: "110vh", 
                                    opacity: [0, 0.5, 0.5, 0],
                                    rotate: [0, 360],
                                }}
                                transition={{
                                    duration: randomDuration,
                                    repeat: Infinity,
                                    ease: "linear",
                                    delay: randomDelay
                                }}
                            >
                                {i % 3 === 0 ? '✦' : (i % 3 === 1 ? '❤' : '✨')}
                            </motion.div>
                        );
                    })}
                </div>
            )}

            {/* Gold Dust Particle Effect - FIXED & CENTERED */}
            {isMounted && (
                <div 
                    className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[575px] pointer-events-none z-[201] overflow-hidden"
                >
                    {[...Array(30)].map((_, i) => {
                        const randomLeft = Math.random() * 100;
                        const randomTop = Math.random() * 100;
                        return (
                            <motion.div
                                key={i}
                                className="absolute w-[3px] h-[3px] bg-[#d4af37] rounded-full blur-[0.5px]"
                                style={{ 
                                    left: `${randomLeft}%`, 
                                    top: `${randomTop}%`,
                                    boxShadow: '0 0 8px #d4af37' 
                                }}
                                animate={{ 
                                    y: [0, -30, 0],
                                    opacity: [0, 0.6, 0],
                                }}
                                transition={{ 
                                    duration: 3 + Math.random() * 5, 
                                    repeat: Infinity, 
                                    ease: "easeInOut",
                                    delay: Math.random() * 10
                                }}
                            />
                        );
                    })}
                </div>
            )}

            {/* Click Particles Layer */}
            {clickParticles.map(p => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 1, scale: 0.5, x: p.x - 10, y: p.y - 10 }}
                    animate={{ opacity: 0, scale: 2, y: p.y - 100 }}
                    className="fixed pointer-events-none z-[1000] text-[#6d0208] text-2xl"
                >
                    ❤
                </motion.div>
            ))}

            <div 
                className="w-full max-w-[575px] bg-white relative shadow-2xl mx-auto"
                style={{ height: canvas.height * canvasScale }}
            >
                {/* Render Canvas Elements */}
                <div
                    style={{
                        width: canvas.width,
                        height: canvas.height,
                        backgroundColor: canvas.backgroundColor,
                        backgroundImage: canvas.backgroundImage ? `url("${canvas.backgroundImage}")` : undefined,
                        backgroundSize: canvas.backgroundSize || "cover",
                        backgroundRepeat: "repeat-y",
                        position: "absolute",
                        left: 0,
                        top: 0,
                        transform: `scale(${canvasScale})`,
                        transformOrigin: 'top left',
                        overflow: "hidden"
                    }}
                >
                    {/* Texture Overlay */}
                    {canvas?.texture && canvas?.texture !== 'none' && (
                        <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply z-[50]" style={{ backgroundImage: canvas.texture }} />
                    )}
                        {(canvasConfig.components || canvasConfig.canvas?.elements || []).map((comp: any) => {
                            const normalizedComp = {
                                ...comp,
                                x: comp.x ?? comp.props?.x ?? 0,
                                y: comp.y ?? comp.props?.y ?? 0,
                                w: comp.w ?? comp.props?.w ?? 0,
                                h: comp.h ?? comp.props?.h ?? 0,
                                z: comp.z ?? comp.props?.zIndex ?? comp.props?.z ?? comp.zIndex ?? 0
                            };
                            return renderCanvasComponent(normalizedComp);
                        })}

                        {/* Visual Scroll Indicator for Premium Look */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
                            style={{ zIndex: 1000 }}
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#6d0208]/40">Kéo xuống để xem thêm</span>
                            <div className="w-[1px] h-12 bg-gradient-to-b from-[#6d0208]/40 to-transparent" />
                        </motion.div>
                    </div>
                </div>

                {/* FAB Dock & Modals */}
                <FABDock
                    isPlaying={isPlaying}
                    scrollProgress={scrollProgress}
                    onToggleMusic={toggleMusic}
                    onOpenGift={() => setShowGiftModal(true)}
                    onOpenMap={wedding.map_url ? () => window.open(wedding.map_url, '_blank') : undefined}
                    onOpenRSVP={() => setShowRSVP(true)}
                />

                <AnimatePresence>
                    {selectedPhoto && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedPhoto(null)}
                            className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out"
                        >
                            <motion.img
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                src={selectedPhoto}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                alt="Full screen preview"
                            />
                            <button
                                className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors"
                                onClick={(e) => { e.stopPropagation(); setSelectedPhoto(null); }}
                            >
                                ✕
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <audio ref={audioRef} src={wedding.music_url} loop className="hidden" />

                <AnimatePresence>
                    {showGiftModal && (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative"
                            >
                                <button onClick={() => setShowGiftModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors z-20">✕</button>

                                <div className="bg-[#6d0208] p-8 text-center">
                                    <Heart className="text-white/30 mx-auto mb-4" size={32} />
                                    <h3 className="text-2xl font-script text-white">Mừng Cưới Online</h3>
                                    <p className="text-[10px] text-white/60 uppercase tracking-widest mt-1">Sự hiện diện của bạn là món quà ý nghĩa nhất</p>
                                </div>

                                <div className="flex border-b border-gray-100">
                                    <button
                                        onClick={() => setActiveGiftTab('groom')}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeGiftTab === 'groom' ? 'text-[#6d0208] bg-white border-b-2 border-[#6d0208]' : 'text-gray-400 bg-gray-50 hover:bg-white'}`}
                                    >
                                        Nhà Trai
                                    </button>
                                    <button
                                        onClick={() => setActiveGiftTab('bride')}
                                        className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeGiftTab === 'bride' ? 'text-[#6d0208] bg-white border-b-2 border-[#6d0208]' : 'text-gray-400 bg-gray-50 hover:bg-white'}`}
                                    >
                                        Nhà Gái
                                    </button>
                                </div>

                                <div className="p-8 text-center flex flex-col items-center">
                                    <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 border-4 border-white shadow-inner overflow-hidden">
                                        {/* Dynamic QR based on tab */}
                                        <img 
                                            src={activeGiftTab === 'groom' 
                                                ? (wedding.config_data?.groom_bank?.qr || wedding.bank_qr_code || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CHUA_CO_QR")
                                                : (wedding.config_data?.bride_bank?.qr || wedding.bank_qr_code || "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CHUA_CO_QR")
                                            } 
                                            className="w-full h-full object-contain" 
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-stone-400 font-medium">Số tài khoản:</p>
                                        <p className="text-lg font-bold text-[#6d0208] select-all">
                                            {activeGiftTab === 'groom' 
                                                ? (wedding.config_data?.groom_bank?.account || wedding.bank_account || "Đang cập nhật")
                                                : (wedding.config_data?.bride_bank?.account || wedding.bank_account || "Đang cập nhật")
                                            }
                                        </p>
                                        <p className="text-xs font-bold text-gray-800">
                                            {activeGiftTab === 'groom' 
                                                ? (wedding.config_data?.groom_bank?.name || wedding.bank_account_name || "CHÚ RỂ")
                                                : (wedding.config_data?.bride_bank?.name || wedding.bank_account_name || "CÔ DÂU")
                                            }
                                        </p>
                                        <p className="text-[9px] text-stone-400 uppercase tracking-tighter">
                                            {activeGiftTab === 'groom' 
                                                ? (wedding.config_data?.groom_bank?.bank || wedding.bank_name || "")
                                                : (wedding.config_data?.bride_bank?.bank || wedding.bank_name || "")
                                            }
                                        </p>
                                    </div>
                                </div>
                                <div className="px-8 pb-8">
                                    <button onClick={() => setShowGiftModal(false)} className="w-full py-4 bg-[#6d0208] text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg">Đã Gửi Lời Chúc</button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {showRSVP && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-stone-900/60 z-50 flex items-center justify-center p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
                            >
                                <button
                                    onClick={() => setShowRSVP(false)}
                                    className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 outline-none"
                                >
                                    ✕
                                </button>

                                {rsvpSuccess ? (
                                    <div className="text-center py-10 relative z-10">
                                        <div className="w-20 h-20 bg-[#fbf9f6] border-2 border-[#6d0208]/20 text-[#6d0208] rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">♥</div>
                                        <h3 className="text-3xl font-script text-[#6d0208] mb-2">Lời Cảm Ơn</h3>
                                        <p className="text-stone-600 font-lora italic px-4">Xác nhận của bạn đã được gửi tới cô dâu chú rể. Trân trọng cảm ơn!</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="relative text-center mb-6 pb-6 border-b border-[#6d0208]/10">
                                            <h2 className="text-4xl font-script text-[#6d0208] mb-2">Lời Phản Hồi</h2>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-lora">Xác nhận tham dự</p>
                                        </div>
                                        <form onSubmit={handleRSVPSubmit} className="space-y-4 font-sans relative z-10">
                                            {guest ? (
                                                <div className="text-center mb-6 bg-[#fff8f8] p-4 rounded-xl border border-[#6d0208]/10 shadow-sm">
                                                    <div className="text-stone-500 text-xs uppercase tracking-wider mb-1">Khách mời</div>
                                                    <div className="font-bold text-[#6d0208] text-xl font-serif">{guest.guest_name}</div>
                                                </div>
                                            ) : (
                                                <div className="text-sm text-stone-500 mb-6 italic text-center font-lora">Bạn đang xem ở chế độ khách vãng lai.</div>
                                            )}

                                            <div>
                                                <label className="block text-xs font-bold text-[#8b0000] mb-2 uppercase tracking-wide">Bạn có thể tham dự không?</label>
                                                <select
                                                    value={rsvpData.status}
                                                    onChange={(e) => setRsvpData({ ...rsvpData, status: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#6d0208] focus:ring-1 focus:ring-[#6d0208] outline-none transition bg-[#fbf9f6] text-stone-700 font-medium"
                                                >
                                                    <option value="attending">♥ Có, tôi sẽ đến chung vui</option>
                                                    <option value="wishes_only">✉ Tôi bận nhưng xin gửi lời chúc</option>
                                                    <option value="not_attending">✗ Rất tiếc, tôi không thể tham dự</option>
                                                </select>
                                            </div>

                                            {rsvpData.status === "attending" && (
                                                <div className="grid grid-cols-2 gap-4 pt-2">
                                                    <div>
                                                        <label className="block text-xs font-bold text-[#8b0000] mb-2 uppercase tracking-wide">Số người lớn</label>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={rsvpData.adult_count}
                                                            onChange={(e) => setRsvpData({ ...rsvpData, adult_count: parseInt(e.target.value) || 1 })}
                                                            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#6d0208] focus:ring-1 focus:ring-[#6d0208] outline-none transition bg-[#fbf9f6] text-center font-bold text-lg text-stone-800"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-[#8b0000] mb-2 uppercase tracking-wide">Số trẻ em</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={rsvpData.children_count}
                                                            onChange={(e) => setRsvpData({ ...rsvpData, children_count: parseInt(e.target.value) || 0 })}
                                                            className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#6d0208] focus:ring-1 focus:ring-[#6d0208] outline-none transition bg-[#fbf9f6] text-center font-bold text-lg text-stone-800"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="pt-2">
                                                <label className="block text-xs font-bold text-[#8b0000] mb-2 uppercase tracking-wide">Lời chúc</label>
                                                <textarea
                                                    rows={3}
                                                    value={rsvpData.wish_message}
                                                    onChange={(e) => setRsvpData({ ...rsvpData, wish_message: e.target.value })}
                                                    placeholder="Gửi lời chúc tốt đẹp nhất tới cô dâu chú rể..."
                                                    className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-[#6d0208] focus:ring-1 focus:ring-[#6d0208] outline-none transition resize-none bg-[#fbf9f6] text-stone-700 font-lora italic"
                                                ></textarea>
                                            </div>

                                            <div className="pt-4 pb-2">
                                                <button
                                                    type="submit"
                                                    disabled={submitting}
                                                    className="w-full py-4 bg-[#6d0208] text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#8b0000] transition disabled:opacity-70 shadow-md relative overflow-hidden group"
                                                >
                                                    <span className="relative z-10">{submitting ? "Đang gửi..." : "Gửi Xác Nhận"}</span>
                                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform"></div>
                                                </button>
                                            </div>
                                        </form>
                                    </>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
