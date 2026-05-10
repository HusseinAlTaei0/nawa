import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = useState("default");

    useEffect(() => {
        // تحديث موقع الماوس باستمرار
        const mouseMove = (e) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });
        };

        // === الحل الجذري (Event Delegation) ===
        // بدل ما نبحث عن الأزرار، نراقب الماوس نفسه على مستوى الصفحة كلها
        const handleMouseOver = (e) => {
            // closest() يتأكد إذا العنصر اللي عليه الماوس (أو الأب مالته) هو زر أو رابط
            if (e.target.closest('a, button, .cursor-pointer')) {
                setCursorVariant("text");
            }
        };

        const handleMouseOut = (e) => {
            if (e.target.closest('a, button, .cursor-pointer')) {
                setCursorVariant("default");
            }
        };

        // إضافة المستمعين للصفحة بالكامل
        window.addEventListener("mousemove", mouseMove);
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);

        return () => {
            window.removeEventListener("mousemove", mouseMove);
            document.removeEventListener("mouseover", handleMouseOver);
            document.removeEventListener("mouseout", handleMouseOut);
        };
    }, []);

    // إعدادات الحركة (Variants)
    const variants = {
        default: {
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            height: 32,
            width: 32,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            transition: {
                type: "spring",
                mass: 0.6
            }
        },
        text: {
            x: mousePosition.x - 40,
            y: mousePosition.y - 40,
            height: 80,
            width: 80,
            // استخدمت ألوان متناسقة مع لون الـ Amber اللي بالموقع
            backgroundColor: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.8)",
            mixBlendMode: "difference",
            transition: {
                type: "spring",
                mass: 0.6
            }
        }
    };

    return (
        <motion.div
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
            variants={variants}
            animate={cursorVariant}
        >
            {/* النقطة المركزية - خليتها amber-500 للتناسق */}
            <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
        </motion.div>
    );
}