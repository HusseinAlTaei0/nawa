import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function Contact() {
    // حالة نسخ الإيميل
    const [copied, setCopied] = useState(false);

    // دالة نسخ الإيميل
    const handleCopyEmail = () => {
        navigator.clipboard.writeText('0altaei0@gmail.com');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // === إعدادات حركة الـ 3D التفاعلية للفورم ===
    const cardRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <section id="contact" className="relative min-h-screen w-full flex items-center justify-center px-6 md:px-12 py-24 z-10 bg-[#020205] overflow-hidden">

            {/* كرات مضيئة متحركة في الخلفية لزيادة الـ 3D Feel */}
            <motion.div
                animate={{ y: [-20, 20], x: [-20, 20] }}
                transition={{ duration: 5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none"
            />
            <motion.div
                animate={{ y: [20, -20], x: [20, -20] }}
                transition={{ duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
                className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none"
            />

            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 relative z-10 items-center">

                {/* === العمود الأيسر: المعلومات والتفاعل === */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col justify-center"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse" />
                        <span className="font-mono text-xs text-amber-500/80 tracking-[0.4em] uppercase">
                            Open For Opportunities
                        </span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-tight mb-6">
                        INITIATE <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 drop-shadow-lg">
                            CONNECTION
                        </span>
                    </h2>

                    <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed mb-12 max-w-md">
                        Ready to build scalable web architecture, advanced AI automations, or your next big application? Let's talk.
                    </p>

                    <div className="space-y-8 font-mono text-sm">

                        {/* الإيميل (مع خاصية النسخ) */}
                        <div className="flex flex-col gap-2">
                            <span className="text-white/40 uppercase tracking-widest text-xs">Direct Email</span>
                            <button
                                onClick={handleCopyEmail}
                                className="group flex items-center gap-3 w-fit cursor-pointer outline-none"
                            >
                                <span className="text-xl md:text-2xl text-white group-hover:text-amber-500 transition-colors duration-300">
                                    0altaei0@gmail.com
                                </span>
                                {/* أنيميشن رسالة النسخ */}
                                <span className={`text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-500 transition-all duration-300 ${copied ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                                    {copied ? 'Copied!' : 'Copy'}
                                </span>
                            </button>
                        </div>

                        {/* زر الواتساب الفخم */}
                        <div className="flex flex-col gap-2 pt-4">
                            <span className="text-white/40 uppercase tracking-widest text-xs mb-2">Instant Chat</span>
                            <a
                                // استبدل XXXXXXXX برقم الواتساب مالتك مع رمز الدولة (مثال: 9647701234567)
                                href="https://wa.me/9647703064078"
                                target="_blank"
                                rel="noreferrer"
                                className="group relative flex items-center justify-center gap-3 px-8 py-4 w-fit rounded-full border border-green-500/30 bg-green-500/10 hover:bg-green-500 hover:text-black transition-all duration-500 overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] hover:-translate-y-1"
                            >
                                {/* أيقونة الواتساب (SVG) */}
                                <svg className="w-5 h-5 relative z-10" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.656.84 5.109 2.25 7.109L.469 24l4.984-1.734A11.966 11.966 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zm0 22.031c-2.156 0-4.172-.609-5.859-1.64l-.422-.235-3.047 1.078.844-2.953-.234-.375a10.02 10.02 0 01-1.312-5.875C1.969 5.385 7.385 0 12.031 0c5.531 0 10.031 4.5 10.031 10.031 0 5.531-4.5 10.031-10.031 10.031zm5.578-7.5c-.328-.14-1.828-.937-2.109-1.031-.281-.094-.469-.14-.656.14-.188.281-.797 1.031-.984 1.266-.188.234-.375.281-.703.14-.328-.14-1.312-.469-2.531-1.547-.937-.844-1.547-1.875-1.734-2.203-.188-.328-.047-.469.094-.656.14-.14.281-.328.469-.469.14-.188.234-.328.328-.563.094-.281.047-.469-.047-.656-.094-.188-.656-1.64-.891-2.25-.234-.563-.469-.516-.656-.516h-.563c-.188 0-.516.094-.797.375-.281.281-1.078 1.031-1.078 2.531s1.125 2.953 1.266 3.188c.14.188 2.156 3.328 5.203 4.64.703.328 1.266.516 1.734.656.703.234 1.359.188 1.875.14.563-.094 1.828-.75 2.062-1.453.234-.75.234-1.359.14-1.453-.094-.094-.328-.14-.656-.281z" />
                                </svg>
                                <span className="relative z-10 font-mono text-sm font-bold tracking-[0.1em] whitespace-nowrap">
                                    CHAT ON WHATSAPP
                                </span>
                                <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-500" />
                            </a>
                        </div>
                    </div>
                </motion.div>

                {/* === العمود الأيمن: الفورم الزجاجي ثلاثي الأبعاد (3D Glass Form) === */}
                <motion.div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d"
                    }}
                    className="relative w-full perspective-[1000px]"
                >
                    <div
                        style={{ transform: "translateZ(50px)" }} // لجعل الفورم يبرز للأمام
                        className="bg-white/[0.03] border border-white/10 backdrop-blur-3xl rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-shadow duration-300"
                    >
                        {/* لمعة داخلية */}
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

                        <form className="relative z-10 flex flex-col gap-6" onSubmit={(e) => e.preventDefault()}>

                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs text-gray-400 tracking-widest uppercase">Name</label>
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 transition-all duration-300"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs text-gray-400 tracking-widest uppercase">Email</label>
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 transition-all duration-300"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-mono text-xs text-gray-400 tracking-widest uppercase">Project Scope</label>
                                <textarea
                                    rows="4"
                                    placeholder="Tell me about your idea..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 focus:bg-amber-500/5 transition-all duration-300 resize-none"
                                ></textarea>
                            </div>

                            {/* زر الإرسال المائل (3D Popup) */}
                            <motion.button
                                whileHover={{ translateZ: 20 }}
                                type="submit"
                                className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500 hover:text-black text-amber-500 transition-all duration-500 overflow-hidden cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
                            >
                                <span className="relative z-10 font-mono text-sm font-bold tracking-[0.2em] whitespace-nowrap">
                                    SEND MESSAGE
                                </span>
                                <span className="relative z-10 text-lg transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-1">
                                    ↗
                                </span>
                            </motion.button>
                        </form>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}