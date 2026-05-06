"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";
import {
    LayoutGrid, Image as ImageIcon, Sparkles, BoxSelect, Settings, LifeBuoy,
    Type, Frame, MapPin, Undo, Redo, Music, Eye, Save, X, Plus, ChevronDown, Check, MousePointer2, Calendar, Clock, Square, Copy, Edit3
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    CalendarBlock, CountdownBlock, ButtonBlock, TimelineBlock, 
    DresscodeBlock, AlbumBlock, WishesBlock, BankBlock, MapBlock, SliderBlock, EventCardBlock, QuoteBlock
} from "@/components/canvas/blocks";

const DEFAULT_CANVAS_CONFIG = {
    canvas: { width: 575, height: 9200, backgroundColor: "#fcf8f0", texture: "none", snapping: true },
    components: []
};

const SECTIONS = [
    { id: 'hero', label: 'Bìa thiệp', y: 0 },
    { id: 'portrait', label: 'Chân dung', y: 850 },
    { id: 'parents', label: 'Gia đình', y: 2550 },
    { id: 'calendar', label: 'Ngày cưới', y: 4750 },
    { id: 'timeline', label: 'Lịch trình', y: 5750 },
    { id: 'album', label: 'Album ảnh', y: 6950 },
    { id: 'gift', label: 'Mừng cưới', y: 9150 },
];

const RESIZE_HANDLES = [
    { id: 'nw', style: { top: -5, left: -5, cursor: 'nw-resize' } },
    { id: 'n',  style: { top: -5, left: '50%', marginLeft: -5, cursor: 'n-resize' } },
    { id: 'ne', style: { top: -5, right: -5, cursor: 'ne-resize' } },
    { id: 'e',  style: { top: '50%', marginTop: -5, right: -5, cursor: 'e-resize' } },
    { id: 'se', style: { bottom: -5, right: -5, cursor: 'se-resize' } },
    { id: 's',  style: { bottom: -5, left: '50%', marginLeft: -5, cursor: 's-resize' } },
    { id: 'sw', style: { bottom: -5, left: -5, cursor: 'sw-resize' } },
    { id: 'w',  style: { top: '50%', marginTop: -5, left: -5, cursor: 'w-resize' } },
];

const CanvasNode = React.memo(({ comp, isSelected, isDraggingActual, dragOffset, onPointerDown, onPointerMove, onPointerUp, onResizeStart, replacePlaceholders, selectedBlockId, isDragging, weddingConfig }: any) => {
    const isComplex = ['element_calendar', 'element_countdown', 'element_rsvp', 'element_timeline', 'element_dresscode', 'element_album', 'element_slider', 'element_wishes', 'element_bank', 'element_map', 'element_event_card', 'element_quote'].includes(comp.type);

    return (
        <motion.div
            key={comp.id}
            onPointerDown={(e) => onPointerDown(e, comp)}
            onClick={(e) => e.stopPropagation()}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className={`miu-element group ${isSelected ? 'z-[1000]' : ''}`}
            style={{
                position: "absolute",
                left: comp.x, top: comp.y, width: comp.w, height: comp.h, zIndex: comp.z,
                cursor: isDraggingActual ? "grabbing" : "grab",
                userSelect: "none",
                transform: `rotate(${comp.rotation || 0}deg) translate(${isDraggingActual ? dragOffset.x : 0}px, ${isDraggingActual ? dragOffset.y : 0}px)`,
                willChange: "left, top, transform",
                outline: isSelected ? "2px solid #0071E3" : "none",
                outlineOffset: "2px",
                boxShadow: isSelected ? "0 10px 30px rgba(0,0,0,0.15)" : "none",
                transition: isDraggingActual ? "none" : "outline 0.2s, box-shadow 0.2s, left 0.1s, top 0.1s"
            }}
        >
            {/* Interaction Mask for complex blocks */}
            {isComplex && <div className="absolute inset-0 z-50 cursor-pointer" />}

            {/* Resize handles — only when selected */}
            {isSelected && RESIZE_HANDLES.map(h => (
                <div
                    key={h.id}
                    onPointerDown={(e) => onResizeStart(e, h.id, comp)}
                    style={{
                        position: 'absolute',
                        width: 10, height: 10,
                        background: '#fff',
                        border: '2px solid #0071E3',
                        borderRadius: 2,
                        zIndex: 1001,
                        ...h.style
                    }}
                />
            ))}

            {/* Renderer */}
            {comp.type === 'container' && (
                <div style={{ width: '100%', height: '100%', backgroundColor: comp.props.fill || 'transparent', borderRadius: comp.props.borderRadius || 0, overflow: comp.props.overflow || 'visible', ...(comp.style || {}) }}>
                    {comp.components && comp.components.map((child: any) => (
                        <CanvasNode
                            key={child.id}
                            comp={child}
                            isSelected={selectedBlockId === child.id}
                            isDraggingActual={isDragging && selectedBlockId === child.id}
                            dragOffset={dragOffset}
                            onPointerDown={onPointerDown}
                            onPointerMove={onPointerMove}
                            onPointerUp={onPointerUp}
                            onResizeStart={onResizeStart}
                            replacePlaceholders={replacePlaceholders}
                            selectedBlockId={selectedBlockId}
                            isDragging={isDragging}
                            weddingConfig={weddingConfig}
                        />
                    ))}
                </div>
            )}
            {comp.type === 'element_text' && (
                <div style={{
                    width: '100%', height: '100%',
                    color: comp.props.color || '#000',
                    fontSize: comp.props.fontSize || 16,
                    textAlign: comp.props.align || 'left',
                    fontFamily: comp.props.fontFamily || 'inherit',
                    fontWeight: comp.props.fontWeight || 'normal',
                    lineHeight: 1.4,
                    whiteSpace: 'pre-wrap',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: comp.props.valign || 'center',
                    ...(comp.style || {})
                }}>
                    {replacePlaceholders(String(comp.props.text || ""))}
                </div>
            )}
            {comp.type === 'element_shape' && (
                <div style={{
                    width: '100%', height: '100%',
                    backgroundColor: comp.props.fill || 'transparent',
                    borderRadius: comp.props.borderRadius || 0,
                    ...(comp.style || {})
                }}></div>
            )}
            {comp.type === 'element_image' && (
                <div style={{
                    width: '100%', height: '100%',
                    backgroundImage: `url(${comp.props.src})`,
                    backgroundSize: comp.props.objectFit || 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: 'transparent',
                    borderRadius: comp.props.borderRadius || 0,
                    ...(comp.style || {})
                }}></div>
            )}
            {comp.type === 'element_rsvp' && (
                <div
                    className="w-full h-full bg-[#fdecd8] border-2 border-stone-200/50 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-inner"
                    style={comp.style || {}}
                >
                    <h3 className="text-2xl font-script text-[#8d5f25] mb-2">Xác nhận tham dự</h3>
                </div>
            )}
            {comp.type === "element_calendar" && <CalendarBlock props={comp.props} />}
            {comp.type === "element_countdown" && <CountdownBlock props={comp.props} />}
            {comp.type === "element_button" && <ButtonBlock props={comp.props} />}
            {comp.type === "element_timeline" && <TimelineBlock props={comp.props} />}
            {comp.type === "element_dresscode" && <DresscodeBlock props={comp.props} />}
            {comp.type === "element_album" && <AlbumBlock props={comp.props} />}
            {comp.type === "element_slider" && <SliderBlock props={comp.props} />}
            {comp.type === "element_wishes" && <WishesBlock props={comp.props} slug={weddingConfig?.slug} />}
            {comp.type === "element_bank" && <BankBlock props={comp.props} wedding={weddingConfig} />}
            {comp.type === "element_map" && <MapBlock props={comp.props} />}
            {comp.type === "element_event_card" && <EventCardBlock props={comp.props} />}
            {comp.type === "element_quote" && <QuoteBlock props={comp.props} />}
        </motion.div>
    );
});
CanvasNode.displayName = "CanvasNode";

