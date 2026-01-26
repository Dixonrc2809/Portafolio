
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

const particlesCount = 80;
const maxDistance = 120;
const particles = [];

// Crear partículas
for (let i = 0; i < particlesCount; i++) {
    particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2, // más suaves
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 2 + 0.8 // un poco más pequeñas
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Dibujar partículas
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(167, 139, 250, 0.5)';
        ctx.shadowBlur = 4; // suaviza el borde
        ctx.shadowColor = 'rgba(167, 139, 250, 0.5)';
        ctx.fill();

        // Mover partículas
        p.x += p.vx;
        p.y += p.vy;

        // Rebote en bordes
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
    }

    // Conectar partículas cercanas
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(167, 139, 250, ${0.2 * (1 - distance / maxDistance)})`; // más suave
                ctx.lineWidth = 0.8; // líneas más finas
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animate);
}

// Ajustar canvas al redimensionar
window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
});

animate();

