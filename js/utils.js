/**
 * Utilidades comunes del sistema
 * Funciones auxiliares reutilizables en toda la aplicación
 */

// ===== UTILIDADES DE FORMATEO =====

/**
 * Formatea un número con separadores de miles
 * @param {number} numero - Número a formatear
 * @returns {string} Número formateado
 */
export function formatearNumero(numero) {
    return new Intl.NumberFormat('es-CO').format(numero);
}

/**
 * Formatea un número como porcentaje
 * @param {number} valor - Valor a formatear (0-1)
 * @param {number} decimales - Número de decimales (default: 2)
 * @returns {string} Porcentaje formateado
 */
export function formatearPorcentaje(valor, decimales = 2) {
    return `${(valor * 100).toFixed(decimales)}%`;
}

/**
 * Formatea una fecha
 * @param {Date|number} fecha - Fecha a formatear
 * @param {Object} opciones - Opciones de formateo
 * @returns {string} Fecha formateada
 */
export function formatearFecha(fecha, opciones = {}) {
    const defaultOptions = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    const date = fecha instanceof Date ? fecha : new Date(fecha);
    return new Intl.DateTimeFormat('es-CO', { ...defaultOptions, ...opciones }).format(date);
}

/**
 * Formatea una probabilidad en formato legible
 * @param {number} probabilidad - Probabilidad como fracción (ej: 0.0001)
 * @returns {string} Probabilidad formateada (ej: "1 en 10,000")
 */
export function formatearProbabilidad(probabilidad) {
    if (probabilidad === 0) return '0%';
    if (probabilidad === 1) return '100%';
    
    const inverso = Math.round(1 / probabilidad);
    return `1 en ${formatearNumero(inverso)}`;
}

// ===== UTILIDADES DE ARRAYS =====

/**
 * Mezcla un array aleatoriamente (Fisher-Yates shuffle)
 * @param {Array} array - Array a mezclar
 * @returns {Array} Array mezclado (copia)
 */
