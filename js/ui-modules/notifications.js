/**
 * Módulo de Notificaciones
 * Maneja la creación y gestión de notificaciones toast
 */

const NotificationManager = {
    container: null,
    queue: [],
    maxVisible: 3,

    /**
     * Inicializa el contenedor de notificaciones
     */
    init() {
        this.container = document.getElementById('notification-area');
        if (!this.container) {
            console.warn('Contenedor de notificaciones no encontrado');
        }
    },

    /**
     * Muestra una notificación
     * @param {string} type - Tipo: success, error, warning, info
     * @param {string} message - Mensaje a mostrar
     * @param {number} duration - Duración en ms (default: 5000)
     */
    show(type, message, duration = 5000) {
        if (!this.container) return;

        const notification = this._createNotification(type, message);

        // Control de cantidad visible
        if (this.container.children.length >= this.maxVisible) {
            this.container.removeChild(this.container.firstChild);
        }

        this.container.appendChild(notification);

        // Animación de entrada
        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        // Auto-eliminar
        setTimeout(() => {
            this.dismiss(notification);
        }, duration);
    },

    /**
     * Crea el elemento de notificación
     * @private
     */
    _createNotification(type, message) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'polite');

        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };

        notification.innerHTML = `
            <span class="notification-icon" aria-hidden="true">${icons[type] || icons.info}</span>
            <span class="notification-message">${this._escapeHtml(message)}</span>
            <button class="notification-close" aria-label="Cerrar notificación">×</button>
        `;

        // Evento para cerrar
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.dismiss(notification);
        });

        return notification;
    },

    /**
     * Cierra una notificación
     */
    dismiss(notification) {
        notification.classList.add('notification-exit');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    },

    /**
     * Escapa HTML para prevenir XSS
     * @private
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Métodos de conveniencia
    success(message, duration) {
        this.show('success', message, duration);
    },

    error(message, duration) {
        this.show('error', message, duration);
    },

    warning(message, duration) {
        this.show('warning', message, duration);
    },

    info(message, duration) {
        this.show('info', message, duration);
    }
};

// Exportar para uso global (compatible con el código existente)
if (typeof window !== 'undefined') {
    window.NotificationManager = NotificationManager;

    // Función legacy para compatibilidad
    window.mostrarNotificacion = (tipo, mensaje, duracion) => {
        NotificationManager.show(tipo, mensaje, duracion);
    };
}
