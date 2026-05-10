import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

function ParticleCloud() {
    const ref = useRef();

    const scrollState = useRef({
        lastY: 0,
        currentSpeed: 0
    });

    const positions = useMemo(() => {
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 1.5 * Math.cbrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const phi = Math.acos(2 * Math.random() - 1);
            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = r * Math.cos(phi);
            positions[i * 3] = x;
            positions[i * 3 + 1] = y;
            positions[i * 3 + 2] = z;
        }
        return positions;
    }, []);

    useFrame((state, delta) => {
        if (!ref.current) return;

        const currentY = window.scrollY;
        const scrollDelta = Math.abs(currentY - scrollState.current.lastY);

        // === التعديل هنا: تقليل السرعة الأساسية وحساسية السكرول ===
        // 0.02 هي السرعة الهادئة، و 0.05 هو تفاعل السكرول (بطيء ومريح)
        const targetSpeed = 0.02 + (scrollDelta * 0.05);

        // === التعديل هنا: زيادة نعومة التباطؤ ===
        scrollState.current.currentSpeed += (targetSpeed - scrollState.current.currentSpeed) * 0.03;

        ref.current.rotation.y -= scrollState.current.currentSpeed * delta;
        ref.current.rotation.x -= 0.01 * delta;

        scrollState.current.lastY = currentY;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
                <PointMaterial
                    transparent
                    color="#f59e0b" // توحيد اللون ليكون Amber ذهبي متناسق مع باقي الموقع
                    size={0.003}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.8}
                />
            </Points>
        </group>
    );
}

export default function Hero3D() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <ParticleCloud />
            </Canvas>
        </div>
    );
}