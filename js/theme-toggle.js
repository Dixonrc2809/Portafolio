// theme-toggle.js
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('#theme-toggle .theme-icon i');
    const themeLabel = document.querySelector('.theme-label');
    
    // Función para cargar el tema guardado
    function loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        
        if (savedTheme) {
            // Usar tema guardado
            setTheme(savedTheme);
        } else {
            // Usar preferencia del sistema
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const defaultTheme = prefersDark ? 'dark' : 'light';
            setTheme(defaultTheme);
        }
    }
    
    // Función para aplicar el tema
    function setTheme(theme) {
        // Remover tema anterior
        document.documentElement.removeAttribute('data-theme');
        // Aplicar nuevo tema
        document.documentElement.setAttribute('data-theme', theme);
        
        updateToggleUI(theme);
        localStorage.setItem('portfolio-theme', theme);
        
        // Actualizar los colores de las tecnologías
        updateTechColors(theme);
        
        // Disparar evento para otros scripts
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: theme } 
        }));
    }
    
    // Función para actualizar colores de tecnologías
    function updateTechColors(theme) {
        // Los iconos ya tienen sus colores específicos, no es necesario cambiarlos
        // Esta función está aquí por si necesitas hacer ajustes adicionales
    }
    
    // Función para actualizar la UI del toggle
    function updateToggleUI(theme) {
        if (theme === 'dark') {
            themeIcon.className = 'bi bi-moon-fill';
            themeLabel.textContent = 'Modo Oscuro';
            themeIcon.style.color = '#8b5cf6';
        } else {
            themeIcon.className = 'bi bi-sun-fill';
            themeLabel.textContent = 'Modo Claro';
            themeIcon.style.color = '#ffffff';
        }
        
        // Animación del icono
        themeIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            themeIcon.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Función para cambiar el tema
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        
        // Animación del botón
        themeToggle.style.transform = 'scale(0.95)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    }
    
    // Función para escuchar cambios en la preferencia del sistema
    function watchSystemPreference() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        mediaQuery.addEventListener('change', (e) => {
            // Solo cambiar si no hay tema guardado manualmente
            if (!localStorage.getItem('portfolio-theme')) {
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
            }
        });
    }
    
    // Inicializar
    loadTheme();
    watchSystemPreference();
    
    // Agregar evento al botón
    themeToggle.addEventListener('click', toggleTheme);
    
    // Hacer disponible globalmente para debugging
    window.portfolioTheme = {
        getCurrentTheme: () => document.documentElement.getAttribute('data-theme'),
        setTheme: setTheme,
        toggleTheme: toggleTheme
    };
});