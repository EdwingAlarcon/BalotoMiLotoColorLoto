/**
 * Datos de ejemplo para pruebas
 * Contiene combinaciones de ejemplo para cada tipo de juego
 */

// ===== EJEMPLOS DE BALOTO =====

export const ejemplosBaloto = [
    {
        id: 1,
        numeros: [5, 12, 23, 34, 41],
        superBalota: 7,
        puntuacion: 85,
        probabilidad: 0.00000000767
    },
    {
        id: 2,
        numeros: [3, 15, 22, 28, 39],
        superBalota: 12,
        puntuacion: 92,
        probabilidad: 0.00000000767
    },
    {
        id: 3,
        numeros: [8, 17, 25, 31, 42],
        superBalota: 4,
        puntuacion: 78,
        probabilidad: 0.00000000767
    }
];

// ===== EJEMPLOS DE MI LOTO =====

export const ejemplosMiLoto = [
    {
        id: 1,
        numeros: [7, 14, 21, 28, 35],
        puntuacion: 88,
        probabilidad: 0.00000173611
    },
    {
        id: 2,
        numeros: [2, 11, 19, 26, 33],
        puntuacion: 81,
        probabilidad: 0.00000173611
    },
    {
        id: 3,
        numeros: [5, 13, 22, 29, 37],
        puntuacion: 90,
        probabilidad: 0.00000173611
    }
];

// ===== EJEMPLOS DE COLOR LOTO =====

export const ejemplosColorLoto = [
    {
        id: 1,
        colores: ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'],
        numeros: [3, 5, 2, 7, 1, 4],
        colorNumeros: [3, 5, 2, 7, 1, 4],
        puntuacion: 75,
        probabilidad: 0.0000000118
    },
    {
        id: 2,
        colores: ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'],
        numeros: [6, 2, 4, 3, 5, 1],
        colorNumeros: [6, 2, 4, 3, 5, 1],
        puntuacion: 82,
        probabilidad: 0.0000000118
    }
];

// ===== LOTE DE EJEMPLO COMPLETO =====

export const loteEjemplo = {
    id: 'ejemplo-' + Date.now(),
    juego: 'baloto',
    nombre: 'Lote de Ejemplo',
    fecha: Date.now(),
    combinaciones: ejemplosBaloto
};

// ===== HISTORIAL DE EJEMPLO =====

export const historialEjemplo = [
    {
        id: 'lote-1',
        juego: 'baloto',
        nombre: 'Primera Generación',
        fecha: Date.now() - 86400000 * 7, // 7 días atrás
        combinaciones: ejemplosBaloto
    },
    {
        id: 'lote-2',
        juego: 'mi-loto',
        nombre: 'Mi Loto - Semana 1',
        fecha: Date.now() - 86400000 * 3, // 3 días atrás
        combinaciones: ejemplosMiLoto
    },
    {
        id: 'lote-3',
        juego: 'color-loto',
        nombre: 'Colores Favoritos',
        fecha: Date.now() - 86400000, // 1 día atrás
        combinaciones: ejemplosColorLoto
    }
];

// ===== ESTADÍSTICAS DE EJEMPLO =====

export const estadisticasEjemplo = {
    totalGeneradas: 150,
    totalLotes: 15,
    frecuenciaNumeros: {
        baloto: {
            1: 5, 2: 3, 3: 7, 4: 4, 5: 8,
            6: 2, 7: 6, 8: 9, 9: 3, 10: 5,
            11: 7, 12: 8, 13: 4, 14: 6, 15: 9,
            16: 3, 17: 7, 18: 5, 19: 6, 20: 4,
            21: 8, 22: 9, 23: 10, 24: 5, 25: 7,
            26: 6, 27: 4, 28: 8, 29: 5, 30: 3,
            31: 9, 32: 6, 33: 7, 34: 8, 35: 4,
            36: 5, 37: 3, 38: 6, 39: 9, 40: 7,
            41: 8, 42: 5, 43: 6
        }
    },
    numeroMasFrecuente: 23,
    probabilidadPromedio: 0.00000000767
};

// ===== CONFIGURACIÓN DE PRUEBA =====

export const configPrueba = {
    tema: 'light',
    ultimoJuego: 'baloto',
    ultimaCantidad: 5,
    notificacionesHabilitadas: true,
    sonidoHabilitado: false
};

