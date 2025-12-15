/**
 * Sistema de validación de datos
 * Valida entradas y datos del sistema
 */

import { VALIDACIONES, REGEX } from './constants.js';

// ===== VALIDADORES DE NÚMEROS =====

/**
 * Valida que un valor sea un número
 * @param {*} valor - Valor a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarNumero(valor) {
    if (typeof valor !== 'number' || isNaN(valor)) {
        return { valido: false, error: 'El valor debe ser un número válido' };
    }
    return { valido: true, error: null };
}

/**
 * Valida que un número esté en un rango
 * @param {number} numero - Número a validar
 * @param {number} min - Valor mínimo
 * @param {number} max - Valor máximo
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarRango(numero, min, max) {
    const validacionNumero = validarNumero(numero);
    if (!validacionNumero.valido) return validacionNumero;
    
    if (numero < min || numero > max) {
        return { 
            valido: false, 
            error: `El número debe estar entre ${min} y ${max}` 
        };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que un número sea entero
 * @param {number} numero - Número a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarEntero(numero) {
    const validacionNumero = validarNumero(numero);
    if (!validacionNumero.valido) return validacionNumero;
    
    if (!Number.isInteger(numero)) {
        return { valido: false, error: 'El número debe ser un entero' };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que un número sea positivo
 * @param {number} numero - Número a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarPositivo(numero) {
    const validacionNumero = validarNumero(numero);
    if (!validacionNumero.valido) return validacionNumero;
    
    if (numero <= 0) {
        return { valido: false, error: 'El número debe ser positivo' };
    }
    
    return { valido: true, error: null };
}

// ===== VALIDADORES DE STRINGS =====

/**
 * Valida que un string no esté vacío
 * @param {string} str - String a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarNoVacio(str) {
    if (typeof str !== 'string' || str.trim().length === 0) {
        return { valido: false, error: 'El campo no puede estar vacío' };
    }
    return { valido: true, error: null };
}

/**
 * Valida la longitud de un string
 * @param {string} str - String a validar
 * @param {number} minLength - Longitud mínima
 * @param {number} maxLength - Longitud máxima
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarLongitud(str, minLength, maxLength) {
    const validacionVacio = validarNoVacio(str);
    if (!validacionVacio.valido) return validacionVacio;
    
    if (str.length < minLength || str.length > maxLength) {
        return { 
            valido: false, 
            error: `El texto debe tener entre ${minLength} y ${maxLength} caracteres` 
        };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida un email
 * @param {string} email - Email a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarEmail(email) {
    const validacionVacio = validarNoVacio(email);
    if (!validacionVacio.valido) return validacionVacio;
    
    if (!REGEX.EMAIL.test(email)) {
        return { valido: false, error: 'El email no es válido' };
    }
    
    return { valido: true, error: null };
}

// ===== VALIDADORES DE ARRAYS =====

/**
 * Valida que un array no esté vacío
 * @param {Array} array - Array a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarArrayNoVacio(array) {
    if (!Array.isArray(array) || array.length === 0) {
        return { valido: false, error: 'La lista no puede estar vacía' };
    }
    return { valido: true, error: null };
}

/**
 * Valida que un array tenga una longitud específica
 * @param {Array} array - Array a validar
 * @param {number} longitud - Longitud esperada
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarLongitudArray(array, longitud) {
    if (!Array.isArray(array)) {
        return { valido: false, error: 'El valor debe ser una lista' };
    }
    
    if (array.length !== longitud) {
        return { 
            valido: false, 
            error: `La lista debe tener exactamente ${longitud} elementos` 
        };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que un array contenga valores únicos
 * @param {Array} array - Array a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarValoresUnicos(array) {
    if (!Array.isArray(array)) {
        return { valido: false, error: 'El valor debe ser una lista' };
    }
    
    const unicos = new Set(array);
    if (unicos.size !== array.length) {
        return { valido: false, error: 'La lista contiene valores duplicados' };
    }
    
    return { valido: true, error: null };
}

// ===== VALIDADORES DE OBJETOS =====

/**
 * Valida que un objeto tenga ciertas propiedades
 * @param {Object} obj - Objeto a validar
 * @param {string[]} propiedades - Propiedades requeridas
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarPropiedades(obj, propiedades) {
    if (typeof obj !== 'object' || obj === null) {
        return { valido: false, error: 'El valor debe ser un objeto' };
    }
    
    const faltantes = propiedades.filter(prop => !(prop in obj));
    
    if (faltantes.length > 0) {
        return { 
            valido: false, 
            error: `Faltan las siguientes propiedades: ${faltantes.join(', ')}` 
        };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que un objeto no esté vacío
 * @param {Object} obj - Objeto a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarObjetoNoVacio(obj) {
    if (typeof obj !== 'object' || obj === null || Object.keys(obj).length === 0) {
        return { valido: false, error: 'El objeto no puede estar vacío' };
    }
    return { valido: true, error: null };
}

// ===== VALIDADORES DE FECHAS =====

/**
 * Valida que una fecha sea válida
 * @param {Date|string|number} fecha - Fecha a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarFecha(fecha) {
    const date = new Date(fecha);
    
    if (isNaN(date.getTime())) {
        return { valido: false, error: 'La fecha no es válida' };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que una fecha esté en el pasado
 * @param {Date|string|number} fecha - Fecha a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarFechaPasada(fecha) {
    const validacionFecha = validarFecha(fecha);
    if (!validacionFecha.valido) return validacionFecha;
    
    const date = new Date(fecha);
    const ahora = new Date();
    
    if (date > ahora) {
        return { valido: false, error: 'La fecha debe estar en el pasado' };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida que una fecha esté en el futuro
 * @param {Date|string|number} fecha - Fecha a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarFechaFutura(fecha) {
    const validacionFecha = validarFecha(fecha);
    if (!validacionFecha.valido) return validacionFecha;
    
    const date = new Date(fecha);
    const ahora = new Date();
    
    if (date < ahora) {
        return { valido: false, error: 'La fecha debe estar en el futuro' };
    }
    
    return { valido: true, error: null };
}

// ===== VALIDADORES DE ARCHIVOS =====

/**
 * Valida que un archivo tenga el tipo correcto
 * @param {File} archivo - Archivo a validar
 * @param {string[]} tiposPermitidos - Tipos MIME permitidos
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarTipoArchivo(archivo, tiposPermitidos) {
    if (!(archivo instanceof File)) {
        return { valido: false, error: 'El valor debe ser un archivo' };
    }
    
    if (!tiposPermitidos.includes(archivo.type)) {
        return { 
            valido: false, 
            error: `El tipo de archivo no es permitido. Tipos aceptados: ${tiposPermitidos.join(', ')}` 
        };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida el tamaño de un archivo
 * @param {File} archivo - Archivo a validar
 * @param {number} maxSize - Tamaño máximo en bytes
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarTamanoArchivo(archivo, maxSize) {
    if (!(archivo instanceof File)) {
        return { valido: false, error: 'El valor debe ser un archivo' };
    }
    
    if (archivo.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        return { 
            valido: false, 
            error: `El archivo es muy grande. Tamaño máximo: ${maxSizeMB} MB` 
        };
    }
    
    return { valido: true, error: null };
}

// ===== VALIDADORES ESPECÍFICOS DEL SISTEMA =====

/**
 * Valida una cantidad de combinaciones
 * @param {number} cantidad - Cantidad a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarCantidadCombinaciones(cantidad) {
    const validaciones = [
        validarNumero(cantidad),
        validarEntero(cantidad),
        validarPositivo(cantidad),
        validarRango(cantidad, VALIDACIONES.NUMERO.MIN, VALIDACIONES.NUMERO.MAX)
    ];
    
    for (const validacion of validaciones) {
        if (!validacion.valido) return validacion;
    }
    
    return { valido: true, error: null };
}

/**
 * Valida una combinación de Baloto
 * @param {number[]} numeros - Números principales
 * @param {number} superBalota - Super Balota
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarCombinacionBaloto(numeros, superBalota) {
    // Validar array de números
    let validacion = validarLongitudArray(numeros, 5);
    if (!validacion.valido) return validacion;
    
    validacion = validarValoresUnicos(numeros);
    if (!validacion.valido) return validacion;
    
    // Validar cada número
    for (const num of numeros) {
        validacion = validarRango(num, 1, 43);
        if (!validacion.valido) {
            return { valido: false, error: `Número ${num} fuera de rango (1-43)` };
        }
    }
    
    // Validar Super Balota
    validacion = validarRango(superBalota, 1, 16);
    if (!validacion.valido) {
        return { valido: false, error: 'Super Balota debe estar entre 1 y 16' };
    }
    
    return { valido: true, error: null };
}

/**
 * Valida una combinación de Mi Loto
 * @param {number[]} numeros - Números principales
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarCombinacionMiLoto(numeros) {
    // Validar array de números
    let validacion = validarLongitudArray(numeros, 5);
    if (!validacion.valido) return validacion;
    
    validacion = validarValoresUnicos(numeros);
    if (!validacion.valido) return validacion;
    
    // Validar cada número
    for (const num of numeros) {
        validacion = validarRango(num, 1, 39);
        if (!validacion.valido) {
            return { valido: false, error: `Número ${num} fuera de rango (1-39)` };
        }
    }
    
    return { valido: true, error: null };
}

/**
 * Valida una combinación de Color Loto
 * @param {string[]} colores - Colores seleccionados
 * @param {number[]} numeros - Números de cada color
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarCombinacionColorLoto(colores, numeros) {
    // Validar arrays
    let validacion = validarLongitudArray(colores, 6);
    if (!validacion.valido) return validacion;
    
    validacion = validarLongitudArray(numeros, 6);
    if (!validacion.valido) return validacion;
    
    validacion = validarValoresUnicos(colores);
    if (!validacion.valido) return { valido: false, error: 'Los colores deben ser únicos' };
    
    // Validar colores permitidos
    const coloresPermitidos = ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'];
    for (const color of colores) {
        if (!coloresPermitidos.includes(color)) {
            return { valido: false, error: `Color ${color} no es válido` };
        }
    }
    
    // Validar números (1-7 para cada color)
    for (const num of numeros) {
        validacion = validarRango(num, 1, 7);
        if (!validacion.valido) {
            return { valido: false, error: `Número ${num} fuera de rango (1-7)` };
        }
    }
    
    return { valido: true, error: null };
}

/**
 * Valida datos de historial
 * @param {Object} lote - Lote de combinaciones
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarLoteHistorial(lote) {
    // Validar propiedades requeridas
    const propiedadesRequeridas = ['id', 'juego', 'combinaciones', 'fecha'];
    const validacion = validarPropiedades(lote, propiedadesRequeridas);
    if (!validacion.valido) return validacion;
    
    // Validar fecha
    const validacionFecha = validarFecha(lote.fecha);
    if (!validacionFecha.valido) return validacionFecha;
    
    // Validar combinaciones
    const validacionArray = validarArrayNoVacio(lote.combinaciones);
    if (!validacionArray.valido) return validacionArray;
    
    return { valido: true, error: null };
}

/**
 * Valida datos JSON importados
 * @param {*} datos - Datos a validar
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarDatosImportados(datos) {
    // Verificar que sea un objeto
    if (typeof datos !== 'object' || datos === null) {
        return { valido: false, error: 'Los datos deben ser un objeto JSON válido' };
    }
    
    // Verificar estructura esperada
    if (!Array.isArray(datos.historial) && !Array.isArray(datos)) {
        return { valido: false, error: 'El archivo no tiene el formato correcto' };
    }
    
    return { valido: true, error: null };
}

// ===== VALIDADOR GENÉRICO =====

/**
 * Ejecuta múltiples validaciones y retorna el primer error
 * @param {Function[]} validadores - Array de funciones validadoras
 * @returns {Object} { valido: boolean, error: string|null }
 */
