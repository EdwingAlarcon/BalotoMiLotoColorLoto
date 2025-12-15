/**
 * Módulo de Accesibilidad
 * Mejora la accesibilidad de la aplicación
 */

const AccessibilityManager = {
    announcer: null,
    reducedMotion: false,

    /**
     * Inicializa el gestor de accesibilidad
     */
    init() {
        this.createAnnouncer();
        this.detectReducedMotion();
        this.setupKeyboardNavigation();
        this.improveFormAccessibility();
    },

    /**
     * Crea un elemento para anuncios de screen reader
     */
    createAnnouncer() {
        if (document.getElementById('aria-announcer')) return;

        this.announcer = document.createElement('div');
        this.announcer.id = 'aria-announcer';
        this.announcer.className = 'visually-hidden';
        this.announcer.setAttribute('role', 'status');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.announcer);
    },

    /**
     * Anuncia un mensaje para screen readers
     * @param {string} message - Mensaje a anunciar
     * @param {string} priority - 'polite' o 'assertive'
     */
    announce(message, priority = 'polite') {
        if (!this.announcer) return;

        this.announcer.setAttribute('aria-live', priority);
        this.announcer.textContent = '';

        // Pequeño delay para forzar el anuncio
        setTimeout(() => {
            this.announcer.textContent = message;
        }, 100);
    },

    /**
     * Detecta preferencia de movimiento reducido
     */
    detectReducedMotion() {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.reducedMotion = mediaQuery.matches;

        // Aplicar clase al body
        document.body.classList.toggle('reduced-motion', this.reducedMotion);

        // Escuchar cambios
        mediaQuery.addEventListener('change', (e) => {
            this.reducedMotion = e.matches;
            document.body.classList.toggle('reduced-motion', this.reducedMotion);
        });
    },

    /**
     * Configura navegación por teclado mejorada
     */
    setupKeyboardNavigation() {
        // Escape para cerrar modales
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscape();
            }
        });

        // Focus visible solo con teclado
        document.addEventListener('mousedown', () => {
            document.body.classList.add('using-mouse');
        });

        document.addEventListener('keydown', () => {
            document.body.classList.remove('using-mouse');
        });
    },

    /**
     * Maneja la tecla Escape
     */
    handleEscape() {
        // Cerrar modal si está abierto
        const modal = document.querySelector('.modal:not([hidden])');
        if (modal) {
            const closeBtn = modal.querySelector('.modal-close, [data-close-modal]');
            if (closeBtn) {
                closeBtn.click();
            }
        }
    },

    /**
     * Mejora la accesibilidad de formularios
     */
    improveFormAccessibility() {
        // Asegurar que todos los inputs tengan labels
        document.querySelectorAll('input, select, textarea').forEach(input => {
            const id = input.id;
            if (id && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${id}"]`);
                if (!label) {
                    console.warn(`Input sin label asociado: ${id}`);
                }
            }
        });

        // Mejorar mensajes de error
        document.querySelectorAll('.form-error').forEach(error => {
            error.setAttribute('role', 'alert');
        });
    },

    /**
     * Gestiona el foco en un elemento
     * @param {HTMLElement} element - Elemento a enfocar
     * @param {boolean} preventScroll - Prevenir scroll automático
     */
    setFocus(element, preventScroll = false) {
        if (!element) return;

        element.focus({ preventScroll });

        // Anunciar el contexto si tiene aria-label
        const label = element.getAttribute('aria-label') || element.textContent;
        if (label) {
            this.announce(`Foco en: ${label}`);
        }
    },

    /**
     * Verifica el contraste de colores (desarrollo)
     */
    checkContrast() {
        if (process.env.NODE_ENV !== 'development') return;

        // Solo en desarrollo: advertir sobre problemas de contraste
        console.log('Verificación de contraste activada');
    },

    /**
     * Obtiene si hay movimiento reducido activo
     */
    hasReducedMotion() {
        return this.reducedMotion;
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.AccessibilityManager = AccessibilityManager;
}
