/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dark: "#0a0a0a", // لونك الأساسي الفخم
                accent: "#891707", // العنابي
                gold: "#d4af37", // الذهبي
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Montserrat"', 'sans-serif'],
            },
            // أضفنا هذا الأنميشن للدائرة الموجودة في الـ Hero
            animation: {
                'spin-slow': 'spin 20s linear infinite',
            },
        },
    },
    plugins: [
        // هذا الجزء هو "السر" لجعل البطاقات تظهر ببعد ثالث حقيقي
        function ({ addUtilities }) {
            addUtilities({
                '.perspective-1000': {
                    perspective: '1000px',
                },
                '.transform-style-3d': {
                    'transform-style': 'preserve-3d',
                },
                '.backface-hidden': {
                    'backface-visibility': 'hidden',
                },
            })
        },
    ],
}