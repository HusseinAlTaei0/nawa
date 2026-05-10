import React from 'react';
import { motion } from 'framer-motion';

// بيانات المشاريع (النماذج الوهمية اللي راح تبنيها)
const projects = [
    {
        id: "01",
        title: "NEXUS FINTECH PLATFORM",
        category: "Web Architecture",
        description: "A high-performance financial dashboard built for processing complex datasets in real-time. Features dark mode UI, seamless data visualization, and banking-grade security architecture.",
        metrics: "Performance: 99/100 | SEO: 100",
        tech: ["React", "Tailwind", "Supabase", "Framer Motion"],
        // صورة مؤقتة (Placeholder) تعبر عن داشبورد مالي
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        link: "#"
    },
    {
        id: "02",
        title: "AUTOMATED LEAD EXTRACTOR",
        category: "Smart Automation (AI)",
        description: "An intelligent agent designed to scrape business data from Google Maps and execute automated, personalized WhatsApp outreach campaigns, saving hundreds of manual hours.",
        metrics: "Efficiency: +80% Time Saved | Leads: 10k+",
        tech: ["Node.js", "Puppeteer", "WhatsApp API", "AI Integration"],
        // صورة مؤقتة تعبر عن الأتمتة والبيانات
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
        link: "#"
    }
];

export default function Projects() {
    return (
        <section id="projects" className="relative min-h-screen w-full bg-[#020205] py-32 px-6 md:px-12 z-10 overflow-hidden">

            {/* إضاءة خلفية للقسم */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto">

                {/* عنوان القسم */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="mb-20 md:mb-32"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-pulse" />
                        <span className="font-mono text-xs text-gray-400 tracking-[0.4em] uppercase">
                            Proof of Concept
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none">
                        THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200">LAB</span>
                    </h2>
                </motion.div>

                {/* قائمة المشاريع */}
                <div className="flex flex-col gap-24 md:gap-40">
                    {projects.map((project, index) => (
                        <ProjectCard key={project.id} project={project} index={index} />
                    ))}
                </div>

            </div>
        </section>
    );
}

function ProjectCard({ project, index }) {
    // نغير اتجاه البطاقة بناءً على الرقم (مرة يمين ومرة يسار)
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 lg:gap-20 items-center`}
        >
            {/* === قسم الصورة (Mockup Area) === */}
            <div className="w-full lg:w-1/2 relative group">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md">
                    {/* الصورة */}
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                    />

                    {/* طبقة لونية خفيفة فوق الصورة تندمج مع ثيم الموقع */}
                    <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay group-hover:opacity-0 transition-opacity duration-700" />

                    {/* تاج الأداء (Metrics Badge) - يظهر فوق الصورة */}
                    <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full">
                        <span className="font-mono text-[10px] tracking-widest text-amber-500 uppercase">
                            {project.metrics}
                        </span>
                    </div>
                </div>
            </div>

            {/* === قسم النصوص والتفاصيل === */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
                <span className="font-mono text-xs text-amber-500 tracking-[0.3em] mb-4 uppercase">
                    {project.id} // {project.category}
                </span>

                <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
                    {project.title}
                </h3>

                <p className="text-gray-400 text-sm md:text-lg font-light leading-relaxed mb-8 border-l-2 border-white/10 pl-6">
                    {project.description}
                </p>

                {/* شريط التقنيات (Tech Stack) */}
                <div className="flex flex-wrap gap-3 mb-10">
                    {project.tech.map((tech, i) => (
                        <span key={i} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 text-gray-300 font-mono text-xs uppercase tracking-widest">
                            {tech}
                        </span>
                    ))}
                </div>

                {/* زر مشاهدة المشروع */}
                <a
                    href={project.link}
                    className="group relative flex items-center gap-4 w-fit cursor-pointer"
                >
                    <div className="w-12 h-12 rounded-full border border-amber-500/50 flex items-center justify-center group-hover:bg-amber-500 group-hover:border-amber-500 transition-all duration-300">
                        <span className="text-amber-500 group-hover:text-black transition-colors duration-300 text-lg">
                            ↗
                        </span>
                    </div>
                    <span className="font-mono text-sm tracking-[0.2em] text-white uppercase group-hover:text-amber-500 transition-colors duration-300">
                        Explore Case Study
                    </span>
                </a>
            </div>
        </motion.div>
    );
}