// --- Mock Initial Components for visual testing ---
const generateMockComponents = () => {
    return [
        {
            id: "text-1", type: "element_text",
            x: 20, y: 100, w: 535, h: 100, z: 10,
            props: { text: "Thanh Sơn & Diệu Nhi", fontSize: 48, color: "#6d0208", fontFamily: "serif", align: "center" }
        },
        {
            id: "shape-1", type: "element_shape",
            x: 100, y: 250, w: 375, h: 400, z: 5,
            props: { shape: "rect", fill: "#f5f1f0", borderRadius: 10 }
        },
        {
            id: "image-1", type: "element_image",
            x: 120, y: 270, w: 335, h: 360, z: 10,
            props: { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&h=500&fit=crop", objectFit: "cover" }
        }
    ];
};
export default function BuilderPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [weddingConfig, setWeddingConfig] = useState<any>(null);
    const [configData, setConfigData] = useState<any>(DEFAULT_CANVAS_CONFIG);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [canvasScale, setCanvasScale] = useState(1);
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTab, setActiveTab] = useState("templates");
    const [showFloatingEditor, setShowFloatingEditor] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [elementStartPos, setElementStartPos] = useState({ x: 0, y: 0 });
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const canvasRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);

    const [templates, setTemplates] = useState<any[]>([]);
    const [selectedNode, setSelectedNode] = useState<any>(null);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Undo/Redo History
    const [history, setHistory] = useState<any[]>([]);
    const [redoStack, setRedoStack] = useState<any[]>([]);

    const scrollToSection = (yPixels: number) => {
        if (viewportRef.current) {
            viewportRef.current.scrollTo({ top: yPixels * canvasScale, behavior: 'smooth' });
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ring': return '💍';
            case 'glass': return '🥂';
            case 'music': return '🎵';
            case 'heart': return '❤️';
            case 'camera': return '📸';
            case 'cake': return '🎂';
            case 'gift': return '🎁';
            case 'map': return '📍';
            case 'car': return '🚗';
            case 'star': return '⭐';
            default: return '✨';
        }
    };

    const replacePlaceholders = (text: string) => {
        if (!text || !weddingConfig) return text;
        return text
            .replace(/{{groom_name}}/g, weddingConfig.groom_name || "Chú rể")
            .replace(/{{bride_name}}/g, weddingConfig.bride_name || "Cô dâu")
            .replace(/{{groom_father}}/g, weddingConfig.groom_father || "Ông Nội")
            .replace(/{{groom_mother}}/g, weddingConfig.groom_mother || "Bà Nội")
            .replace(/{{bride_father}}/g, weddingConfig.bride_father || "Ông Ngoại")
            .replace(/{{bride_mother}}/g, weddingConfig.bride_mother || "Bà Ngoại")
            .replace(/{{wedding_date}}/g, weddingConfig.wedding_date?.split('T')[0] || "Chưa xác định")
            .replace(/{{location}}/g, weddingConfig.location || "Địa điểm chưa xác định");
    };

    const saveHistory = () => {
        setHistory(prev => [...prev.slice(-49), JSON.parse(JSON.stringify(configData))]);
        setRedoStack([]);
    };

    const undo = () => {
        if (history.length === 0) return;
        const prevState = history[history.length - 1];
        setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(configData))]);
        setConfigData(prevState);
        setHistory(prev => prev.slice(0, -1));
    };

    const redo = () => {
        if (redoStack.length === 0) return;
        const nextState = redoStack[redoStack.length - 1];
        setHistory(prev => [...prev, JSON.parse(JSON.stringify(configData))]);
        setConfigData(nextState);
        setRedoStack(prev => prev.slice(0, -1));
    };

    useEffect(() => {
        const fetchWedding = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/id/${params.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setWeddingConfig(res.data);

                if (res.data.config_data && res.data.config_data.components) {
                    setConfigData(res.data.config_data);
                } else {
                    setConfigData(DEFAULT_CANVAS_CONFIG);
                }

                // Fetch templates for the gallery
                const tRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/templates`);
                setTemplates(tRes.data);
            } catch (error) {
                console.error("Fetch err", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWedding();

        const handleResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                const parentW = canvasRef.current.parentElement.clientWidth;
                setCanvasScale(Math.min((parentW - 80) / 575, 1));
            }
        };
        window.addEventListener("resize", handleResize);
        setTimeout(handleResize, 100);
        return () => window.removeEventListener("resize", handleResize);
    }, [params.id]);

    // Autosave: save 30s after last change, only when there's a weddingConfig loaded
    const autosaveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const configDataRef = useRef(configData);
    const weddingConfigRef = useRef(weddingConfig);
    useEffect(() => { configDataRef.current = configData; }, [configData]);
    useEffect(() => { weddingConfigRef.current = weddingConfig; }, [weddingConfig]);

    useEffect(() => {
        if (!weddingConfig?.id) return; // Don't autosave before initial load
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = setTimeout(async () => {
            if (!weddingConfigRef.current?.id) return;
            setSaving(true);
            try {
                const token = localStorage.getItem("access_token");
                await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/${weddingConfigRef.current.id}`, {
                    ...weddingConfigRef.current,
                    config_data: configDataRef.current
                }, { headers: { Authorization: `Bearer ${token}` } });
            } catch (e) {
                // Silent fail on autosave — user can still manually save
            } finally {
                setSaving(false);
                setLastSaved(new Date());
            }
        }, 30000); // 30 seconds debounce
        return () => { if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [configData]);

    const findNode = (components: any[], id: string): any => {
        for (const c of components) {
            if (c.id === id) return c;
            if (c.components) {
                const found = findNode(c.components, id);
                if (found) return found;
            }
        }
        return null;
    };

    const updateNode = (components: any[], id: string, updates: any): any[] => {
        return components.map(c => {
            if (c.id === id) return { ...c, ...updates, props: { ...c.props, ...(updates.props || {}) } };
            if (c.components) return { ...c, components: updateNode(c.components, id, updates) };
            return c;
        });
    };

    const deleteNode = (components: any[], id: string): any[] => {
        return components.filter(c => c.id !== id).map(c => {
            if (c.components) return { ...c, components: deleteNode(c.components, id) };
            return c;
        });
    };

    useEffect(() => {
        const node = configData.components ? findNode(configData.components, selectedBlockId || "") : null;
        setSelectedNode(node || null);
    }, [selectedBlockId, configData.components]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("access_token");
            await axios.put(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/weddings/${weddingConfig.id}`, {
                ...weddingConfig,
                config_data: configData
            }, { headers: { Authorization: `Bearer ${token}` } });
        } catch (error) {
            console.error(error);
            alert("Lưu thất bại. Vui lòng thử lại.");
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploadingImage(true);
        try {
            const token = localStorage.getItem("access_token");
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/upload/image`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });
            const url = res.data.url;
            setUploadedImages(prev => [url, ...prev]);
            addComponent('image', { src: url, objectFit: 'cover' });
        } catch (err: any) {
            const msg = err?.response?.data?.detail || "Tải ảnh thất bại.";
            alert(msg);
        } finally {
            setUploadingImage(false);
            // Reset input so same file can be re-uploaded
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handlePreview = () => {
        if (!weddingConfig?.slug) return;
        window.open(`/${weddingConfig.slug}`, '_blank');
    };

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z') { e.preventDefault(); undo(); }
                if (e.key === 'y') { e.preventDefault(); redo(); }
                if (e.key === 's') { e.preventDefault(); handleSave(); }
                if (e.key === 'd') { e.preventDefault(); duplicateSelected(); }
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (selectedBlockId) {
                    saveHistory();
                    setConfigData({ ...configData, components: deleteNode(configData.components, selectedBlockId) });
                    setSelectedBlockId(null);
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [configData, selectedBlockId, history, redoStack]);

    const applyTemplate = (template: any) => {
        if (!confirm(`Bạn có chắc muốn áp dụng mẫu "${template.name}"? Thao tác này sẽ ghi đè thiết kế hiện tại.`)) return;
        saveHistory();
        setConfigData(template.config_data);
        setSelectedBlockId(null);
    };

    const addComponent = (type: string, presetProps: any = {}) => {
        saveHistory();
        let newComponent: any = {
            id: `el_${Math.random().toString(36).substr(2, 9)}`,
            type: `element_${type}`,
            x: 50, y: 150, w: 200, h: 50, z: configData.components.length + 1,
            props: { ...presetProps }
        };

        if (type === "text" && !presetProps.text) newComponent.props = { text: "Nội dung văn bản", fontSize: 24, color: "#333", fontFamily: "serif", ...presetProps };
        else if (type === "image") { newComponent.w = 300; newComponent.h = 400; newComponent.props = { src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800", objectFit: "cover", ...presetProps }; }
        else if (type === "shape") { newComponent.w = 100; newComponent.h = 100; newComponent.props = { shape: "rect", fill: "#D1D1D6", borderRadius: 0, ...presetProps }; }
        else if (type === "rsvp") { newComponent.w = 400; newComponent.h = 300; newComponent.props = { bgColor: "#fff", ...presetProps }; }
        else if (type === "calendar") { newComponent.w = 400; newComponent.h = 240; newComponent.props = { date: "2026-12-31", time: "09:00", label: "LỄ THÀNH HÔN", ...presetProps }; }
        else if (type === "countdown") { newComponent.w = 420; newComponent.h = 100; newComponent.props = { targetDate: "2026-12-31T09:00", ...presetProps }; }
        else if (type === "button") { newComponent.w = 240; newComponent.h = 60; newComponent.props = { text: "Chỉ đường", action: "link", url: "", ...presetProps }; }
        else if (type === "timeline") { newComponent.w = 500; newComponent.h = 600; newComponent.props = { items: [{time: "09:00", title: "Lễ thành hôn", icon: "ring"}], ...presetProps }; }
        else if (type === "dresscode") { newComponent.w = 500; newComponent.h = 300; newComponent.props = { colors: ["#fdecd8", "#6d0208", "#ffffff"], ...presetProps }; }
        else if (type === "bank") { newComponent.w = 500; newComponent.h = 800; newComponent.props = { title: "Mừng cưới", name: "", account: "", bank: "", qr: "", ...presetProps }; }
        else if (type === "quote") { newComponent.w = 500; newComponent.h = 200; newComponent.props = { text: "Câu trích dẫn của bạn", author: "", ...presetProps }; }
        else if (type === "event_card") { newComponent.w = 500; newComponent.h = 600; newComponent.props = { title: "LỄ THÀNH HÔN", time: "09:00", date: "2026-12-31", location: "Địa điểm", ...presetProps }; }
        else if (type === "map") { newComponent.w = 500; newComponent.h = 400; newComponent.props = { url: "", ...presetProps }; }

        setConfigData({ ...configData, components: [...configData.components, newComponent] });
        setSelectedBlockId(newComponent.id);
        setSidebarOpen(false);
    };

    const updateSelected = (updates: any) => {
        if (!selectedBlockId) return;
        setConfigData({
            ...configData,
            components: updateNode(configData.components, selectedBlockId, updates)
        });
    };

    const duplicateSelected = () => {
        if (!selectedBlockId || !selectedNode) return;
        saveHistory();
        const newId = `el_${Math.random().toString(36).substr(2, 9)}`;
        const newItem = {
            ...selectedNode,
            id: newId,
            x: selectedNode.x + 20,
            y: selectedNode.y + 20,
            z: configData.components.length + 1
        };
        setConfigData({ ...configData, components: [...configData.components, newItem] });
        setSelectedBlockId(newId);
    };

    const moveZIndex = (direction: 'up' | 'down' | 'front' | 'back') => {
        if (!selectedBlockId) return;
        saveHistory();
        const components = [...configData.components];
        const idx = components.findIndex((c: any) => c.id === selectedBlockId);
        if (idx === -1) return;

        if (direction === 'front') {
            const maxZ = Math.max(...components.map((c: any) => c.z || 0), 0);
            components[idx] = { ...components[idx], z: maxZ + 1 };
        } else if (direction === 'back') {
            const minZ = Math.min(...components.map((c: any) => c.z || 0), 0);
            components[idx] = { ...components[idx], z: minZ - 1 };
        } else if (direction === 'up') {
            components[idx] = { ...components[idx], z: (components[idx].z || 0) + 1 };
        } else if (direction === 'down') {
            components[idx] = { ...components[idx], z: (components[idx].z || 0) - 1 };
        }
        setConfigData({ ...configData, components });
    };

    const alignSelected = (type: 'h-center' | 'v-center') => {
        if (!selectedBlockId) return;
        saveHistory();
        const canvasW = 575;
        const canvasH = configData.canvas?.height || 2000;

        let updates: any = {};
        if (type === 'h-center') {
            updates.x = (canvasW - selectedNode.w) / 2;
        } else if (type === 'v-center') {
            updates.y = (canvasH - selectedNode.h) / 2;
        }
        updateSelected(updates);
    };

    // Canvas Dragging + Resize Handlers
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState<string | null>(null); // nw|n|ne|e|se|s|sw|w
    const [elementResizeStart, setElementResizeStart] = useState({ x: 0, y: 0, w: 0, h: 0 });

    const handlePointerDown = (e: React.PointerEvent, comp: any) => {
        e.stopPropagation();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
        saveHistory();
        setSelectedBlockId(comp.id);
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setElementStartPos({ x: comp.x, y: comp.y });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handleResizeStart = (e: React.PointerEvent, handle: string, comp: any) => {
        e.stopPropagation();
        e.preventDefault();
        saveHistory();
        setIsResizing(true);
        setResizeHandle(handle);
        setDragStart({ x: e.clientX, y: e.clientY });
        setElementResizeStart({ x: comp.x, y: comp.y, w: comp.w, h: comp.h });
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (isResizing && selectedBlockId && resizeHandle) {
            let dx = (e.clientX - dragStart.x) / canvasScale;
            let dy = (e.clientY - dragStart.y) / canvasScale;
            if (configData.canvas?.snapping) { dx = Math.round(dx / 10) * 10; dy = Math.round(dy / 10) * 10; }

            const MIN = 20;
            let { x, y, w, h } = elementResizeStart;

            if (resizeHandle.includes('e')) w = Math.max(MIN, w + dx);
            if (resizeHandle.includes('s')) h = Math.max(MIN, h + dy);
            if (resizeHandle.includes('w')) { const newW = Math.max(MIN, w - dx); x = x + (w - newW); w = newW; }
            if (resizeHandle.includes('n')) { const newH = Math.max(MIN, h - dy); y = y + (h - newH); h = newH; }

            setConfigData({
                ...configData,
                components: updateNode(configData.components, selectedBlockId, { x, y, w, h })
            });
            return;
        }
        if (!isDragging || !selectedBlockId) return;
        let dx = (e.clientX - dragStart.x) / canvasScale;
        let dy = (e.clientY - dragStart.y) / canvasScale;
        if (configData.canvas?.snapping) { dx = Math.round(dx / 10) * 10; dy = Math.round(dy / 10) * 10; }
        setDragOffset({ x: dx, y: dy });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        if (isResizing) {
            setIsResizing(false);
            setResizeHandle(null);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            return;
        }
        if (isDragging && selectedBlockId) {
            const newX = elementStartPos.x + dragOffset.x;
            const newY = elementStartPos.y + dragOffset.y;
            setConfigData({
                ...configData,
                components: updateNode(configData.components, selectedBlockId, { x: newX, y: newY })
            });
        }
        setIsDragging(false);
        setDragOffset({ x: 0, y: 0 });
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    };

    // --- Native Drag & Drop from Sidebar ---
    const handleDragStart = (e: React.DragEvent, type: string, presetProps: any = {}) => {
        e.dataTransfer.setData("miu_type", type);
        e.dataTransfer.setData("miu_props", JSON.stringify(presetProps));
        e.dataTransfer.effectAllowed = "copy";
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData("miu_type");
        const props = JSON.parse(e.dataTransfer.getData("miu_props") || "{}");

        if (!type || !canvasRef.current) return;

        const rect = canvasRef.current.getBoundingClientRect();
        let targetX = (e.clientX - rect.left) / canvasScale;
        let targetY = (e.clientY - rect.top) / canvasScale;

        // Snap to grid if enabled
        if (configData.canvas?.snapping) {
            targetX = Math.round(targetX / 10) * 10;
            targetY = Math.round(targetY / 10) * 10;
        }

        addComponent(type, { ...props, x: targetX, y: targetY });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    if (loading) return null;


    return (
        <div className="h-screen flex flex-col font-sans bg-[#FBFBFB] text-[#1D1D1F] overflow-hidden">
            {/* --- TOPBAR --- */}
            <header className="h-[56px] bg-white border-b border-[#E5E5E5] flex items-center justify-between px-4 z-[100] sticky top-0">
                <div className="flex items-center gap-3">
                    <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition-colors group">
                        <X size={20} className="text-gray-400 group-hover:text-gray-600" />
                    </Link>
                    <div className="w-px h-6 bg-gray-200" />
                    <div className="flex flex-col">
                        <h1 className="text-[13px] font-bold leading-none mb-1">Mielove Wedding Builder</h1>
                        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{weddingConfig?.slug}</span>
                    </div>
                    {saving ? (
                        <div className="ml-4 flex items-center gap-2 text-[11px] text-gray-400">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            Đang lưu...
                        </div>
                    ) : lastSaved ? (
                        <div className="ml-4 flex items-center gap-2 text-[11px] text-green-500">
                            <Check size={12} />
                            Đã lưu {lastSaved.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'})}
                        </div>
                    ) : null}
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-[#F5F5F7] rounded-lg p-1 mr-2">
                        <button onClick={undo} disabled={history.length === 0} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-500 disabled:opacity-30"><Undo size={16} /></button>
                        <button onClick={redo} disabled={redoStack.length === 0} className="p-1.5 hover:bg-white hover:shadow-sm rounded transition-all text-gray-500 disabled:opacity-30"><Redo size={16} /></button>
                    </div>

                    <div className="w-px h-6 bg-gray-200 mx-1" />

                    <div className="flex items-center gap-2 ml-2">
                        <button
                            onClick={handlePreview}
                            className="h-9 px-4 flex items-center gap-2 text-[13px] font-semibold text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-lg transition-all"
                        >
                            <Eye size={16} /> Xem thử
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="h-9 px-6 flex items-center gap-2 text-[13px] font-bold text-white bg-[#0071E3] hover:bg-[#0077ED] rounded-lg shadow-sm transition-all disabled:opacity-50"
                        >
                            <Save size={16} /> {saving ? "Đang lưu..." : "Lưu & Xuất bản"}
                        </button>
                    </div>

                    <button className="ml-2 w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all">
                        <LifeBuoy size={18} />
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* --- SIDEBAR STAGE 1: ICONS --- */}
                <aside className="w-[72px] bg-[#1E1E1E] flex flex-col items-center py-4 z-[90]">
                    {[
                        { id: "templates", label: "Mẫu", icon: LayoutGrid },
                        { id: "text", label: "Chữ", icon: Type },
                        { id: "image", label: "Ảnh", icon: ImageIcon },
                        { id: "deco", label: "Trang trí", icon: Frame },
                        { id: "shapes", label: "T.Phần", icon: BoxSelect },
                        { id: "widgets", label: "T.Ích", icon: Sparkles },
                        { id: "music", label: "Nhạc", icon: Music },
                        { id: "settings", label: "C.Đặt", icon: Settings },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                if (activeTab === tab.id) setSidebarOpen(!sidebarOpen);
                                else { setActiveTab(tab.id); setSidebarOpen(true); }
                            }}
                            className={`w-full py-4 flex flex-col items-center gap-1.5 transition-all group relative ${activeTab === tab.id && sidebarOpen ? "text-[#0071E3]" : "text-gray-400 hover:text-white"}`}
                        >
                            {activeTab === tab.id && sidebarOpen && (
                                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-8 bg-[#0071E3] rounded-r-full" />
                            )}
                            <tab.icon size={22} className="transition-transform group-active:scale-90" />
                            <span className="text-[10px] font-bold tracking-tight">{tab.label}</span>
                        </button>
                    ))}
                </aside>

                {/* --- SIDEBAR STAGE 2: PANEL --- */}
                <motion.aside
                    initial={false}
                    animate={{ width: sidebarOpen ? 320 : 0, opacity: sidebarOpen ? 1 : 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="bg-white border-r border-[#E5E5E5] flex flex-col z-[80] overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.02)]"
                >
                    <div className="w-[320px] flex flex-col h-full">
                        <div className="h-[56px] px-6 flex items-center justify-between border-b border-gray-50 bg-white sticky top-0 z-10">
                            <h2 className="text-[15px] font-bold text-[#1D1D1F]">
                                {activeTab === 'templates' && "Kho giao diện Premium"}
                                {activeTab === 'text' && "Thêm văn bản"}
                                {activeTab === 'image' && "Thư viện hình ảnh"}
                                {activeTab === 'shapes' && "Thành phần trang trí"}
                                {activeTab === 'widgets' && "Tiện ích tương tác"}
                                {activeTab === 'music' && "Nhạc nền & Audio"}
                                {activeTab === 'settings' && "Cấu hình Canvas"}
                            </h2>
                            <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                                <ChevronDown className="rotate-90" size={18} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {activeTab === 'templates' && (
                                <div className="space-y-6">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Giao diện hệ thống</p>
                                    <div className="grid grid-cols-1 gap-4">
                                        {templates.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => applyTemplate(t)}
                                                className="group relative w-full aspect-[4/5] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 hover:border-[#0071E3] transition-all text-left"
                                            >
                                                <div className="absolute inset-0 bg-cover bg-center transition-transform group-hover:scale-105" style={{ backgroundImage: `url(${t.thumbnail_url || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500'})` }} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                    <span className="text-white text-xs font-bold">{t.name}</span>
                                                    <span className="text-white/60 text-[10px]">Nhấn để áp dụng</span>
                                                </div>
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur rounded text-[9px] font-bold uppercase tracking-tight text-[#1D1D1F]">
                                                    Premium
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'text' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tiêu đề & Nội dung</p>
                                        <button
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'text', { text: "Thanh Sơn & Diệu Nhi", fontSize: 42, color: "#6d0208", fontWeight: "bold" })}
                                            onClick={() => addComponent('text', { text: "Thanh Sơn & Diệu Nhi", fontSize: 42, color: "#6d0208", fontWeight: "bold" })}
                                            className="w-full py-4 px-4 bg-[#F5F5F7] hover:bg-[#E8E8ED] rounded-xl text-left transition-all group cursor-grab"
                                        >
                                            <span className="block text-xl font-bold mb-1 text-[#1D1D1F]">Thêm tiêu đề lớn</span>
                                            <span className="text-[10px] text-gray-400">Dùng cho tên cô dâu chú rể</span>
                                        </button>
                                        <button onClick={() => addComponent('text', { text: "21.12.2026", fontSize: 24, color: "#333", fontWeight: "normal" })} className="w-full py-3 px-4 bg-white border border-[#E5E5E5] hover:border-[#0071E3] rounded-xl text-left transition-all">
                                            <span className="block text-md font-bold mb-1">Thêm tiêu đề phụ</span>
                                            <span className="text-[10px] text-gray-400">Dùng cho ngày tháng</span>
                                        </button>
                                        <button onClick={() => addComponent('text', { text: "Trân trọng kính mời quý khách tới dự bữa cơm thân mật...", fontSize: 16, color: "#666" })} className="w-full py-2 px-4 bg-white border border-[#E5E5E5] hover:border-[#0071E3] rounded-xl text-left transition-all">
                                            <span className="block text-sm font-medium mb-1">Nội dung văn bản</span>
                                            <span className="text-[10px] text-gray-400">Đoạn văn ngắn</span>
                                        </button>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">Phong cách chữ viết</p>
                                        <div className="grid grid-cols-1 gap-2">
                                            {[
                                                { name: "Lora Elegant", font: "'Lora', serif" },
                                                { name: "Dancing Script", font: "'Dancing Script', cursive" },
                                                { name: "High Spirited", font: "'High Spirited', cursive" },
                                            ].map(f => (
                                                <button
                                                    key={f.name}
                                                    onClick={() => addComponent('text', { text: f.name, fontFamily: f.font, fontSize: 32 })}
                                                    className="w-full h-14 bg-gray-50 rounded-xl flex items-center px-4 hover:bg-white border border-transparent hover:border-gray-200 transition-all font-medium text-lg"
                                                    style={{ fontFamily: f.font }}
                                                >
                                                    {f.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'image' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tải lên</p>
                                        {/* Hidden real file input */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleImageUpload}
                                        />
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingImage}
                                            className="w-full aspect-[4/3] rounded-2xl bg-[#0071E3]/5 border-2 border-dashed border-[#0071E3]/30 flex flex-col items-center justify-center p-4 hover:bg-[#0071E3]/10 transition-colors cursor-pointer group disabled:opacity-60"
                                        >
                                            {uploadingImage ? (
                                                <>
                                                    <div className="w-8 h-8 border-2 border-[#0071E3] border-t-transparent rounded-full animate-spin mb-3" />
                                                    <span className="text-[12px] font-bold text-[#0071E3]">Đang tải lên...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                        <Plus className="text-[#0071E3]" size={24} />
                                                    </div>
                                                    <span className="text-[13px] font-bold text-[#0071E3]">Tải ảnh của bạn</span>
                                                    <span className="text-[10px] text-gray-400 mt-1">JPG, PNG, WebP — tối đa 10MB</span>
                                                </>
                                            )}
                                        </button>
                                        {/* Uploaded images thumbnail strip */}
                                        {uploadedImages.length > 0 && (
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Đã tải lên</p>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {uploadedImages.map((url, i) => (
                                                        <div
                                                            key={i}
                                                            onClick={() => addComponent('image', { src: url, objectFit: 'cover' })}
                                                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:ring-2 ring-[#0071E3] transition-all"
                                                        >
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Vật liệu trang trí</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                { name: "Gold Seal", src: "/royal_gold_seal_seal_3d_leaf_ornament_1776074127754.png" },
                                                { name: "Floral Border", src: "/watercolor_floral_border_bottom_pink_gold_1776068691977.png" },
                                                { name: "Gold Foil", src: "/gold_foil_ornament_pattern_1776068623512.png" },
                                                { name: "Paper Texture", src: "/luxury_paper_texture_bg_1776068600711.png" },
                                            ].map((img, i) => (
                                                <div
                                                    key={i}
                                                    onClick={() => addComponent('image', { src: img.src, objectFit: 'contain' })}
                                                    className="aspect-square bg-gray-50 rounded-xl hover:ring-2 ring-[#0071E3] transition-all cursor-pointer p-2 flex items-center justify-center overflow-hidden"
                                                >
                                                    <img src={img.src} className="max-w-full max-h-full object-contain" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'deco' && (
                                <div className="space-y-6">
                                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Họa tiết Reference 53</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { name: "Khung hoa", src: "/templates/t53/0ba81df5f7cf42dbb92001e7d16c6e1c.webp" },
                                            { name: "Viền hoa", src: "/templates/t53/05e40de8c6e54e85908ffb9c36d68055.webp" },
                                            { name: "Họa tiết góc", src: "/templates/t53/1b24bc8d-f035-4e89-a729-af265b89f3a5.webp" },
                                            { name: "Lá vàng", src: "/templates/t53/09hzg5sl8k4b8dv10hw0cv.webp" },
                                            { name: "Hoa trang trí", src: "/templates/t53/12bjnnmx72gchybfms0q28u.webp" },
                                            { name: "Dây nơ", src: "/templates/t53/0bo01zl1e7yqdid9c20exbv.webp" },
                                        ].map((img, i) => (
                                            <div
                                                key={i}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, 'image', { src: img.src, objectFit: 'contain', w: 200, h: 200 })}
                                                onClick={() => addComponent('image', { src: img.src, objectFit: 'contain', w: 200, h: 200 })}
                                                className="aspect-square bg-white border border-gray-100 rounded-xl hover:border-[#0071E3] transition-all cursor-grab p-2 flex items-center justify-center overflow-hidden"
                                            >
                                                <img src={img.src} className="max-w-full max-h-full object-contain" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-400 italic mt-2">Kéo hoặc nhấn để thêm các họa tiết chuẩn phong cách Mẫu 53 vào thiệp.</p>
                                </div>
                            )}

                            {activeTab === 'shapes' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Hình khối cơ bản</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            <button onClick={() => addComponent('shape', { fill: '#F5F5F7' })} className="aspect-square bg-gray-50 hover:bg-white border hover:border-[#0071E3] rounded-xl flex items-center justify-center transition-all group">
                                                <BoxSelect size={24} className="text-gray-400 group-hover:text-[#0071E3]" />
                                            </button>
                                            <button onClick={() => addComponent('shape', { fill: '#0071E3', borderRadius: 999 })} className="aspect-square bg-gray-50 hover:bg-white border hover:border-[#0071E3] rounded-xl flex items-center justify-center transition-all group">
                                                <div className="w-6 h-6 rounded-full border-2 border-gray-400 group-hover:border-[#0071E3]" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Khung ảnh (Frames)</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => addComponent('shape', { fill: 'transparent', borderRadius: 20, style: { border: '4px solid #D19D5A' } })} className="aspect-[3/4] border-4 border-stone-200 hover:border-[#0071E3] rounded-xl transition-all" />
                                            <button onClick={() => addComponent('shape', { fill: 'rgba(255,255,255,0.1)', style: { backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' } })} className="aspect-[3/4] bg-gray-100/50 rounded-xl border hover:border-[#0071E3] transition-all" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'widgets' && (
                                <div className="space-y-4">
                                    <div className="pt-4 pb-2">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tiện ích cơ bản</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <button 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'countdown')}
                                            onClick={() => addComponent('countdown')} 
                                            className="w-full group"
                                        >
                                            <div className="h-24 bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover:border-[#0071E3] group-hover:bg-[#0071E3]/5 transition-all">
                                                <div className="flex gap-1.5">
                                                    <div className="w-7 h-7 bg-gray-50 rounded flex items-center justify-center font-bold text-[10px]">12</div>
                                                    <div className="w-7 h-7 bg-gray-50 rounded flex items-center justify-center font-bold text-[10px]">08</div>
                                                    <div className="w-7 h-7 bg-gray-50 rounded flex items-center justify-center font-bold text-[10px]">45</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Đếm ngược</span>
                                            </div>
                                        </button>

                                        <button 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'calendar')}
                                            onClick={() => addComponent('calendar')} 
                                            className="w-full group"
                                        >
                                            <div className="h-24 bg-white border border-gray-100 rounded-2xl p-3 flex flex-col justify-center group-hover:border-[#0071E3] transition-all">
                                                <div className="text-[10px] font-bold text-[#de7b9e] mb-1">DEC 2026</div>
                                                <div className="grid grid-cols-7 gap-0.5 text-[6px] opacity-20">
                                                    {[...Array(21)].map((_, i) => <div key={i} className="aspect-square bg-gray-400 rounded-full" />)}
                                                </div>
                                                <div className="mt-1 text-[10px] font-bold text-gray-400">Lịch cưới</div>
                                            </div>
                                        </button>

                                        <button 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'button', { text: "Mở Bản đồ", action: "map" })}
                                            onClick={() => addComponent('button', { text: "Mở Bản đồ", action: "map" })} 
                                            className="w-full group"
                                        >
                                            <div className="h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-all">
                                                <MapPin size={14} />
                                                <span className="text-[11px] font-bold">Nút bản đồ</span>
                                            </div>
                                        </button>
                                    </div>

                                    <div className="pt-6 pb-2">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nội dung Premium</p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 pb-8">
                                        <button 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'event_card')}
                                            onClick={() => addComponent('event_card')} 
                                            className="w-full group"
                                        >
                                            <div className="h-20 bg-white border border-gray-100 rounded-2xl flex items-center px-4 gap-4 group-hover:border-[#0071E3] transition-all">
                                                <div className="w-10 h-10 bg-[#fdecd8] rounded-full flex items-center justify-center text-[#8d5f25]"><Calendar size={20} /></div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-bold">Thẻ sự kiện</p>
                                                    <p className="text-[10px] text-gray-400">Lễ Thành Hôn / Vu Quy</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'quote')}
                                            onClick={() => addComponent('quote')} 
                                            className="w-full group"
                                        >
                                            <div className="h-20 bg-white border border-gray-100 rounded-2xl flex items-center px-4 gap-4 group-hover:border-[#0071E3] transition-all">
                                                <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400"><Type size={20} /></div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-bold">Trích dẫn</p>
                                                    <p className="text-[10px] text-gray-400">Lời hay ý đẹp</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'bank')}
                                            onClick={() => addComponent('bank')} 
                                            className="w-full group"
                                        >
                                            <div className="h-20 bg-white border border-gray-100 rounded-2xl flex items-center px-4 gap-4 group-hover:border-[#0071E3] transition-all">
                                                <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600"><Square size={20} /></div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-bold">Hộp quà mừng</p>
                                                    <p className="text-[10px] text-gray-400">QR Code & Tài khoản</p>
                                                </div>
                                            </div>
                                        </button>

                                        <button 
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, 'timeline')}
                                            onClick={() => addComponent('timeline')} 
                                            className="w-full group"
                                        >
                                            <div className="h-20 bg-white border border-gray-100 rounded-2xl flex items-center px-4 gap-4 group-hover:border-[#0071E3] transition-all">
                                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Clock size={20} /></div>
                                                <div className="text-left">
                                                    <p className="text-[11px] font-bold">Lịch trình</p>
                                                    <p className="text-[10px] text-gray-400">Timeline đám cưới</p>
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'music' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Cấu hình nhạc nền</p>
                                        <div className="p-4 bg-gray-50 rounded-2xl space-y-4">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-[#0071E3]">
                                                    <Music size={18} />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-[13px] font-bold">Background Music</p>
                                                    <p className="text-[10px] text-gray-400">Định dạng MP3 trực tiếp</p>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">URL file nhạc (.mp3)</label>
                                                <input
                                                    type="text"
                                                    placeholder="https://example.com/song.mp3"
                                                    value={weddingConfig?.music_url || ''}
                                                    onChange={e => setWeddingConfig({ ...weddingConfig, music_url: e.target.value })}
                                                    className="w-full h-10 px-3 bg-white border border-gray-100 rounded-lg text-[11px] font-mono"
                                                />
                                            </div>
                                            {weddingConfig?.music_url && (
                                                <audio controls className="w-full h-8 scale-90 origin-left" src={weddingConfig.music_url} />
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl">
                                        <p className="text-[11px] text-blue-600 font-medium leading-relaxed italic">
                                            "Một bản nhạc du dương sẽ làm cho buổi lễ của bạn trở nên cảm xúc và khó quên hơn. Khuyên dùng các bản nhạc không lời."
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Hỗ trợ căn chỉnh</p>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <span className="text-[13px] font-bold">Hút nam châm (Snapping)</span>
                                            <button
                                                onClick={() => setConfigData({ ...configData, canvas: { ...configData.canvas, snapping: !configData.canvas?.snapping } })}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${configData.canvas?.snapping ? 'bg-[#0071E3]' : 'bg-gray-200'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${configData.canvas?.snapping ? 'left-7' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mừng cưới Nhà Trai (Groom)</p>
                                        <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                            <input type="text" placeholder="Link QR Nhà Trai..." value={configData.groom_bank?.qr || ''} onChange={e => setConfigData({ ...configData, groom_bank: { ...configData.groom_bank, qr: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                            <input type="text" placeholder="Số tài khoản..." value={configData.groom_bank?.account || ''} onChange={e => setConfigData({ ...configData, groom_bank: { ...configData.groom_bank, account: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                            <input type="text" placeholder="Tên chủ TK..." value={configData.groom_bank?.name || ''} onChange={e => setConfigData({ ...configData, groom_bank: { ...configData.groom_bank, name: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                            <input type="text" placeholder="Tên Ngân hàng..." value={configData.groom_bank?.bank || ''} onChange={e => setConfigData({ ...configData, groom_bank: { ...configData.groom_bank, bank: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                        </div>
                                        
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mừng cưới Nhà Gái (Bride)</p>
                                        <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                                            <input type="text" placeholder="Link QR Nhà Gái..." value={configData.bride_bank?.qr || ''} onChange={e => setConfigData({ ...configData, bride_bank: { ...configData.bride_bank, qr: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                            <input type="text" placeholder="Số tài khoản..." value={configData.bride_bank?.account || ''} onChange={e => setConfigData({ ...configData, bride_bank: { ...configData.bride_bank, account: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                            <input type="text" placeholder="Tên chủ TK..." value={configData.bride_bank?.name || ''} onChange={e => setConfigData({ ...configData, bride_bank: { ...configData.bride_bank, name: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                            <input type="text" placeholder="Tên Ngân hàng..." value={configData.bride_bank?.bank || ''} onChange={e => setConfigData({ ...configData, bride_bank: { ...configData.bride_bank, bank: e.target.value } })} className="w-full h-9 px-3 bg-white border border-gray-100 rounded-lg text-[11px]" />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Kích thước Canvas</p>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-gray-500 ml-1">Rộng (px)</label>
                                                <input type="number" value={configData.canvas?.width || 575} onChange={e => setConfigData({ ...configData, canvas: { ...configData.canvas, width: parseInt(e.target.value) } })} className="w-full h-10 px-3 bg-gray-50 border-none rounded-lg text-sm font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[11px] font-medium text-gray-500 ml-1">Cao (px)</label>
                                                <input type="number" value={configData.canvas?.height || 2000} onChange={e => setConfigData({ ...configData, canvas: { ...configData.canvas, height: parseInt(e.target.value) } })} className="w-full h-10 px-3 bg-gray-50 border-none rounded-lg text-sm font-bold" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Màu nền thiệp</p>
                                        <div className="flex gap-4">
                                            <input type="color" value={configData.canvas?.backgroundColor || '#ffffff'} onChange={e => setConfigData({ ...configData, canvas: { ...configData.canvas, backgroundColor: e.target.value } })} className="w-12 h-12 rounded-xl border-none p-1 shadow-sm shrink-0" />
                                            <div className="flex-1">
                                                <input type="text" value={configData.canvas?.backgroundColor || '#ffffff'} onChange={e => setConfigData({ ...configData, canvas: { ...configData.canvas, backgroundColor: e.target.value } })} className="w-full h-12 px-4 bg-gray-50 border-none rounded-xl text-sm font-mono font-bold" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.aside>

                {/* --- MAIN WORKSPACE --- */}
                <main className="flex-1 bg-[#F5F5F7] overflow-hidden relative flex flex-col items-center">
                    {/* Workspace Toolbar (Zoom, etc.) */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[50] flex items-center bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-full px-4 py-2 gap-4">
                        <button onClick={() => setCanvasScale(Math.max(0.1, canvasScale - 0.1))} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"><Plus className="rotate-45" size={16} /></button>
                        <span className="text-[12px] font-bold text-gray-600 min-w-[40px] text-center">{Math.round(canvasScale * 100)}%</span>
                        <button onClick={() => setCanvasScale(Math.min(2, canvasScale + 0.1))} className="p-1 hover:bg-gray-100 rounded text-gray-500 transition-colors"><Plus size={16} /></button>
                        <div className="w-px h-4 bg-gray-200 mx-1" />
                        <button onClick={() => {
                            const parentW = canvasRef.current?.parentElement?.clientWidth || 800;
                            setCanvasScale(Math.min((parentW - 80) / 575, 1));
                        }} className="text-[12px] font-bold text-[#0071E3] hover:underline">Vừa khung</button>
                    </div>

                    {/* Floating Section Navigator */}
                    <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[100] flex flex-col gap-3 p-3 bg-white/20 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => scrollToSection(section.y)}
                                title={section.label}
                                className="group relative flex items-center justify-end"
                            >
                                <div className="absolute right-full mr-4 px-3 py-1.5 bg-gray-900/90 backdrop-blur text-white text-[11px] font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 pointer-events-none whitespace-nowrap shadow-xl">
                                    {section.label}
                                </div>
                                <div className="w-2.5 h-2.5 rounded-full border-2 border-[#0071E3]/30 group-hover:bg-[#0071E3] group-hover:border-[#0071E3] group-hover:scale-125 transition-all shadow-sm" />
                            </button>
                        ))}
                    </div>

                    {/* Canvas Scroller */}
                    <div
                        ref={viewportRef}
                        className="w-full h-full overflow-auto flex justify-center py-20 px-8 relative custom-scrollbar bg-[#1E1E1E] builder-viewport"
                        onPointerDown={(e) => {
                            if (e.target === e.currentTarget) setSelectedBlockId(null);
                        }}
                        style={{
                            backgroundImage: `radial-gradient(rgba(255,255,255,0.03) 1.5px, transparent 0)`,
                            backgroundSize: '32px 32px'
                        }}
                    >
                        <div
                            ref={canvasRef}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            style={{
                                width: ((configData.canvas?.width || 575) * canvasScale) + "px",
                                height: ((configData.canvas?.height || 2000) * canvasScale) + "px",
                                position: "relative"
                            }}
                        >
                            <div
                                className="relative bg-white shadow-2xl transition-all duration-500 overflow-hidden"
                                style={{
                                    width: 575,
                                    height: configData.canvas?.height || 3000,
                                    backgroundColor: configData.canvas?.backgroundColor || '#FFFFFF',
                                    transform: `scale(${canvasScale})`,
                                    transformOrigin: "top left",
                                    position: "absolute",
                                    boxShadow: "0 30px 100px rgba(0,0,0,0.5)",
                                    transition: "height 0.2s"
                                }}
                                onPointerDown={(e) => {
                                    if (e.target === e.currentTarget) setSelectedBlockId(null);
                                }}
                            >
                                {/* Texture Overlay */}
                                {configData.canvas?.texture && (
                                    <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-multiply" style={{ backgroundImage: configData.canvas.texture }} />
                                )}

                                {/* Active Selection Frame */}
                                {selectedNode && (
                                    <div
                                        style={{
                                            position: "absolute", left: selectedNode.x - 2, top: selectedNode.y - 2, width: selectedNode.w + 4, height: selectedNode.h + 4,
                                            border: "2px solid #0071E3", zIndex: 99999, pointerEvents: "none",
                                            transform: `rotate(${selectedNode.rotation || 0}deg)`
                                        }}
                                    >
                                        <div className="absolute -top-7 left-[-2px] bg-[#0071E3] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                                            {selectedNode.type.replace('element_', '').toUpperCase()}
                                        </div>
                                        {/* Resize Handles */}
                                        <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#0071E3] rounded-full" />
                                        <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#0071E3] rounded-full" />
                                        <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-[#0071E3] rounded-full" />
                                        <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-[#0071E3] rounded-full" />

                                        {/* Delete Button on frame */}
                                        <button
                                            onPointerDown={(e) => {
                                                e.stopPropagation();
                                                setConfigData({ ...configData, components: deleteNode(configData.components, selectedBlockId || "") });
                                                setSelectedBlockId(null);
                                            }}
                                            className="absolute -top-4 -right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg pointer-events-auto hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                )}

                                {/* Elements Layer */}
                                {configData.components.map((comp: any) => (
                                    <CanvasNode
                                        key={comp.id}
                                        comp={comp}
                                        isSelected={selectedBlockId === comp.id}
                                        isDraggingActual={isDragging && selectedBlockId === comp.id}
                                        dragOffset={dragOffset}
                                        onPointerDown={handlePointerDown}
                                        onPointerMove={handlePointerMove}
                                        onPointerUp={handlePointerUp}
                                        onResizeStart={handleResizeStart}
                                        replacePlaceholders={replacePlaceholders}
                                        selectedBlockId={selectedBlockId}
                                        isDragging={isDragging}
                                        weddingConfig={weddingConfig}
                                    />
                                ))}

                                {/* Floating Selection Toolbar */}
                                <AnimatePresence>
                                    {selectedNode && !isDragging && (
                                        <>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                className="absolute bg-stone-900 text-white rounded-full px-4 py-2 flex items-center gap-4 shadow-2xl z-[100000] border border-white/10"
                                                style={{
                                                    left: selectedNode.x + (selectedNode.w / 2),
                                                    top: selectedNode.y - 70,
                                                    transform: 'translateX(-50%)'
                                                }}
                                            >
                                                <button 
                                                    onClick={() => setShowFloatingEditor(!showFloatingEditor)} 
                                                    className={`p-1.5 rounded-full transition-all ${showFloatingEditor ? 'bg-[#0071E3] text-white' : 'hover:bg-white/20'}`}
                                                    title="Sửa nội dung nhanh"
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                                <div className="w-px h-4 bg-white/20" />
                                                <button onClick={duplicateSelected} title="Nhân bản (Ctrl+D)" className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><Copy size={16} /></button>
                                                <div className="w-px h-4 bg-white/20" />
                                                <button onClick={() => alignSelected('h-center')} title="Căn giữa ngang" className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><BoxSelect size={16} /></button>
                                                <div className="w-px h-4 bg-white/20" />
                                                <button onClick={() => moveZIndex('up')} title="Lên trên" className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><ChevronDown className="rotate-180" size={16} /></button>
                                                <button onClick={() => moveZIndex('down')} title="Xuống dưới" className="p-1.5 hover:bg-white/20 rounded-full transition-colors"><ChevronDown size={16} /></button>
                                                <div className="w-px h-4 bg-white/20" />
                                                <button
                                                    onClick={() => {
                                                        saveHistory();
                                                        setConfigData({ ...configData, components: deleteNode(configData.components, selectedBlockId || "") });
                                                        setSelectedBlockId(null);
                                                    }}
                                                    title="Xoá (Delete)"
                                                    className="p-1.5 hover:bg-red-500 rounded-full transition-colors"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </motion.div>

                                            {/* Contextual Floating Editor */}
                                            {showFloatingEditor && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="absolute z-[100001] bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-5 w-[280px]"
                                                    style={{
                                                        left: selectedNode.x + selectedNode.w + 20,
                                                        top: selectedNode.y,
                                                    }}
                                                >
                                                    <div className="flex items-center justify-between mb-4">
                                                        <h3 className="text-[12px] font-black text-[#0071E3] uppercase tracking-widest">{selectedNode.type.replace('element_', '')}</h3>
                                                        <button onClick={() => setShowFloatingEditor(false)} className="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"><X size={14} /></button>
                                                    </div>
                                                    
                                                    <div className="space-y-4">
                                                        {selectedNode.type === 'element_text' && (
                                                            <textarea 
                                                                rows={3}
                                                                value={selectedNode.props.text || ''} 
                                                                onChange={e => updateSelected({ props: { text: e.target.value } })} 
                                                                className="w-full p-3 bg-gray-50 border-none rounded-xl text-[12px] font-medium resize-none focus:ring-1 ring-blue-500"
                                                            />
                                                        )}
                                                        {selectedNode.type === 'element_image' && (
                                                            <div className="space-y-1">
                                                                <label className="text-[9px] font-bold text-gray-400 uppercase">URL Hình ảnh</label>
                                                                <input 
                                                                    type="text" 
                                                                    value={selectedNode.props.src || ''} 
                                                                    onChange={e => updateSelected({ props: { src: e.target.value } })} 
                                                                    className="w-full h-9 px-3 bg-gray-50 border-none rounded-lg text-[10px] font-mono"
                                                                />
                                                            </div>
                                                        )}
                                                        {selectedNode.type === 'element_bank' && (
                                                            <div className="space-y-3">
                                                                <div className="space-y-1">
                                                                    <label className="text-[9px] font-bold text-gray-400 uppercase">Ngân hàng</label>
                                                                    <input type="text" value={selectedNode.props.bank_name || ''} onChange={e => updateSelected({ props: { bank_name: e.target.value } })} className="w-full h-8 px-3 bg-gray-50 border-none rounded-lg text-[11px] font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[9px] font-bold text-gray-400 uppercase">Số tài khoản</label>
                                                                    <input type="text" value={selectedNode.props.bank_account || ''} onChange={e => updateSelected({ props: { bank_account: e.target.value } })} className="w-full h-8 px-3 bg-gray-50 border-none rounded-lg text-[11px] font-bold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <label className="text-[9px] font-bold text-gray-400 uppercase">Chủ tài khoản</label>
                                                                    <input type="text" value={selectedNode.props.bank_account_name || ''} onChange={e => updateSelected({ props: { bank_account_name: e.target.value } })} className="w-full h-8 px-3 bg-gray-50 border-none rounded-lg text-[11px] font-bold" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <div className="pt-2 italic text-[9px] text-gray-400">
                                                            * Chỉnh sửa chi tiết hơn ở thanh bên phải.
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </main>

                {/* --- RIGHT PANEL: INSPECTOR --- */}
                <aside
                    className={`bg-white border-l border-[#E5E5E5] flex flex-col z-[90] transition-all duration-300 ${selectedBlockId ? 'w-[320px]' : 'w-0 opacity-0 overflow-hidden'}`}
                >
                    <div className="w-[320px] flex flex-col h-full overflow-hidden">
                        <div className="h-[56px] px-6 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white">
                            <h2 className="text-[13px] font-bold text-[#1D1D1F] uppercase tracking-widest">Tùy chỉnh đối tượng</h2>
                            <button onClick={() => setSelectedBlockId(null)} className="p-1 hover:bg-gray-100 rounded text-gray-400">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                            {selectedNode ? (
                                <>
                                    {/* Position & Size */}
                                    <div className="space-y-4">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Vị trí & Kích thước</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">Vị trí X</label>
                                                <input type="number" value={selectedNode.x} onChange={e => updateSelected({ x: parseInt(e.target.value) })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">Vị trí Y</label>
                                                <input type="number" value={selectedNode.y} onChange={e => updateSelected({ y: parseInt(e.target.value) })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">Chiều rộng</label>
                                                <input type="number" value={selectedNode.w} onChange={e => updateSelected({ w: parseInt(e.target.value) })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">Xoay (độ)</label>
                                                <input type="number" value={selectedNode.rotation || 0} onChange={e => updateSelected({ rotation: parseInt(e.target.value) })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[10px] font-medium text-gray-500 ml-1">Chiều cao</label>
                                                <input type="number" onFocus={saveHistory} value={Math.round(selectedNode.h)} onChange={e => updateSelected({ h: parseInt(e.target.value) })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                            </div>
                                        </div>
                                        <div className="space-y-3 pt-2">
                                            <div className="flex justify-between items-center text-[11px] font-medium">
                                                <span className="text-gray-500">Góc xoay</span>
                                                <span className="text-[#0071E3] font-bold">{selectedNode.rotation || 0}°</span>
                                            </div>
                                            <input
                                                type="range" min="-180" max="180"
                                                onMouseDown={saveHistory}
                                                value={selectedNode.rotation || 0}
                                                onChange={e => updateSelected({ rotation: parseInt(e.target.value) })}
                                                className="w-full accent-[#0071E3]"
                                            />
                                        </div>

                                        <div className="pt-2">
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">Thứ tự lớp (Layer)</p>
                                            <div className="grid grid-cols-4 gap-2">
                                                <button onClick={() => moveZIndex('back')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] font-bold border border-transparent hover:border-gray-200 transition-all">Back</button>
                                                <button onClick={() => moveZIndex('down')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] font-bold border border-transparent hover:border-gray-200 transition-all">Down</button>
                                                <button onClick={() => moveZIndex('up')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] font-bold border border-transparent hover:border-gray-200 transition-all">Up</button>
                                                <button onClick={() => moveZIndex('front')} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-[10px] font-bold border border-transparent hover:border-gray-200 transition-all">Front</button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={duplicateSelected}
                                            className="w-full py-2.5 mt-2 bg-stone-900 text-white text-[11px] font-bold rounded-xl hover:bg-black transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <Copy size={14} /> Nhân bản đối tượng
                                        </button>
                                    </div>

                                    {/* Content Specifics */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nội dung chi tiết</p>

                                        {selectedNode.type === 'element_text' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Văn bản</label>
                                                    <textarea
                                                        rows={3}
                                                        onFocus={saveHistory}
                                                        value={selectedNode.props.text}
                                                        onChange={e => updateSelected({ props: { text: e.target.value } })}
                                                        className="w-full p-3 bg-[#F5F5F7] border-none rounded-xl text-[13px] font-medium resize-none"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-medium text-gray-500 ml-1">Cỡ chữ</label>
                                                        <input type="number" value={selectedNode.props.fontSize || 16} onChange={e => updateSelected({ props: { fontSize: parseInt(e.target.value) } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-medium text-gray-500 ml-1">Màu sắc</label>
                                                        <div className="flex items-center gap-2 h-9 px-2 bg-[#F5F5F7] rounded-lg">
                                                            <input type="color" value={selectedNode.props.color || '#000000'} onChange={e => updateSelected({ props: { color: e.target.value } })} className="w-6 h-6 border-none rounded shrink-0" />
                                                            <input type="text" value={selectedNode.props.color || '#000000'} onChange={e => updateSelected({ props: { color: e.target.value } })} className="w-full bg-transparent border-none text-[11px] font-mono font-bold uppercase" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Phông chữ</label>
                                                    <select
                                                        value={selectedNode.props.fontFamily || 'serif'}
                                                        onChange={e => updateSelected({ props: { fontFamily: e.target.value } })}
                                                        className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold"
                                                    >
                                                        <option value="serif">Classic Serif</option>
                                                        <option value="'Lora', serif">Lora Elegant</option>
                                                        <option value="'Dancing Script', cursive">Dancing Script</option>
                                                        <option value="sans-serif">Modern Sans</option>
                                                        <optgroup label="VIP / Premium">
                                                            <option value="'Great Vibes', cursive">Great Vibes</option>
                                                            <option value="'Playfair Display', serif">Playfair Display</option>
                                                            <option value="'OpeningScript'">Opening Script</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_image' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">URL Hình ảnh</label>
                                                    <input type="text" value={selectedNode.props.src || ''} onChange={e => updateSelected({ props: { src: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[11px] font-mono" />
                                                </div>
                                                <div className="aspect-square rounded-xl overflow-hidden bg-gray-50 border">
                                                    <img src={selectedNode.props.src} className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_shape' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Màu phủ</label>
                                                    <div className="flex items-center gap-2 h-10 px-3 bg-[#F5F5F7] rounded-xl">
                                                        <input type="color" value={selectedNode.props.fill || '#000000'} onChange={e => updateSelected({ props: { fill: e.target.value } })} className="w-7 h-7 border-none rounded shrink-0 shadow-sm" />
                                                        <input type="text" value={selectedNode.props.fill || '#000000'} onChange={e => updateSelected({ props: { fill: e.target.value } })} className="w-full bg-transparent border-none text-[12px] font-mono font-bold uppercase" />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Bo góc (px)</label>
                                                    <input type="number" value={selectedNode.props.borderRadius || 0} onChange={e => updateSelected({ props: { borderRadius: parseInt(e.target.value) } })} className="w-full h-10 px-3 bg-[#F5F5F7] border-none rounded-xl text-sm font-bold" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_button' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Nhãn nút</label>
                                                    <input type="text" value={selectedNode.props.text || ''} onChange={e => updateSelected({ props: { text: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Hành động</label>
                                                    <select value={selectedNode.props.action || ''} onChange={e => updateSelected({ props: { action: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold">
                                                        <option value="map">Mở Bản đồ (📍)</option>
                                                        <option value="gift">Gửi quà mừng (🎁)</option>
                                                        <option value="rsvp">Phản hồi (✉️)</option>
                                                        <option value="link">Mở liên kết ngoài</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_timeline' && (
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-bold text-gray-400">DANH SÁCH SỰ KIỆN</p>
                                                {(selectedNode.props.items || []).map((item: any, idx: number) => (
                                                    <div key={idx} className="p-3 bg-gray-50 rounded-xl space-y-2 border border-gray-100">
                                                        <div className="flex gap-2">
                                                            <input type="text" placeholder="Giờ" value={item.time} onChange={e => {
                                                                const newItems = [...selectedNode.props.items];
                                                                newItems[idx].time = e.target.value;
                                                                updateSelected({ props: { items: newItems } });
                                                            }} className="w-20 h-8 px-2 bg-white border rounded text-[11px]" />
                                                            <input type="text" placeholder="Tên sự kiện" value={item.title} onChange={e => {
                                                                const newItems = [...selectedNode.props.items];
                                                                newItems[idx].title = e.target.value;
                                                                updateSelected({ props: { items: newItems } });
                                                            }} className="flex-1 h-8 px-2 bg-white border rounded text-[11px]" />
                                                        </div>
                                                        <select value={item.icon} onChange={e => {
                                                            const newItems = [...selectedNode.props.items];
                                                            newItems[idx].icon = e.target.value;
                                                            updateSelected({ props: { items: newItems } });
                                                        }} className="w-full h-8 px-2 bg-white border rounded text-[11px]">
                                                            <option value="ring">💍 Lễ Thành Hôn</option>
                                                            <option value="camera">📸 Đón khách / Chụp ảnh</option>
                                                            <option value="glass">🥂 Khai tiệc / Ăn uống</option>
                                                            <option value="cake">🎂 Cắt bánh / Rót rượu</option>
                                                            <option value="heart">❤️ Trao nhẫn / Kỷ niệm</option>
                                                            <option value="music">🎵 Văn nghệ</option>
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_calendar' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Ngày hiển thị (YYYY-MM-DD)</label>
                                                    <input type="date" value={selectedNode.props.date?.split('T')[0] || ''} onChange={e => updateSelected({ props: { date: e.target.value } })} className="w-full h-10 px-3 bg-[#F5F5F7] border-none rounded-xl text-sm font-bold" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_countdown' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Thời điểm kết thúc</label>
                                                    <input type="datetime-local" value={selectedNode.props.targetDate || ''} onChange={e => updateSelected({ props: { targetDate: e.target.value } })} className="w-full h-10 px-3 bg-[#F5F5F7] border-none rounded-xl text-sm font-bold" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_map' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Google Maps Embed URL</label>
                                                    <input type="text" value={selectedNode.props.url || ''} onChange={e => updateSelected({ props: { url: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[11px] font-mono" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_event_card' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Tiêu đề lễ</label>
                                                    <input type="text" value={selectedNode.props.title || ''} onChange={e => updateSelected({ props: { title: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Thời gian (HH:mm)</label>
                                                    <input type="text" value={selectedNode.props.time || ''} onChange={e => updateSelected({ props: { time: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Ngày (YYYY-MM-DD)</label>
                                                    <input type="date" value={selectedNode.props.date || ''} onChange={e => updateSelected({ props: { date: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Địa điểm</label>
                                                    <input type="text" value={selectedNode.props.location || ''} onChange={e => updateSelected({ props: { location: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Địa chỉ chi tiết</label>
                                                    <input type="text" value={selectedNode.props.address || ''} onChange={e => updateSelected({ props: { address: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_quote' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Câu trích dẫn</label>
                                                    <textarea rows={3} value={selectedNode.props.text || ''} onChange={e => updateSelected({ props: { text: e.target.value } })} className="w-full p-3 bg-[#F5F5F7] border-none rounded-xl text-[13px] font-medium resize-none" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Tác giả (nếu có)</label>
                                                    <input type="text" value={selectedNode.props.author || ''} onChange={e => updateSelected({ props: { author: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                            </div>
                                        )}

                                        {selectedNode.type === 'element_bank' && (
                                            <div className="space-y-4">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Tiêu đề khối</label>
                                                    <input type="text" value={selectedNode.props.title || ''} onChange={e => updateSelected({ props: { title: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">QR Code URL</label>
                                                    <input type="text" value={selectedNode.props.bank_qr_code || ''} onChange={e => updateSelected({ props: { bank_qr_code: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[11px] font-mono" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Tên ngân hàng</label>
                                                    <input type="text" value={selectedNode.props.bank_name || ''} onChange={e => updateSelected({ props: { bank_name: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Số tài khoản</label>
                                                    <input type="text" value={selectedNode.props.bank_account || ''} onChange={e => updateSelected({ props: { bank_account: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-medium text-gray-500 ml-1">Tên người nhận</label>
                                                    <input type="text" value={selectedNode.props.bank_account_name || ''} onChange={e => updateSelected({ props: { bank_account_name: e.target.value } })} className="w-full h-9 px-3 bg-[#F5F5F7] border-none rounded-lg text-[13px] font-bold" />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Animation */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100">
                                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Hiệu ứng cuộn (Scroll Reveal)</p>
                                        <select
                                            value={selectedNode.animation?.preset || "none"}
                                            onChange={e => updateSelected({ animation: { ...(selectedNode.animation || {}), preset: e.target.value } })}
                                            className="w-full h-10 px-3 bg-[#F5F5F7] border-none rounded-xl text-[13px] font-bold"
                                        >
                                            <option value="none">Không hiệu ứng</option>
                                            <option value="miu-baseline">Luxury Fade In Up</option>
                                            <option value="miu-fadeIn">Quick Fade</option>
                                            <option value="miu-zoomIn">Premium Zoom</option>
                                            <option value="miu-stagger-fade">Staggered Fade</option>
                                            <option value="miu-slideIn">Elegant Slide</option>
                                            <option value="miu-drift">Soft Drift</option>
                                        </select>
                                    </div>

                                    <div className="pt-8">
                                        <button
                                            onClick={() => {
                                                setConfigData({ ...configData, components: deleteNode(configData.components, selectedBlockId || "") });
                                                setSelectedBlockId(null);
                                            }}
                                            className="w-full py-3 bg-red-50 text-red-500 font-bold text-[13px] rounded-xl hover:bg-red-100 transition-colors"
                                        >
                                            Xoá đối tượng
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                                    <div className="w-16 h-16 bg-[#F5F5F7] rounded-2xl flex items-center justify-center text-gray-300">
                                        <MousePointer2 size={32} />
                                    </div>
                                    <div>
                                        <p className="text-[13px] font-bold text-[#1D1D1F]">Chưa chọn đối tượng</p>
                                        <p className="text-[11px] text-gray-400 mt-1">Chọn một thành phần trên bản thiết kế để tùy chỉnh</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </div >

            {/* Global Style overrides for specific premium builder feel */}
            < style jsx global > {`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E5E5E5;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #D1D1D1;
                }
                input[type="range"] {
                    -webkit-appearance: none;
                    height: 4px;
                    background: #F5F5F7;
                    border-radius: 5px;
                }
                input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #0071E3;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(0,113,227,0.2);
                }
            `}</style >
        </div >
    );
}
