/**
 * Constantes globales del sistema
 * Centraliza todas las configuraciones y constantes de la aplicación
 */

// ===== CONFIGURACIÓN DE LA APLICACIÓN =====
export const APP_CONFIG = {
    VERSION: '1.0.0',
    APP_NAME: 'Generador de Combinaciones',
    MAX_COMBINACIONES: 100,
    MIN_COMBINACIONES: 1,
    MAX_HISTORIAL: 1000,
    DEFAULT_COMBINACIONES: 5,
    STORAGE_KEY: 'generador-combinaciones',
    STORAGE_VERSION: '1.0'
};

// ===== CONFIGURACIÓN DE JUEGOS =====
export const JUEGOS = {
    BALOTO: {
        id: 'baloto',
        nombre: 'Baloto',
        numeros: 5,
        minNumero: 1,
        maxNumero: 43,
        superBalota: true,
        minSuperBalota: 1,
        maxSuperBalota: 16,
        descripcion: '5 números del 1 al 43 + 1 Super Balota del 1 al 16',
        icono: '🔵',
        color: '#0066cc'
    },
    MI_LOTO: {
        id: 'mi-loto',
        nombre: 'Mi Loto',
        numeros: 5,
        minNumero: 1,
        maxNumero: 39,
        superBalota: false,
        descripcion: '5 números del 1 al 39',
        icono: '🎯',
        color: '#ff6600'
    },
    COLOR_LOTO: {
        id: 'color-loto',
        nombre: 'Color Loto',
        numeros: 6,
        minNumero: 1,
        maxNumero: 7,
        superBalota: false,
        colores: true,
        coloresDisponibles: ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'],
        descripcion: '6 parejas (color, número). Colores pueden repetirse si los números difieren. Números pueden repetirse si los colores difieren.',
        icono: '🌈',
        color: '#9933cc'
    }
};

// ===== COLORES PARA COLOR LOTO =====
export const COLORES = {
    AMARILLO: {
        nombre: 'amarillo',
        hex: '#FFD700',
        emoji: '🟡',
        orden: 1
    },
    AZUL: {
        nombre: 'azul',
        hex: '#0066FF',
        emoji: '🔵',
        orden: 2
    },
    ROJO: {
        nombre: 'rojo',
        hex: '#FF0000',
        emoji: '🔴',
        orden: 3
    },
    VERDE: {
        nombre: 'verde',
        hex: '#00CC00',
        emoji: '🟢',
        orden: 4
    },
    BLANCO: {
        nombre: 'blanco',
        hex: '#FFFFFF',
        emoji: '⚪',
        orden: 5
    },
    NEGRO: {
        nombre: 'negro',
        hex: '#000000',
        emoji: '⚫',
        orden: 6
    }
};

// Orden de colores para Color Loto
export const ORDEN_COLORES = ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'];

// ===== CONFIGURACIÓN DE PROBABILIDADES =====
export const PROBABILIDADES = {
    BALOTO: {
        total: 130321920,
        descripcion: 'C(43,5) × 16',
        premios: {
            '5+1': { combinacion: '5 + Super Balota', probabilidad: 1 / 130321920 },
            '5': { combinacion: '5 números', probabilidad: 15 / 130321920 },
            '4+1': { combinacion: '4 + Super Balota', probabilidad: 190 / 130321920 },
            '4': { combinacion: '4 números', probabilidad: 2850 / 130321920 },
            '3+1': { combinacion: '3 + Super Balota', probabilidad: 8455 / 130321920 },
            '3': { combinacion: '3 números', probabilidad: 126825 / 130321920 }
        }
    },
    MI_LOTO: {
        total: 575757,
        descripcion: 'C(39,5)',
        premios: {
            '5': { combinacion: '5 números', probabilidad: 1 / 575757 },
            '4': { combinacion: '4 números', probabilidad: 170 / 575757 },
            '3': { combinacion: '3 números', probabilidad: 5780 / 575757 }
        }
    },
    COLOR_LOTO: {
        total: 84707280,
        descripcion: 'C(6,6) × 7^6',
        premios: {
            '6': { combinacion: '6 colores y números', probabilidad: 1 / 84707280 },
            '5': { combinacion: '5 colores y números', probabilidad: 6 / 84707280 }
        }
    }
};

// ===== CONFIGURACIÓN DE UI =====
export const UI_CONFIG = {
    ANIMATION_DURATION: 300,
    NOTIFICATION_DURATION: 3000,
    NOTIFICATION_ERROR_DURATION: 5000,
    DEBOUNCE_DELAY: 300,
    MAX_TABLA_ROWS: 1000,
    PAGINATION_SIZE: 50
};

// ===== TEMAS =====
export const TEMAS = {
    LIGHT: 'light',
    DARK: 'dark'
};

