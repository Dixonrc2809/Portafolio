const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

// Optimización: Detectar si es móvil
const isMobile = window.innerWidth <= 768;

// Optimización: Ajustar parámetros solo para móviles
const particlesCount = isMobile ? 40 : 80; // Reducir a la mitad en móviles
const maxDistance = isMobile ? 80 : 120; // Reducir distancia en móviles
const maxVelocity = isMobile ? 0.12 : 0.2; // Reducir velocidad en móviles

const particles = [];

// Optimización: Pre-calcular valores
const maxDistanceSquared = maxDistance * maxDistance;

// Crear partículas
for (let i = 0; i < particlesCount; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * maxVelocity,
        vy: (Math.random() - 0.5) * maxVelocity,
        size: Math.random() * 2 + 0.8
    });
}

// Optimización: Variables para control de FPS en móviles
let animationId;
let lastTime = 0;
const targetFPS = isMobile ? 30 : 60; // 30 FPS en móviles, 60 en desktop
const frameInterval = 1000 / targetFPS;

function animate(timestamp) {
    // Optimización: Control de FPS para móviles
    if (isMobile && timestamp - lastTime < frameInterval) {
        animationId = requestAnimationFrame(animate);
        return;
    }
    lastTime = timestamp;
    
    ctx.clearRect(0, 0, width, height);

    // Dibujar partículas
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(167, 139, 250, 0.5)';
        ctx.fill();

        // Mover partículas
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    // Optimización: Solo conectar partículas si hay menos de 60 en móviles
    if (!isMobile || particlesCount <= 60) {
        // Conectar partículas cercanas
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            
            // Optimización: Para móviles, reducir el rango de conexión
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distanceSquared = dx * dx + dy * dy;
                
                // Optimización: Usar distanceSquared primero para evitar Math.sqrt innecesario
                if (distanceSquared < maxDistanceSquared) {
                    const distance = Math.sqrt(distanceSquared);
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 * (1 - distance / maxDistance)})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
    }

    animationId = requestAnimationFrame(animate);
}

// Optimización: Debounce para resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, 100);
});

// Optimización: Pausar animación cuando la pestaña no está visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        cancelAnimationFrame(animationId);
    } else {
        lastTime = performance.now();
        animationId = requestAnimationFrame(animate);
    }
});

// Optimización: Pausar animación temporalmente durante scroll en móviles
if (isMobile) {
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        cancelAnimationFrame(animationId);
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            lastTime = performance.now();
            animationId = requestAnimationFrame(animate);
        }, 50);
    }, { passive: true });
}

// Iniciar animación
animate();
