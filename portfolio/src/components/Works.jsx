import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

const services = [
    {
        id: "01",
        title: "WEB ARCHITECTURE",
        subtitle: "Scalable Digital Ecosystems",
        desc: "Architecting lightning-fast, secure, and visually commanding web platforms designed to elevate your brand and dominate the digital landscape.",
        planetImg: "https://upload.wikimedia.org/wikipedia/commons/2/22/Earth_Western_Hemisphere_transparent_background.png",
        shadow: "shadow-blue-500/20",
        glow: "bg-blue-500",
        filter: "none",
        planetInnerShadow: "shadow-[inset_-20px_-10px_50px_rgba(0,0,50,0.5)]",
        planetRimLight: "shadow-[inset_5px_5px_30px_rgba(100,200,255,0.4)]"
    },
    {
        id: "02",
        title: "SMART AUTOMATION",
        subtitle: "Intelligent Operational Workflows",
        desc: "Deploying advanced AI agents to eliminate manual bottlenecks, streamline complex operations, and exponentially scale your business efficiency.",
        planetImg: "https://upload.wikimedia.org/wikipedia/commons/e/e1/FullMoon2010.jpg",
        shadow: "shadow-purple-500/20",
        glow: "bg-purple-500",
        filter: "sepia(1) hue-rotate(240deg) saturate(3) contrast(1.2)",
        planetInnerShadow: "shadow-[inset_-60px_-30px_90px_rgba(50,0,80,0.9)]",
        planetRimLight: "shadow-[inset_10px_10px_40px_rgba(200,100,255,0.6)] mix-blend-overlay"
    },
    {
        id: "03",
        title: "NATIVE APPLICATIONS",
        subtitle: "Seamless Multi-Platform Experiences",
        desc: "Engineering robust, high-performance mobile and desktop applications tailored to deliver flawless and intuitive user journeys.",
        planetImg: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg",
        shadow: "shadow-orange-500/20",
        glow: "bg-orange-500",
        filter: "none",
        planetInnerShadow: "shadow-[inset_-60px_-30px_90px_rgba(100,20,0,0.9)]",
        planetRimLight: "shadow-[inset_10px_10px_40px_rgba(255,150,50,0.6)] mix-blend-overlay"
    },
    {
        id: "04",
        title: "APPLIED A.I.",
        subtitle: "Cognitive Problem Solving",
        desc: "Your ultimate technical brain trust. Leveraging deep AI expertise to untangle complex tech roadblocks and architect bespoke intelligent solutions.",
        planetImg: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg",
        shadow: "shadow-amber-500/20",
        glow: "bg-amber-500",
        filter: "hue-rotate(15deg) saturate(1.8) contrast(1.3) brightness(1.1)",
        planetInnerShadow: "shadow-[inset_-60px_-30px_90px_rgba(120,60,0,0.9)]",
        planetRimLight: "shadow-[inset_10px_10px_40px_rgba(255,200,100,0.6)] mix-blend-overlay"
    }
];

