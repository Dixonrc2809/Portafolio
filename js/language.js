// language.js - Sistema de traducción simplificado

let currentLang = localStorage.getItem('preferred-language') || 'es';

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    updateContent();
    updateLanguageButton();
    
    // Agregar efecto de clic al botón
    const langBtn = document.getElementById('language-toggle-floating');
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            // Efecto de onda
            this.classList.add('language-ripple');
            setTimeout(() => {
                this.classList.remove('language-ripple');
            }, 600);
        });
    }
});

// Cambiar idioma
function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('preferred-language', currentLang);
    document.documentElement.lang = currentLang;
    updateContent();
    updateLanguageButton();
}

// Actualizar contenido
function updateContent() {
    const trans = translations[currentLang];
    
    // Actualizar elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (trans[key]) {
            element.textContent = trans[key];
        }
    });
    
    // Actualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (trans[key]) {
            element.placeholder = trans[key];
        }
    });
}

// Actualizar botón de idioma
function updateLanguageButton() {
    const langBtn = document.getElementById('language-toggle-floating');
    if (langBtn) {
        langBtn.innerHTML = currentLang === 'es' ? 
            '<span class="lang-text">EN</span>' : 
            '<span class="lang-text">ES</span>';
    }
}

// Función para traducir texto directamente
function translate(key) {
    return translations[currentLang][key] || key;
}

// Hacer funciones disponibles globalmente
window.toggleLanguage = toggleLanguage;
window.translate = translate;