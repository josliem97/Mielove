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

// Helper: Animation Variants
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

// Helper: Canvas Component Renderer
const RenderCanvasComponent = ({ comp, wedding, guest, params, replacePlaceholders, setShowRSVP, setShowGiftModal, setActiveGiftTab, setSelectedPhoto }: any) => {
    const preset = comp.animation?.preset;
    const variants = getAnimationVariants(preset || "");

    const normalizedComp = {
        ...comp,
        x: comp.x ?? comp.props?.x ?? 0,
        y: comp.y ?? comp.props?.y ?? 0,
        w: comp.w ?? comp.props?.w ?? 0,
        h: comp.h ?? comp.props?.h ?? 0,
        z: comp.z ?? comp.props?.zIndex ?? comp.props?.z ?? comp.zIndex ?? 0
    };

    return (
        <motion.div
            key={normalizedComp.id}
            initial="initial"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={variants}
            style={{
                position: "absolute",
                left: normalizedComp.x, top: normalizedComp.y, width: normalizedComp.w, height: normalizedComp.h, zIndex: normalizedComp.z,
                "--miu-node-rotate": `${normalizedComp.rotation || 0}deg`,
                animationName: (normalizedComp.animation?.loop) ? (normalizedComp.animation?.preset || "none") : "none",
                animationDuration: `${normalizedComp.animation?.duration || 1000}ms`,
                animationDelay: `${normalizedComp.animation?.delay || 0}ms`,
                animationIterationCount: normalizedComp.animation?.loop ? "infinite" : "1",
                animationTimingFunction: normalizedComp.animation?.easing || "ease-in-out"
            } as React.CSSProperties}
        >
            {normalizedComp.type === "container" && (
                <div style={{ width: '100%', height: '100%', backgroundColor: normalizedComp.props?.fill || 'transparent', borderRadius: normalizedComp.props?.borderRadius || 0, overflow: normalizedComp.props?.overflow || 'visible', ...(normalizedComp.style || {}) }}>
                    {normalizedComp.components?.map((child: any) => (
                        <RenderCanvasComponent 
                            key={child.id} 
                            comp={child} 
                            wedding={wedding} 
                            guest={guest} 
                            params={params} 
                            replacePlaceholders={replacePlaceholders} 
                            setShowRSVP={setShowRSVP} 
                            setShowGiftModal={setShowGiftModal} 
                            setActiveGiftTab={setActiveGiftTab} 
                            setSelectedPhoto={setSelectedPhoto} 
                        />
                    ))}
                </div>
            )}
            {normalizedComp.type === "element_text" && (
                <div style={{
                    width: "100%", height: "100%",
                    color: normalizedComp.props?.color || "#000",
                    fontSize: normalizedComp.props?.fontSize || 16,
                    textAlign: normalizedComp.props?.align || "left",
                    fontFamily: normalizedComp.props?.fontFamily || "inherit",
                    fontWeight: normalizedComp.props?.fontWeight || "normal",
                    lineHeight: normalizedComp.props?.lineHeight || 1.4,
                    letterSpacing: normalizedComp.props?.letterSpacing || "normal",
                    textTransform: normalizedComp.props?.textTransform || "none" as any,
                    whiteSpace: "pre-wrap",
                    display: 'flex', flexDirection: 'column',
                    justifyContent: normalizedComp.props?.valign || 'center',
                    textShadow: normalizedComp.props?.fontFamily === 'OpeningScript' ? '2px 2px 4px rgba(0,0,0,0.1)' : 'none',
                    ...(normalizedComp.style || {})
                }}>
                    {replacePlaceholders(String(normalizedComp.props?.text || ""))}
                </div>
            )}
            {normalizedComp.type === "element_shape" && (
                <div style={{
                    width: "100%", height: "100%",
                    backgroundColor: normalizedComp.props.fill || "transparent",
                    borderRadius: normalizedComp.props.borderRadius || 0,
                    boxShadow: normalizedComp.style?.boxShadow || 'none',
                    ...(normalizedComp.style || {})
                }}></div>
            )}
            {normalizedComp.type === "element_image" && normalizedComp.props?.src && (
                <motion.div 
                    className="group" 
                    style={{
                        width: "100%", height: "100%",
                        overflow: "hidden",
                        borderRadius: normalizedComp.props?.borderRadius || 0,
                        boxShadow: normalizedComp.props?.isDecor ? 'none' : (normalizedComp.props?.boxShadow || 'none'),
                        ...(normalizedComp.style || {})
                    }}
                >
                    <motion.img
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 1 }}
                        src={normalizedComp.props.src}
                        alt=""
                        className="w-full h-full block"
                        style={{
                            objectFit: (normalizedComp.props?.objectFit as any) || "cover",
                            objectPosition: (normalizedComp.props?.objectPosition as any) || "center",
                        }}
                    />
                </motion.div>
            )}
            {normalizedComp.type === "element_rsvp" && (
                <RSVPBlock props={normalizedComp.props} slug={params.slug} guest={guest} />
            )}
            {normalizedComp.type === "element_calendar" && <CalendarBlock props={{...normalizedComp.props, date: replacePlaceholders(normalizedComp.props.date)}} />}
            {normalizedComp.type === "element_countdown" && <CountdownBlock props={{...normalizedComp.props, targetDate: replacePlaceholders(normalizedComp.props.targetDate)}} />}
            {normalizedComp.type === "element_button" && (
                <ButtonBlock
                    props={normalizedComp.props}
                    onClick={() => {
                        if (normalizedComp.props.action === 'rsvp') setShowRSVP(true);
                        if (normalizedComp.props.action === 'map' && wedding.map_url) window.open(wedding.map_url, '_blank');
                        if (normalizedComp.props.action === 'gift') {
                            const text = (normalizedComp.props.text || "").toLowerCase();
                            if (text.includes("cô dâu") || text.includes("nhà gái")) setActiveGiftTab('bride');
                            else if (text.includes("chú rể") || text.includes("nhà trai")) setActiveGiftTab('groom');
                            setShowGiftModal(true);
                        }
                    }}
                />
            )}
            {normalizedComp.type === "element_timeline" && <TimelineBlock props={normalizedComp.props} />}
            {normalizedComp.type === "element_dresscode" && <DresscodeBlock props={normalizedComp.props} />}
            {normalizedComp.type === "element_album" && <AlbumBlock props={normalizedComp.props} onPhotoClick={(src: string) => setSelectedPhoto(src)} />}
            {normalizedComp.type === "element_slider" && <SliderBlock props={normalizedComp.props} />}
            {normalizedComp.type === "element_wishes" && <WishesBlock props={normalizedComp.props} slug={params.slug} />}
            {normalizedComp.type === "element_event_card" && <EventCardBlock props={normalizedComp.props} />}
            {normalizedComp.type === "element_quote" && <QuoteBlock props={normalizedComp.props} />}
            {normalizedComp.type === "element_bank" && <BankBlock props={normalizedComp.props} wedding={wedding} />}
            {normalizedComp.type === "element_map" && <MapBlock props={normalizedComp.props} />}
        </motion.div>
    );
};