export default function Works() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 250,
        damping: 40,
        mass: 0.5
    });

    return (
        // === التعديل الأول: السكشن صار شفاف بالكامل bg-transparent ===
        <section ref={containerRef} className="relative h-[500vh] bg-transparent">
            <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden perspective-[2000px]">

                {/* حذفت كل كود الخلفية السوداء المزعجة من هنا، هسه النجوم راح تبين صافية */}

                <h2 className="absolute top-10 text-[15vw] font-black text-white/5 tracking-tighter select-none mix-blend-overlay">
                    SERVICES
                </h2>

                <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
                    {services.map((service, index) => (
                        <Card
                            key={service.id}
                            service={service}
                            index={index}
                            total={services.length}
                            progress={smoothProgress}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

function Card({ service, index, total, progress }) {
    const current = useTransform(progress, (p) => p * (total - 1));
    const offset = useTransform(current, (val) => index - val);

    const x = useTransform(offset, [-1, 0, 1], ["-120%", "0%", "120%"]);
    const rotateY = useTransform(offset, [-1, 0, 1], [45, 0, -45]);
    const z = useTransform(offset, [-1, 0, 1], [-300, 0, -300]);
    const scale = useTransform(offset, [-1, 0, 1], [0.8, 1, 0.8]);
    const finalX = useTransform(x, (val) => `calc(${val} + ${index * 30}px)`);

    const dynamicZIndex = useTransform(offset, (val) => 100 - Math.round(Math.abs(val) * 50));

    // ربط صارم للماوس
    const dynamicPointerEvents = useTransform(offset, (val) => Math.abs(val) < 0.5 ? "auto" : "none");

    return (
        <motion.div
            style={{
                x: finalX,
                rotateY,
                z,
                scale,
                zIndex: dynamicZIndex,
                // === التعديل الثاني الجذري: حذفت transformStyle: preserve-3d اللي كانت تخرب الـ z-index ===
                pointerEvents: dynamicPointerEvents
            }}
            className="flex items-center justify-center absolute"
        >
            <div className={`
                relative w-[85vw] md:w-[750px] aspect-[16/9] 
                rounded-[30px] bg-black/40 backdrop-blur-xl 
                border border-white/10 overflow-hidden 
                shadow-2xl ${service.shadow}
            `}>

                {/* منطقة الكوكب */}
                <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 w-[55%] aspect-square pointer-events-none">
                    <div className={`absolute inset-0 rounded-full ${service.glow} blur-[90px] opacity-30`} />
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                        <img
                            src={service.planetImg}
                            alt={service.title}
                            className="absolute inset-0 w-full h-full object-cover animate-[spin_120s_linear_infinite] z-10"
                            style={{ filter: service.filter }}
                        />
                        <div className={`absolute inset-0 rounded-full ${service.planetInnerShadow} z-20`} />
                        <div className={`absolute inset-0 rounded-full ${service.planetRimLight} z-30`} />
                    </div>
                </div>

                {/* المحتوى النصي */}
                <div className="relative z-30 h-full p-8 md:p-14 flex flex-col justify-between">

                    <div className="flex items-center gap-4 border-b border-white/10 pb-4 w-fit">
                        <div className={`w-3 h-3 rounded-full ${service.glow} shadow-[0_0_15px_currentColor] animate-pulse`} />
                        <span className="font-mono text-xs text-gray-400 tracking-[0.4em]">
                            SYSTEM {service.id}
                        </span>
                    </div>

                    <div className="py-4 flex flex-col justify-center min-h-[180px]">
                        <h3 className="text-4xl md:text-7xl font-black text-white tracking-tighter drop-shadow-lg mix-blend-overlay leading-tight">
                            {service.title}
                        </h3>
                        <p className={`text-sm md:text-xl font-mono text-gray-400 tracking-widest mt-4 uppercase`}>
                            {service.subtitle}
                        </p>
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2 relative z-50">

                        <div className="min-h-[80px] flex items-center">
                            <p className="text-gray-300 text-sm md:text-lg leading-relaxed max-w-[400px] font-light border-l-2 border-white/20 pl-4">
                                {service.desc}
                            </p>
                        </div>

                        <a
                            href="#contact"
                            className="group relative shrink-0 flex items-center justify-center px-8 py-4 rounded-full border border-white/20 bg-white/5 hover:bg-white hover:text-black transition-all duration-500 overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1"
                        >
                            <span className="relative z-10 font-mono text-sm font-bold tracking-[0.2em] whitespace-nowrap">
                                CONTACT ME
                            </span>
                            <div className={`absolute inset-0 ${service.glow} opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-500`} />
                        </a>
                    </div>
                </div>

                {/* طبقة التعتيم */}
                <motion.div
                    className="absolute inset-0 bg-[#020205] pointer-events-none z-40"
                    style={{ opacity: useTransform(offset, [-0.5, 0, 0.5], [0.85, 0, 0.85]) }}
                />
            </div>
        </motion.div>
    );
}