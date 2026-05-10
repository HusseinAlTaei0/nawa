import React from 'react';
import { motion } from 'framer-motion';

export default function Hero() {
    return (
        // bg-transparent حتى تظهر النجوم بالخلفية
        <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden z-10 px-4 bg-transparent">

            {/* الحلقة الديكورية: استخدمنا Framer Motion للدوران حتى نلغي الحاجة لكلاسات خارجية */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute w-[80vw] md:w-[600px] aspect-square border border-white/5 rounded-full pointer-events-none"
            />

            {/* الاسم الصغير في الأعلى */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 1 }}
                className="mb-8 md:mb-12 text-center"
            >
                <p className="text-gray-500 text-[10px] md:text-xs tracking-[0.5em] uppercase font-sans">
                    Hussein Al-Taei
                </p>
            </motion.div>

            {/* العنوان الرئيسي */}
            <div className="flex flex-col items-center justify-center gap-2 md:gap-6 relative z-20">

                {/* الكلمة الأولى: Reality */}
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                        className="font-serif text-6xl md:text-9xl text-white leading-none tracking-tight mix-blend-difference drop-shadow-lg"
                    >
                        Reality
                    </motion.h1>
                </div>

                {/* الرمز & - تم استخدام amber-500 ليطابق لون كوكب المشتري */}
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8, type: "spring" }}
                    className="text-3xl md:text-5xl text-amber-500 font-serif italic drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                >
                    &
                </motion.div>

                {/* الكلمة الثانية: Dream */}
                <div className="overflow-hidden">
                    <motion.h1
                        initial={{ y: "-100%" }}
                        animate={{ y: 0 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="font-serif text-6xl md:text-9xl text-white leading-none tracking-tight mix-blend-difference drop-shadow-lg"
                    >
                        Dream
                    </motion.h1>
                </div>

            </div>

            {/* وصف قصير إبداعي */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="mt-8 text-white/40 text-[10px] md:text-sm font-light tracking-[0.2em] md:tracking-widest max-w-md text-center leading-relaxed"
            >
                BRIDGING THE GAP BETWEEN<br />
                <span className="text-amber-500/90 font-medium">FINANCE</span> & <span className="text-amber-500/90 font-medium">TECHNOLOGY</span>
            </motion.p>

            {/* زر الاستكشاف مع أنيميشن الخط النازل المدمج */}
            <motion.a
                href="#works"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 md:bottom-12 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3 group cursor-pointer z-30"
            >
                <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white/50 uppercase group-hover:text-white transition-colors duration-300">
                    Explore
                </span>

                {/* الخط العمودي الثابت */}
                <div className="w-[1px] h-12 md:h-16 bg-white/10 group-hover:h-20 transition-all duration-500 relative overflow-hidden flex justify-center">
                    {/* القطرة المضيئة المتحركة (بديل لـ animate-movedown) */}
                    <motion.div
                        animate={{ y: ["-100%", "300%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 w-[2px] h-[40%] bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]"
                    />
                </div>
            </motion.a>

        </section>
    );
}