export default function WeddingCard({ params }: { params: { slug: string } }) {
    const searchParams = useSearchParams();
    const guestSlug = searchParams.get('to');

    const [wedding, setWedding] = useState<WeddingData | null>(null);
    const [guest, setGuest] = useState<GuestData | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFoundError, setNotFoundError] = useState(false);

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
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [showGiftModal, setShowGiftModal] = useState(false);
    const [activeGiftTab, setActiveGiftTab] = useState<'groom' | 'bride'>('groom');
    const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [canvasScale, setCanvasScale] = useState(1);

    useEffect(() => {
        setIsMounted(true);
        const handleClick = (e: MouseEvent) => {
            const id = Date.now();
            setClickParticles(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => setClickParticles(prev => prev.filter(p => p.id !== id)), 1000);
        };
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            const winScroll = document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setScrollProgress(winScroll / height);
        };
        const handleResize = () => {
            const w = Math.min(window.innerWidth, 575);
            setCanvasScale(w / 575);
        };
        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        handleResize();
        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Disable cache strictly with headers and timestamp
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/${params.slug}?t=${Date.now()}`, {
                    cache: 'no-store',
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0'
                    }
                });
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                
                // Post-process data to ensure names and Thank You section exist
                if (data.config_data) {
                    const comps = data.config_data.components || data.config_data.canvas?.elements || [];
                    
                    // 1. Insert Couple Photos after "Lời hứa trọn đời"
                    const promiseComp = comps.find((c: any) => {
                        const txt = (c.props?.text || "").toLowerCase();
                        return txt.includes("lời hứa trọn đời") || txt.includes("lời hứa chọn đời");
                    });
                    
                    if (promiseComp) {
                        console.log("Found promise component at Y:", promiseComp.y || promiseComp.props?.y);
                        const py = promiseComp.y || promiseComp.props?.y || 0;
                        const ph = promiseComp.h || promiseComp.props?.h || 0;
                        const targetY = py + ph + 40;
                        const hasPhotos = comps.some((c: any) => c.id === 'couple-photo-groom');

                        if (!hasPhotos) {
                            const groomPhoto = {
                                id: "couple-photo-groom", type: "element_image", x: 40, y: targetY, w: 235, h: 350, z: 10,
                                props: { src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500", borderRadius: 10, objectFit: "cover" },
                                animation: { preset: "miu-fadeInLeft", duration: 1000 }
                            };
                            const bridePhoto = {
                                id: "couple-photo-bride", type: "element_image", x: 300, y: targetY, w: 235, h: 350, z: 10,
                                props: { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500", borderRadius: 10, objectFit: "cover" },
                                animation: { preset: "miu-fadeInRight", duration: 1000 }
                            };

                            comps.forEach((c: any) => {
                                let cy = c.y || c.props?.y || 0;
                                if (cy > py) {
                                    if (c.y !== undefined) c.y += 400;
                                    else if (c.props?.y !== undefined) c.props.y += 400;
                                }
                            });

                            if (data.config_data.components) data.config_data.components.push(groomPhoto, bridePhoto);
                            else if (data.config_data.canvas?.elements) data.config_data.canvas.elements.push(groomPhoto, bridePhoto);
                            
                            if (data.config_data.canvas) data.config_data.canvas.height = (data.config_data.canvas.height || 0) + 400;
                        }
                    }

                    // 2. Logic for Thank You section (re-calculating lastY after photo insertion)
                    const hasThankYou = comps.some((c: any) => c.id === 'thank-you-header' || (c.props?.text || "").toLowerCase().includes("cảm ơn"));
                    if (!hasThankYou) {
                        const lastY = comps.reduce((max: number, c: any) => Math.max(max, (c.y || c.props?.y || 0) + (c.h || c.props?.h || 0)), 0);
                        
                        const thankYouHeader = {
                            id: "thank-you-header", type: "element_text", x: 20, y: lastY + 80, w: 535, h: 100, z: 100,
                            props: {
                                text: "Sự hiện diện của bạn là\nniềm vinh hạnh của gia đình chúng tôi!",
                                fontSize: 26, color: "#6d0208", align: "center", fontFamily: "serif", fontWeight: "600"
                            },
                            animation: { preset: "miu-fadeInUp", duration: 1000 }
                        };

                        const thankYouImg = {
                            id: "thank-you-img", type: "element_image", x: 20, y: lastY + 220, w: 535, h: 650, z: 90,
                            props: {
                                src: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800",
                                borderRadius: 15, objectFit: "cover"
                            },
                            animation: { preset: "miu-fadeIn", duration: 1500, delay: 300 }
                        };

                        const thankYouQuote = {
                            id: "thank-you-quote", type: "element_text", x: 280, y: lastY + 680, w: 250, h: 150, z: 100,
                            props: {
                                text: "I've found my home\nmy heart\nand my forever!",
                                fontSize: 22, color: "#ffffff", align: "left", fontFamily: "serif",
                                textShadow: "1px 1px 4px rgba(0,0,0,0.5)"
                            },
                            animation: { preset: "miu-slideIn", duration: 1200, delay: 800 }
                        };

                        const compsTarget = data.config_data.components || data.config_data.canvas?.elements;
                        if (compsTarget) {
                            compsTarget.push(thankYouHeader, thankYouImg, thankYouQuote);
                        }
                        
                        if (data.config_data.canvas) {
                            data.config_data.canvas.height = Math.max(data.config_data.canvas.height || 0, lastY + 950);
                        }
                    }
                }
                
                setWedding(data);

                if (guestSlug) {
                    const gRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/public/${params.slug}/${guestSlug}`, {
                        cache: 'no-store'
                    });
                    if (gRes.ok) {
                        const gData = await gRes.json();
                        setGuest(gData);
                        setRsvpData({
                            status: gData.status !== "unread" ? gData.status : "attending",
                            adult_count: gData.adult_count || 1,
                            children_count: gData.children_count || 0,
                            wish_message: gData.wish_message || ""
                        });
                    }
                }
            } catch (e) {
                setNotFoundError(true);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [params.slug, guestSlug]);

    useEffect(() => {
        if (!wedding) return;
        document.title = `Thiệp cưới ${wedding.groom_name} & ${wedding.bride_name}`;
    }, [wedding]);

    const replacePlaceholders = (text: string) => {
        if (!text || !wedding) return text;
        const p = wedding.config_data?.parents || {};
        return text
            .replace(/{{groom_name\|upper}}/g, (wedding.groom_name || "").toUpperCase())
            .replace(/{{bride_name\|upper}}/g, (wedding.bride_name || "").toUpperCase())
            .replace(/{{groom_name}}/g, wedding.groom_name || "")
            .replace(/{{bride_name}}/g, wedding.bride_name || "")
            .replace(/{{groom_father}}/g, p.groom_father || "Nguyễn Văn A")
            .replace(/{{groom_mother}}/g, p.groom_mother || "Trần Thị B")
            .replace(/{{bride_father}}/g, p.bride_father || "Lê Văn C")
            .replace(/{{bride_mother}}/g, p.bride_mother || "Phạm Thị D")
            .replace(/{{wedding_date}}/g, wedding.wedding_date?.split('T')[0] || "")
            .replace(/{{location}}/g, wedding.location || "");
    };

    const handleRSVPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!guest) return;
        setSubmitting(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/guests/rsvp/${guest.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(rsvpData)
            });
            setRsvpSuccess(true);
            setTimeout(() => { setShowRSVP(false); setRsvpSuccess(false); }, 3000);
        } catch (e) {
            alert("Lỗi khi gửi RSVP");
        } finally {
            setSubmitting(false);
        }
    };

    const openEnvelope = () => {
        setShowEnvelope(false);
        const musicSrc = wedding?.config_data?.canvas?.musicUrl || wedding?.music_url;
        if (musicSrc && audioRef.current) {
            audioRef.current.src = musicSrc;
            audioRef.current.play().catch(() => {});
            setIsPlaying(true);
        }
    };

    const toggleMusic = () => {
        if (!audioRef.current) return;
        if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
        else { audioRef.current.play(); setIsPlaying(true); }
    };
    if (loading) return <div className="min-h-screen flex items-center justify-center bg-[#FFF0F5] text-rose-500">Đang tải thiệp...</div>;
    if (notFoundError || !wedding) return <div className="min-h-screen flex items-center justify-center">Không tìm thấy thiệp mời.</div>;

    const isCanvasMode = wedding.config_data?.canvasProps !== undefined || wedding.config_data?.canvas !== undefined;
    const canvasConfig = isCanvasMode ? wedding.config_data : {
        canvas: { width: 575, height: 1600, backgroundColor: "#fdf8f5" },
        components: [
            { id: "bg-shape", type: "element_shape", x: 0, y: 0, w: 575, h: 450, z: 1, props: { fill: "#6d0208", borderRadius: 0 } },
            {
                id: "title-text", type: "element_text", x: 20, y: 150, w: 535, h: 100, z: 10,
                props: { text: "Quang Huy & Thảo Uyên", fontSize: 44, color: "#ffffff", align: "center", fontFamily: "'High Spirited', cursive" },
                animation: { preset: "miu-baseline", duration: 1200 }
            },
            {
                id: "desc-text", type: "element_text", x: 20, y: 240, w: 535, h: 60, z: 10,
                props: { text: "TRÂN TRỌNG KÍNH MỜI", fontSize: 14, color: "#fdecd8", align: "center", fontFamily: "serif" },
                animation: { preset: "miu-fadeIn", duration: 1500, delay: 500 }
            },
            {
                id: "main-img", type: "element_image", x: 50, y: 400, w: 475, h: 600, z: 5,
                props: { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", borderRadius: 20 },
                animation: { preset: "miu-zoomIn", duration: 1000, delay: 300 }
            },
            {
                id: "cal", type: "element_calendar", x: 85, y: 1050, w: 405, h: 180, z: 20,
                props: { date: "2026-12-31", time: "09:00", label: "LỄ THÀNH HÔN" },
                animation: { preset: "miu-stomp", duration: 800, delay: 800 }
            },
            {
                id: "thank-you", type: "element_text", x: 20, y: 1350, w: 535, h: 150, z: 20,
                props: { 
                    text: "Sự hiện diện của quý vị là niềm vinh hạnh của chúng tôi.\nTrân trọng cảm ơn!", 
                    fontSize: 18, color: "#6d0208", align: "center", fontFamily: "serif", italic: true 
                },
                animation: { preset: "miu-fadeInUp", duration: 1200, delay: 1000 }
            }
        ]
    };

    const canvas = canvasConfig.canvas || canvasConfig.canvasProps || { width: 575, height: 2000, backgroundColor: "#ffffff" };

    return (
        <div className="bg-stone-100 min-h-screen flex justify-center font-sans overflow-x-hidden">
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

            {isMounted && (
                <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[575px] pointer-events-none z-[200] overflow-hidden">
                    {[...Array(15)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute text-[#c5a059] text-[10px]"
                            style={{ left: `${Math.random() * 100}%` }}
                            animate={{ y: ["-10vh", "110vh"], rotate: 360 }}
                            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear", delay: Math.random() * 10 }}
                        >
                            ✦
                        </motion.div>
                    ))}
                </div>
            )}

            {clickParticles.map(p => (
                <motion.div key={p.id} initial={{ opacity: 1, scale: 0.5, x: p.x - 10, y: p.y - 10 }} animate={{ opacity: 0, scale: 2, y: p.y - 100 }} className="fixed pointer-events-none z-[1000] text-[#6d0208] text-2xl">❤</motion.div>
            ))}

            <div className="w-full flex flex-col items-center bg-stone-100" style={{ minHeight: '100vh' }}>
                <div 
                    className="relative bg-white shadow-2xl overflow-hidden" 
                    style={{ 
                        width: canvas.width * canvasScale, 
                        height: canvas.height * canvasScale 
                    }}
                >
                    <div style={{
                        width: canvas.width, 
                        height: canvas.height,
                        backgroundColor: canvas.backgroundColor,
                        backgroundImage: canvas.backgroundImage ? `url("${canvas.backgroundImage}")` : undefined,
                        backgroundSize: "cover",
                        position: "absolute", 
                        left: 0, 
                        top: 0,
                        transform: `scale(${canvasScale})`,
                        transformOrigin: 'top left',
                        overflow: "hidden"
                    }}>
                        {(canvasConfig.components || canvasConfig.canvas?.elements || []).map((comp: any) => (
                            <RenderCanvasComponent 
                                key={comp.id} comp={comp} wedding={wedding} guest={guest} params={params} 
                                replacePlaceholders={replacePlaceholders} setShowRSVP={setShowRSVP} 
                                setShowGiftModal={setShowGiftModal} setActiveGiftTab={setActiveGiftTab} setSelectedPhoto={setSelectedPhoto} 
                            />
                        ))}
                    </div>
                </div>
            </div>

            <FABDock
                isPlaying={isPlaying} scrollProgress={scrollProgress} onToggleMusic={toggleMusic}
                onOpenGift={() => setShowGiftModal(true)} onOpenMap={() => window.open(wedding.map_url, '_blank')} onOpenRSVP={() => setShowRSVP(true)}
            />

            <audio ref={audioRef} loop className="hidden" />

            <AnimatePresence>
                {selectedPhoto && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedPhoto(null)} className="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out">
                        <img src={selectedPhoto} className="max-w-full max-h-full object-contain rounded-lg" alt="Full view" />
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showGiftModal && (
                    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative p-8 text-center">
                            <button onClick={() => setShowGiftModal(false)} className="absolute top-4 right-4 text-gray-400">✕</button>
                            <h3 className="text-2xl font-serif text-[#6d0208] mb-6">Mừng Cưới Online</h3>
                            <div className="flex mb-6 bg-gray-50 rounded-xl p-1">
                                <button onClick={() => setActiveGiftTab('groom')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${activeGiftTab === 'groom' ? 'bg-white text-[#6d0208] shadow-sm' : 'text-gray-400'}`}>Nhà Trai</button>
                                <button onClick={() => setActiveGiftTab('bride')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${activeGiftTab === 'bride' ? 'bg-white text-[#6d0208] shadow-sm' : 'text-gray-400'}`}>Nhà Gái</button>
                            </div>
                            <img 
                                src={activeGiftTab === 'groom' ? (wedding.config_data?.groom_bank?.qr || wedding.bank_qr_code) : (wedding.config_data?.bride_bank?.qr || wedding.bank_qr_code)} 
                                className="w-48 h-48 mx-auto mb-4 object-contain" 
                            />
                            <p className="font-bold text-[#6d0208]">{activeGiftTab === 'groom' ? (wedding.config_data?.groom_bank?.account || wedding.bank_account) : (wedding.config_data?.bride_bank?.account || wedding.bank_account)}</p>
                            <p className="text-xs text-gray-500 uppercase">{activeGiftTab === 'groom' ? (wedding.config_data?.groom_bank?.name || wedding.bank_account_name) : (wedding.config_data?.bride_bank?.name || wedding.bank_account_name)}</p>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showRSVP && (
                    <div className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center p-4 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
                            <button onClick={() => setShowRSVP(false)} className="absolute top-4 right-4">✕</button>
                            <h2 className="text-3xl font-serif text-[#6d0208] text-center mb-6">Xác Nhận Tham Dự</h2>
                            {rsvpSuccess ? (
                                <div className="text-center py-8">Cảm ơn bạn đã phản hồi!</div>
                            ) : (
                                <form onSubmit={handleRSVPSubmit} className="space-y-4">
                                    <select value={rsvpData.status} onChange={e => setRsvpData({...rsvpData, status: e.target.value})} className="w-full p-3 border rounded-lg">
                                        <option value="attending">Sẽ tham dự</option>
                                        <option value="not_attending">Không thể tham dự</option>
                                    </select>
                                    <textarea placeholder="Lời chúc của bạn..." value={rsvpData.wish_message} onChange={e => setRsvpData({...rsvpData, wish_message: e.target.value})} className="w-full p-3 border rounded-lg h-24" />
                                    <button type="submit" disabled={submitting} className="w-full py-4 bg-[#6d0208] text-white rounded-xl font-bold uppercase tracking-widest text-xs">{submitting ? "Đang gửi..." : "Gửi phản hồi"}</button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
