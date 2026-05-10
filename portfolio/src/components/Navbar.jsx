import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Works', path: '/works' },
        { name: 'About', path: '/#about' },
        { name: 'Contact', path: '/#contact' }
    ];

    return (
        <nav className="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference text-white">

            {/* الشعار */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="font-serif text-xl tracking-tighter cursor-pointer"
            >
                <Link to="/">HUSSEIN AL-TAEI</Link>
            </motion.div>

            {/* الروابط */}
            <div className="hidden md:flex gap-8 text-xs font-sans tracking-[0.2em] uppercase">
                {navItems.map((item, i) => (
                    // فصلنا الأنيميشن بـ div خارجي، والـ Link بداخله حتى نتجنب الكراش
                    <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + (i * 0.1) }}
                    >
                        <Link
                            to={item.path}
                            className="hover:text-amber-500 transition-colors duration-300 relative group cursor-pointer block"
                        >
                            {item.name}
                            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </nav>
    );
}