// ===== DATOS INVÁLIDOS PARA PRUEBAS =====

export const datosInvalidos = {
    numeroFueraDeRango: {
        numeros: [1, 2, 3, 4, 50], // 50 está fuera de rango para Baloto
        superBalota: 7
    },
    numerosDuplicados: {
        numeros: [1, 2, 3, 3, 5], // 3 está duplicado
        superBalota: 7
    },
    cantidadIncorrecta: {
        numeros: [1, 2, 3], // Solo 3 números en lugar de 5
        superBalota: 7
    },
    superBalotaInvalida: {
        numeros: [1, 2, 3, 4, 5],
        superBalota: 20 // Fuera de rango (1-16)
    },
    archivoJSONInvalido: {
        invalid: 'json',
        structure: true
    }
};

// ===== ESCENARIOS DE PRUEBA =====

export const escenariosTest = {
    // Generación exitosa
    generacionExitosa: {
        juego: 'baloto',
        cantidad: 5,
        esperado: 'success'
    },
    
    // Cantidad inválida
    cantidadInvalida: {
        juego: 'baloto',
        cantidad: 101, // Excede el máximo
        esperado: 'error'
    },
    
    // Storage lleno
    storageLleno: {
        juego: 'baloto',
        cantidad: 1000000, // Excedería el límite de localStorage
        esperado: 'error'
    },
    
    // Importación exitosa
    importacionExitosa: {
        datos: historialEjemplo,
        esperado: 'success'
    },
    
    // Importación fallida
    importacionFallida: {
        datos: datosInvalidos.archivoJSONInvalido,
        esperado: 'error'
    }
};

// ===== MOCKS PARA PRUEBAS =====

export const mockLocalStorage = () => {
    let store = {};
    
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => {
            store[key] = value.toString();
        },
        removeItem: (key) => {
            delete store[key];
        },
        clear: () => {
            store = {};
        },
        get length() {
            return Object.keys(store).length;
        },
        key: (index) => {
            const keys = Object.keys(store);
            return keys[index] || null;
        }
    };
};

export const mockFetch = (data, success = true) => {
    return jest.fn(() => 
        Promise.resolve({
            ok: success,
            json: () => Promise.resolve(data)
        })
    );
};

// ===== UTILIDADES DE PRUEBA =====

export const testUtils = {
    /**
     * Genera combinaciones de prueba
     */
    generarCombinacionesPrueba: (juego, cantidad = 5) => {
        const ejemplos = {
            'baloto': ejemplosBaloto,
            'mi-loto': ejemplosMiLoto,
            'color-loto': ejemplosColorLoto
        };
        
        return ejemplos[juego].slice(0, cantidad);
    },
    
    /**
     * Simula un delay
     */
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    /**
     * Limpia el localStorage de prueba
     */
    limpiarStorage: () => {
        if (typeof localStorage !== 'undefined') {
            localStorage.clear();
        }
    },
    
    /**
     * Crea un evento simulado
     */
    crearEvento: (tipo, detalle = {}) => {
        return new CustomEvent(tipo, { detail: detalle, bubbles: true });
    },
    
    /**
     * Valida estructura de combinación
     */
    validarEstructuraCombinacion: (combinacion, juego) => {
        const propiedadesRequeridas = ['id', 'numeros', 'puntuacion', 'probabilidad'];
        
        if (juego === 'baloto') {
            propiedadesRequeridas.push('superBalota');
        }
        
        if (juego === 'color-loto') {
            propiedadesRequeridas.push('colores', 'colorNumeros');
        }
        
        return propiedadesRequeridas.every(prop => prop in combinacion);
    }
};

// ===== DATOS DE RENDIMIENTO =====

export const benchmarkData = {
    generacion100Combinaciones: {
        tiempo: 50, // ms
        memoria: 0.5 // MB
    },
    guardadoHistorial: {
        tiempo: 10, // ms
        memoria: 0.1 // MB
    },
    renderizado100Filas: {
        tiempo: 30, // ms
        reflows: 5
    }
};

// Exportar todo como un objeto
export default {
    ejemplosBaloto,
    ejemplosMiLoto,
    ejemplosColorLoto,
    loteEjemplo,
    historialEjemplo,
    estadisticasEjemplo,
    configPrueba,
    datosInvalidos,
    escenariosTest,
    mockLocalStorage,
    mockFetch,
    testUtils,
    benchmarkData
};