export function mezclarArray(array) {
    const resultado = [...array];
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

/**
 * Obtiene elementos únicos de un array
 * @param {Array} array - Array original
 * @returns {Array} Array con elementos únicos
 */
export function obtenerUnicos(array) {
    return [...new Set(array)];
}

/**
 * Genera un rango de números
 * @param {number} inicio - Número inicial
 * @param {number} fin - Número final (inclusivo)
 * @returns {number[]} Array con el rango
 */
export function generarRango(inicio, fin) {
    return Array.from({ length: fin - inicio + 1 }, (_, i) => inicio + i);
}

/**
 * Divide un array en chunks (grupos)
 * @param {Array} array - Array a dividir
 * @param {number} tamano - Tamaño de cada chunk
 * @returns {Array[]} Array de chunks
 */
export function dividirEnChunks(array, tamano) {
    const chunks = [];
    for (let i = 0; i < array.length; i += tamano) {
        chunks.push(array.slice(i, i + tamano));
    }
    return chunks;
}

/**
 * Ordena un array de números
 * @param {number[]} numeros - Array de números
 * @param {boolean} ascendente - Orden ascendente (default: true)
 * @returns {number[]} Array ordenado
 */
export function ordenarNumeros(numeros, ascendente = true) {
    return [...numeros].sort((a, b) => ascendente ? a - b : b - a);
}

// ===== UTILIDADES DE OBJETOS =====

/**
 * Clona profundamente un objeto
 * @param {Object} obj - Objeto a clonar
 * @returns {Object} Copia profunda del objeto
 */
export function clonarObjeto(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Verifica si un objeto está vacío
 * @param {Object} obj - Objeto a verificar
 * @returns {boolean} True si está vacío
 */
export function objetoVacio(obj) {
    return Object.keys(obj).length === 0;
}

/**
 * Combina múltiples objetos
 * @param {...Object} objetos - Objetos a combinar
 * @returns {Object} Objeto combinado
 */
export function combinarObjetos(...objetos) {
    return Object.assign({}, ...objetos);
}

// ===== UTILIDADES DE STRINGS =====

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export function capitalizar(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Convierte un string a kebab-case
 * @param {string} str - String a convertir
 * @returns {string} String en kebab-case
 */
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * Convierte un string a camelCase
 * @param {string} str - String a convertir
 * @returns {string} String en camelCase
 */
export function toCamelCase(str) {
    return str
        .toLowerCase()
        .replace(/[-_\s](.)/g, (_, char) => char.toUpperCase());
}

/**
 * Trunca un string a una longitud máxima
 * @param {string} str - String a truncar
 * @param {number} maxLength - Longitud máxima
 * @param {string} sufijo - Sufijo para indicar truncado (default: '...')
 * @returns {string} String truncado
 */
export function truncar(str, maxLength, sufijo = '...') {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength - sufijo.length) + sufijo;
}

// ===== UTILIDADES DE NÚMEROS =====

/**
 * Genera un número aleatorio entre min y max (inclusivo)
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número aleatorio
 */
export function numeroAleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Genera números únicos aleatorios
 * @param {number} cantidad - Cantidad de números
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number[]} Array de números únicos
 */
export function numerosAleatoriosUnicos(cantidad, min, max) {
    if (cantidad > (max - min + 1)) {
        throw new Error('No se pueden generar más números únicos que el rango disponible');
    }
    
    const numeros = new Set();
    while (numeros.size < cantidad) {
        numeros.add(numeroAleatorio(min, max));
    }
    return Array.from(numeros);
}

/**
 * Limita un número entre un min y max
 * @param {number} num - Número a limitar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {number} Número limitado
 */
export function limitar(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

/**
 * Redondea un número a ciertos decimales
 * @param {number} num - Número a redondear
 * @param {number} decimales - Cantidad de decimales
 * @returns {number} Número redondeado
 */
export function redondear(num, decimales = 2) {
    const factor = Math.pow(10, decimales);
    return Math.round(num * factor) / factor;
}

// ===== UTILIDADES DE TIEMPO =====

/**
 * Espera un tiempo determinado (promesa)
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise} Promesa que se resuelve después del tiempo
 */
export function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Debounce: retrasa la ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Retraso en ms
 * @returns {Function} Función con debounce
 */
export function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * Throttle: limita la frecuencia de ejecución de una función
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite de tiempo en ms
 * @returns {Function} Función con throttle
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== UTILIDADES DE ALMACENAMIENTO =====

/**
 * Guarda datos en localStorage de forma segura
 * @param {string} key - Clave
 * @param {*} value - Valor a guardar
 * @returns {boolean} True si se guardó correctamente
 */
export function guardarEnStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error al guardar en localStorage:', error);
        return false;
    }
}

/**
 * Obtiene datos de localStorage de forma segura
 * @param {string} key - Clave
 * @param {*} defaultValue - Valor por defecto si no existe
 * @returns {*} Valor obtenido o valor por defecto
 */
export function obtenerDeStorage(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error('Error al obtener de localStorage:', error);
        return defaultValue;
    }
}

/**
 * Elimina un item de localStorage
 * @param {string} key - Clave a eliminar
 * @returns {boolean} True si se eliminó
 */
export function eliminarDeStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error al eliminar de localStorage:', error);
        return false;
    }
}

/**
 * Limpia todo el localStorage
 * @returns {boolean} True si se limpió
 */
export function limpiarStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('Error al limpiar localStorage:', error);
        return false;
    }
}

// ===== UTILIDADES DE DOM =====

/**
 * Crea un elemento HTML con atributos
 * @param {string} tag - Tag del elemento
 * @param {Object} attrs - Atributos del elemento
 * @param {string|HTMLElement[]} children - Contenido o hijos
 * @returns {HTMLElement} Elemento creado
 */
export function crearElemento(tag, attrs = {}, children = null) {
    const elemento = document.createElement(tag);
    
    // Establecer atributos
    Object.entries(attrs).forEach(([key, value]) => {
        if (key === 'className') {
            elemento.className = value;
        } else if (key === 'innerHTML') {
            elemento.innerHTML = value;
        } else if (key.startsWith('on') && typeof value === 'function') {
            elemento.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            elemento.setAttribute(key, value);
        }
    });
    
    // Agregar hijos
    if (children) {
        if (typeof children === 'string') {
            elemento.textContent = children;
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    elemento.appendChild(document.createTextNode(child));
                } else {
                    elemento.appendChild(child);
                }
            });
        }
    }
    
    return elemento;
}