export function validarMultiple(...validadores) {
    for (const validador of validadores) {
        const resultado = validador();
        if (!resultado.valido) return resultado;
    }
    return { valido: true, error: null };
}

/**
 * Crea un validador personalizado
 * @param {Function} condicion - Función que retorna boolean
 * @param {string} mensajeError - Mensaje de error si falla
 * @returns {Function} Función validadora
 */
export function crearValidador(condicion, mensajeError) {
    return (valor) => {
        if (!condicion(valor)) {
            return { valido: false, error: mensajeError };
        }
        return { valido: true, error: null };
    };
}

// Exportar todas las validaciones
export default {
    validarNumero,
    validarRango,
    validarEntero,
    validarPositivo,
    validarNoVacio,
    validarLongitud,
    validarEmail,
    validarArrayNoVacio,
    validarLongitudArray,
    validarValoresUnicos,
    validarPropiedades,
    validarObjetoNoVacio,
    validarFecha,
    validarFechaPasada,
    validarFechaFutura,
    validarTipoArchivo,
    validarTamanoArchivo,
    validarCantidadCombinaciones,
    validarCombinacionBaloto,
    validarCombinacionMiLoto,
    validarCombinacionColorLoto,
    validarLoteHistorial,
    validarDatosImportados,
    validarMultiple,
    crearValidador
};
