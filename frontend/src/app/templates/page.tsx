"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";

type Template = {
    id: number;
    name: string;
    thumbnail_url: string;
    category: string;
};

export default function TemplateGallery() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || "https://mielove.onrender.com"}/api/v1/templates`)
            .then(res => setTemplates(res.data))
            .catch(err => console.error("Error fetching templates", err))
            .finally(() => setLoading(false));
    }, []);

    const categories = ["Tất cả", ...Array.from(new Set(templates.map(t => t.category)))];
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    const filteredTemplates = activeCategory === "Tất cả" 
        ? templates 
        : templates.filter(t => t.category === activeCategory);

    return (
        <div className="min-h-screen bg-stone-50 font-sans">
            <Navbar />
            
            <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif text-primary-800 mb-6">Thư viện Giao diện</h1>
                    <p className="text-stone-600 text-lg">Khám phá bộ sưu tập mẫu thiệp cưới được thiết kế độc quyền, đa dạng phong cách từ truyền thống đến hiện đại. Chọn cho mình một mẫu ưng ý nhất để bắt đầu.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap justify-center gap-3 mb-12">
                            {categories.map((cat, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                                        activeCategory === cat 
                                            ? "bg-primary-600 text-white shadow-md shadow-primary-500/30" 
                                            : "bg-white text-stone-600 hover:bg-primary-50 border border-stone-200"
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredTemplates.map((template, idx) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    key={template.id}
                                    className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col"
                                >
                                    <div className="relative h-[400px] overflow-hidden">
                                        <img 
                                            src={template.thumbnail_url} 
                                            alt={template.name} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white/90 backdrop-blur-sm text-primary-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                                                {template.category}
                                            </span>
                                        </div>
                                        <div className="absolute inset-0 bg-black/20 md:bg-stone-900/40 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                                            <Link 
                                                href={`/dashboard?create=${template.id}`} 
                                                className="w-full max-w-[200px] py-3 bg-primary-600 text-white text-center font-semibold rounded-xl shadow-lg hover:bg-primary-700 transition transform hover:scale-105"
                                            >
                                                Sử dụng mẫu này
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-serif text-stone-800 mb-2">{template.name}</h3>
                                        <div className="flex items-center text-sm text-stone-500">
                                            <span>Mielove Exclusive</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