/**
 * Selecciona un elemento del DOM de forma segura
 * @param {string} selector - Selector CSS
 * @param {HTMLElement} contexto - Contexto de búsqueda (default: document)
 * @returns {HTMLElement|null} Elemento encontrado
 */
export function seleccionar(selector, contexto = document) {
    return contexto.querySelector(selector);
}

/**
 * Selecciona múltiples elementos del DOM
 * @param {string} selector - Selector CSS
 * @param {HTMLElement} contexto - Contexto de búsqueda (default: document)
 * @returns {HTMLElement[]} Array de elementos
 */
export function seleccionarTodos(selector, contexto = document) {
    return Array.from(contexto.querySelectorAll(selector));
}

// ===== UTILIDADES DE ARCHIVOS =====

/**
 * Descarga un archivo JSON
 * @param {Object} datos - Datos a descargar
 * @param {string} nombreArchivo - Nombre del archivo
 */
export function descargarJSON(datos, nombreArchivo) {
    const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = nombreArchivo;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Lee un archivo como texto
 * @param {File} archivo - Archivo a leer
 * @returns {Promise<string>} Promesa con el contenido
 */
export function leerArchivoTexto(archivo) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsText(archivo);
    });
}

/**
 * Valida el tamaño de un archivo
 * @param {File} archivo - Archivo a validar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {boolean} True si es válido
 */
export function validarTamanoArchivo(archivo, maxSize) {
    return archivo.size <= maxSize;
}

// ===== UTILIDADES DE VALIDACIÓN =====

/**
 * Verifica si un valor es un número
 * @param {*} valor - Valor a verificar
 * @returns {boolean} True si es número
 */
export function esNumero(valor) {
    return typeof valor === 'number' && !isNaN(valor);
}

/**
 * Verifica si un string es vacío
 * @param {string} str - String a verificar
 * @returns {boolean} True si está vacío
 */
export function esVacio(str) {
    return !str || str.trim().length === 0;
}

/**
 * Verifica si un email es válido
 * @param {string} email - Email a verificar
 * @returns {boolean} True si es válido
 */
export function esEmailValido(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ===== UTILIDADES DE CÁLCULO =====

/**
 * Calcula la combinatoria C(n, k) = n! / (k! * (n-k)!)
 * @param {number} n - Total de elementos
 * @param {number} k - Elementos a seleccionar
 * @returns {number} Número de combinaciones
 */
export function calcularCombinatoria(n, k) {
    if (k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    // Optimización: C(n, k) = C(n, n-k)
    k = Math.min(k, n - k);
    
    let resultado = 1;
    for (let i = 0; i < k; i++) {
        resultado *= (n - i);
        resultado /= (i + 1);
    }
    
    return Math.round(resultado);
}

/**
 * Calcula la media de un array de números
 * @param {number[]} numeros - Array de números
 * @returns {number} Media
 */
export function calcularMedia(numeros) {
    if (numeros.length === 0) return 0;
    return numeros.reduce((sum, num) => sum + num, 0) / numeros.length;
}

/**
 * Encuentra el valor más frecuente en un array
 * @param {Array} array - Array de valores
 * @returns {*} Valor más frecuente
 */
export function valorMasFrecuente(array) {
    const frecuencias = {};
    let maxFrecuencia = 0;
    let valorMasFrecuente = null;
    
    array.forEach(valor => {
        frecuencias[valor] = (frecuencias[valor] || 0) + 1;
        if (frecuencias[valor] > maxFrecuencia) {
            maxFrecuencia = frecuencias[valor];
            valorMasFrecuente = valor;
        }
    });
    
    return valorMasFrecuente;
}

// ===== UTILIDADES DE EVENTOS =====

/**
 * Emite un evento personalizado
 * @param {string} nombre - Nombre del evento
 * @param {*} detalle - Detalle del evento
 * @param {HTMLElement} elemento - Elemento que emite (default: document)
 */
export function emitirEvento(nombre, detalle = null, elemento = document) {
    const evento = new CustomEvent(nombre, { detail: detalle, bubbles: true });
    elemento.dispatchEvent(evento);
}

/**
 * Escucha un evento personalizado
 * @param {string} nombre - Nombre del evento
 * @param {Function} callback - Función callback
 * @param {HTMLElement} elemento - Elemento que escucha (default: document)
 */
export function escucharEvento(nombre, callback, elemento = document) {
    elemento.addEventListener(nombre, callback);
}
