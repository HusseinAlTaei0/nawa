import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero3D from './components/Hero3D';
import Hero from './components/Hero';
import Works from './components/Works';
import Contact from './components/Contact';
import CustomCursor from './components/CustomCursor';
import WorksPage from './components/WorksPage'; // الصفحة الجديدة اللي راح نصممها هسه

// مكون الواجهة الرئيسية
function HomePage() {
  return (
    <div className="relative z-10">
      <Hero />
      <main>
        <Works />   {/* قسم الكواكب */}
        <Contact /> {/* قسم التواصل */}
      </main>
      <footer className="py-12 text-center text-gray-500 text-xs bg-dark relative z-20">
        © 2026 Hussein Al-Taei. All Rights Reserved.
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="bg-dark min-h-screen text-white relative cursor-none">
        <CustomCursor />
        {/* النجوم والناف بار يبقون ثابتين بكل الصفحات */}
        <Hero3D />
        <Navbar />

        {/* نظام التوجيه بين الصفحات */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/works" element={<WorksPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;