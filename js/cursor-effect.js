// cursor-visible-subtle.js - Glow visible pero discreto
class VisibleGlow {
    constructor() {
        this.glow = null;
        this.intensity = 0.1; // Más visible
        this.isOverElement = false;
        this.init();
    }

    init() {
        if ('ontouchstart' in window) return;
        
        this.createGlow();
        this.setupEvents();
        this.show(); // Mostrar inmediatamente
    }

    createGlow() {
        this.glow = document.createElement('div');
        this.glow.className = 'visible-glow';
        
        // Glow visible pero sutil
        this.glow.style.cssText = `
            position: fixed;
            width: 150px;
            height: 150px;
            background: 
                radial-gradient(
                    circle at 35% 35%,
                    rgba(167, 139, 250, 0.25) 0%,
                    transparent 60%
                ),
                radial-gradient(
                    circle at 65% 65%,
                    rgba(139, 92, 246, 0.2) 0%,
                    transparent 60%
                ),
                radial-gradient(
                    circle at center,
                    rgba(139, 92, 246, 0.15) 0%,
                    rgba(139, 92, 246, 0.08) 40%,
                    transparent 80%
                );
            border-radius: 50%;
            pointer-events: none;
            z-index: 9997;
            transform: translate(-50%, -50%);
            opacity: 0.25; /* Visible por defecto */
            transition: opacity 0.4s ease,
                        transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                        filter 0.4s ease;
            will-change: transform, opacity;
            mix-blend-mode: screen;
            filter: blur(25px) brightness(1.2);
            left: 50%;
            top: 50%;
            box-shadow: 
                0 0 40px rgba(139, 92, 246, 0.1),
                0 0 80px rgba(139, 92, 246, 0.05);
        `;

        document.body.appendChild(this.glow);
        console.log('Visible glow creado - opacidad: 0.25');
    }

    setupEvents() {
        let targetX = window.innerWidth / 2;
        let targetY = window.innerHeight / 2;
        let currentX = targetX;
        let currentY = targetY;
        const smoothing = 0.20; // Seguimiento visible pero suave

        // Seguir mouse
        document.addEventListener('mousemove', (e) => {
            targetX = e.clientX;
            targetY = e.clientY;
            
            // Aumentar intensidad al mover
            if (!this.isOverElement) {
                this.glow.style.opacity = '0.20';
                this.glow.style.filter = 'blur(20px) brightness(1.3)';
                
                // Volver a normal después
                setTimeout(() => {
                    if (!this.isOverElement) {
                        this.glow.style.opacity = '0.25';
                        this.glow.style.filter = 'blur(25px) brightness(1.2)';
                    }
                }, 300);
            }
        });

        // Animación suave
        const animate = () => {
            currentX += (targetX - currentX) * smoothing;
            currentY += (targetY - currentY) * smoothing;
            
            this.glow.style.left = `${currentX}px`;
            this.glow.style.top = `${currentY}px`;
            
            // Efecto de respiración sutil
            if (!this.isOverElement) {
                const time = Date.now() * 0.001;
                const breath = Math.sin(time * 1.5) * 0.03 + 1;
                this.glow.style.transform = `translate(-50%, -50%) scale(${breath})`;
            }
            
            requestAnimationFrame(animate.bind(this));
        };

        animate();

        // Controlar visibilidad en elementos
        this.setupElementBehavior();
    }

    setupElementBehavior() {
        // Elementos donde se reduce la visibilidad
        const reduceOnElements = [
            '.glass-card',
            '.project-card',
            '.btn',
            'button:not(.btn-primary-custom)',
            '.navbar',
            '.section-title',
            '.tech-grid',
            '.contact-info'
        ];

        // Elementos donde se mantiene normal
        const normalOnElements = [
            'body',
            '#particles-bg',
            '#hero-particles',
            'section',
            '.container'
        ];

        reduceOnElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.isOverElement = true;
                    this.reduceIntensity();
                });

                el.addEventListener('mouseleave', () => {
                    this.isOverElement = false;
                    this.restoreIntensity();
                });
            });
        });

        normalOnElements.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.isOverElement = false;
                    this.restoreIntensity();
                });
            });
        });
    }

    reduceIntensity() {
        this.glow.style.opacity = '0.12';
        this.glow.style.filter = 'blur(35px) brightness(1.1)';
        this.glow.style.transform = 'translate(-50%, -50%) scale(0.8)';
    }

    restoreIntensity() {
        this.glow.style.opacity = '0.25';
        this.glow.style.filter = 'blur(25px) brightness(1.2)';
        this.glow.style.transform = 'translate(-50%, -50%) scale(1)';
    }

    show() {
        this.glow.style.opacity = '0.25';
    }

    hide() {
        this.glow.style.opacity = '0';
    }

    // Para control desde consola
    setIntensity(value) {
        this.intensity = Math.max(0.1, Math.min(0.8, value));
        this.glow.style.opacity = this.intensity.toString();
        console.log(`Intensidad ajustada a: ${this.intensity}`);
    }
}

// Inicializar con un pequeño delay
setTimeout(() => {
    window.visibleGlow = new VisibleGlow();
}, 300);