// ===== MENSAJES =====
export const MENSAJES = {
    SUCCESS: {
        COMBINACIONES_GENERADAS: 'Combinaciones generadas exitosamente',
        GUARDADO_EXITOSO: 'Combinaciones guardadas en el histórico',
        EXPORTACION_EXITOSA: 'Datos exportados correctamente',
        IMPORTACION_EXITOSA: 'Datos importados correctamente',
        LIMPIEZA_EXITOSA: 'Datos limpiados correctamente'
    },
    ERROR: {
        CANTIDAD_INVALIDA: 'La cantidad debe estar entre 1 y 100',
        SIN_COMBINACIONES: 'No hay combinaciones para guardar',
        SIN_SELECCION: 'No hay combinaciones seleccionadas',
        ALMACENAMIENTO_LLENO: 'El almacenamiento está lleno',
        ARCHIVO_INVALIDO: 'El archivo no es válido',
        IMPORTACION_FALLIDA: 'Error al importar el archivo'
    },
    WARNING: {
        CONFIRMACION_LIMPIAR: '¿Estás seguro de limpiar todas las combinaciones?',
        CONFIRMACION_ELIMINAR: '¿Estás seguro de eliminar las combinaciones seleccionadas?',
        CONFIRMACION_LIMPIAR_HISTORIAL: '¿Estás seguro de limpiar todo el historial?'
    },
    INFO: {
        SIN_DATOS: 'No hay datos para mostrar',
        CARGANDO: 'Cargando...',
        PROCESANDO: 'Procesando...'
    }
};

// ===== TIPOS DE NOTIFICACIONES =====
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// ===== EVENTOS PERSONALIZADOS =====
export const CUSTOM_EVENTS = {
    COMBINACIONES_GENERADAS: 'combinaciones:generadas',
    COMBINACIONES_GUARDADAS: 'combinaciones:guardadas',
    COMBINACIONES_ELIMINADAS: 'combinaciones:eliminadas',
    HISTORIAL_ACTUALIZADO: 'historial:actualizado',
    ESTADISTICAS_ACTUALIZADAS: 'estadisticas:actualizadas',
    TEMA_CAMBIADO: 'tema:cambiado'
};

// ===== CLASES CSS =====
export const CSS_CLASSES = {
    HIDDEN: 'hidden',
    LOADING: 'loading',
    ACTIVE: 'active',
    SELECTED: 'selected',
    DISABLED: 'disabled',
    ERROR: 'error',
    SUCCESS: 'success',
    WARNING: 'warning',
    FADE_IN: 'fade-in',
    FADE_OUT: 'fade-out'
};

// ===== CÓDIGOS DE TECLA =====
export const KEY_CODES = {
    ENTER: 'Enter',
    ESCAPE: 'Escape',
    SPACE: ' ',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    TAB: 'Tab'
};

// ===== CONFIGURACIÓN DE ALMACENAMIENTO =====
export const STORAGE_KEYS = {
    TEMA: 'tema',
    HISTORIAL: 'historial',
    ESTADISTICAS: 'estadisticas',
    CONFIGURACION: 'configuracion',
    ULTIMA_SESION: 'ultima-sesion'
};

// ===== FORMATOS =====
export const FORMATOS = {
    FECHA: {
        SHORT: 'dd/MM/yyyy',
        LONG: 'dd/MM/yyyy HH:mm:ss',
        TIME: 'HH:mm:ss'
    },
    NUMERO: {
        DECIMAL: 2,
        PORCENTAJE: 2
    }
};

// ===== VALIDACIONES =====
export const VALIDACIONES = {
    NUMERO: {
        MIN: 1,
        MAX: 100
    },
    TEXTO: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 1000
    },
    ARCHIVO: {
        MAX_SIZE: 10 * 1024 * 1024, // 10 MB
        ALLOWED_TYPES: ['application/json']
    }
};

// ===== EXPRESIONES REGULARES =====
export const REGEX = {
    NUMERO: /^\d+$/,
    DECIMAL: /^\d+\.?\d*$/,
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    FECHA: /^\d{4}-\d{2}-\d{2}$/
};

// ===== ENDPOINTS (para futuras integraciones) =====
export const ENDPOINTS = {
    API_BASE: 'https://api.example.com',
    RESULTADOS: '/resultados',
    ESTADISTICAS: '/estadisticas'
};

// Congelar objetos para prevenir modificaciones
Object.freeze(APP_CONFIG);
Object.freeze(JUEGOS);
Object.freeze(COLORES);
Object.freeze(ORDEN_COLORES);
Object.freeze(PROBABILIDADES);
Object.freeze(UI_CONFIG);
Object.freeze(TEMAS);
Object.freeze(MENSAJES);
Object.freeze(NOTIFICATION_TYPES);
Object.freeze(CUSTOM_EVENTS);
Object.freeze(CSS_CLASSES);
Object.freeze(KEY_CODES);
Object.freeze(STORAGE_KEYS);
Object.freeze(FORMATOS);
Object.freeze(VALIDACIONES);
Object.freeze(REGEX);
Object.freeze(ENDPOINTS);
