import React, { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// بيانات الأقسام
const categories = [
    { id: "01", title: "WEB ARCHITECTURE", subtitle: "Scalable Ecosystems", color: "text-blue-500", glow: "group-hover:shadow-[0_0_50px_rgba(59,130,246,0.3)]", border: "group-hover:border-blue-500/50" },
    { id: "02", title: "SMART AUTOMATION", subtitle: "AI-Driven Workflows", color: "text-purple-500", glow: "group-hover:shadow-[0_0_50px_rgba(168,85,247,0.3)]", border: "group-hover:border-purple-500/50" },
    { id: "03", title: "NATIVE APPS", subtitle: "Flawless Experiences", color: "text-orange-500", glow: "group-hover:shadow-[0_0_50px_rgba(249,115,22,0.3)]", border: "group-hover:border-orange-500/50" },
    { id: "04", title: "APPLIED A.I.", subtitle: "Cognitive Solutions", color: "text-amber-500", glow: "group-hover:shadow-[0_0_50px_rgba(245,158,11,0.3)]", border: "group-hover:border-amber-500/50" }
];

// === مكون البطاقة الـ 3D التفاعلية ===
function Card3D({ category, index }) {
    const ref = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

    const handleMouseMove = (e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        x.set(mouseX / width - 0.5);
        y.set(mouseY / height - 0.5);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
            className="relative perspective-[1500px] w-full"
        >
            <motion.div
                ref={ref}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                className={`group relative w-full aspect-square md:aspect-[4/3] rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 p-8 flex flex-col justify-between overflow-hidden cursor-pointer transition-colors duration-500 shadow-2xl ${category.border} ${category.glow}`}
            >
                {/* إضاءة داخلية خفيفة */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] to-transparent pointer-events-none" />

                <div
                    style={{ transform: "translateZ(60px)" }}
                    className="relative z-10 flex justify-between items-start"
                >
                    <span className={`font-mono text-4xl md:text-5xl font-black ${category.color} opacity-50`}>
                        {category.id}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:rotate-45 transition-transform duration-500">
                        <span className="text-white/50 group-hover:text-white transition-colors">↗</span>
                    </div>
                </div>

                <div
                    style={{ transform: "translateZ(80px)" }}
                    className="relative z-10 flex flex-col items-center justify-center my-auto"
                >
                    <div className="w-16 h-16 mb-6 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                        <span className="text-2xl text-white/30">✦</span>
                    </div>
                    <p className="font-mono text-xs text-gray-500 tracking-[0.2em] uppercase text-center group-hover:text-gray-300 transition-colors">
                        Space reserved for <br /> future case study
                    </p>
                </div>

                <div
                    style={{ transform: "translateZ(40px)" }}
                    className="relative z-10"
                >
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-1">
                        {category.title}
                    </h3>
                    <p className="font-mono text-xs text-gray-400 tracking-widest uppercase">
                        {category.subtitle}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

// === الصفحة الرئيسية للأعمال ===
export default function WorksPage() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        // === التعديل هنا: جعلنا الخلفية شفافة bg-transparent بدلاً من اللون الصلب ===
        <div className="relative z-10 min-h-screen bg-transparent pt-32 pb-32 px-6 md:px-12 overflow-hidden">

            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[500px] bg-indigo-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto mb-24 text-center relative z-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                >
                    <h1 className="text-5xl md:text-8xl lg:text-[10rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 tracking-tighter leading-none mb-6">
                        THE <span className="text-amber-500">LAB</span>
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 1 }}
                    className="text-gray-400 font-mono text-xs md:text-sm tracking-[0.3em] uppercase max-w-xl mx-auto drop-shadow-md"
                >
                    Where complex problems meet elegant engineering. Exploring the boundaries of architecture and AI.
                </motion.p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-20">
                {categories.map((category, index) => (
                    <Card3D key={category.id} category={category} index={index} />
                ))}
            </div>

        </div>
    );
}