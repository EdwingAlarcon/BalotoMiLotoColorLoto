// Generador de combinaciones de lotería

/**
 * Genera una combinación única para el juego especificado
 * @param {Object} config - Configuración del juego
 * @param {string} juego - Tipo de juego
 * @returns {Object} Combinación generada
 */
function generarCombinacionUnica(config, juego) {
    const combinacion = {
        id: Date.now() + Math.random(),
        numeros: [],
        superBalota: null,
        colores: [],
        puntuacion: 0,
        probabilidad: 0,
        timestamp: Date.now()
    };
    
    // Generar números principales
    while (combinacion.numeros.length < config.numeros) {
        const numero = Math.floor(Math.random() * (config.maxNumero - config.minNumero + 1)) + config.minNumero;
        if (!combinacion.numeros.includes(numero)) {
            combinacion.numeros.push(numero);
        }
    }
    
    // Ordenar números
    combinacion.numeros.sort((a, b) => a - b);
    
    // Generar Super Balota si corresponde
    if (config.superBalota) {
        combinacion.superBalota = Math.floor(Math.random() * 
            (config.maxSuperBalota - config.minSuperBalota + 1)) + config.minSuperBalota;
    }
    
    // Generar colores si es Color Loto
    if (juego === 'color-loto' && config.colores) {
        combinacion.colores = combinacion.numeros.map(() => {
            const colores = config.coloresDisponibles;
            return colores[Math.floor(Math.random() * colores.length)];
        });
    }
    
    // Calcular puntuación y probabilidad
    combinacion.puntuacion = calcularPuntuacion(combinacion, config);
    combinacion.probabilidad = calcularProbabilidad(combinacion, config);
    
    return combinacion;
}

/**
 * Calcula la puntuación de una combinación
 * @param {Object} combinacion - Combinación a evaluar
 * @param {Object} config - Configuración del juego
 * @returns {number} Puntuación calculada
 */
function calcularPuntuacion(combinacion, config) {
    let puntuacion = 0;
    
    // Puntos por números pares/impares balanceados
    const pares = combinacion.numeros.filter(n => n % 2 === 0).length;
    const impares = combinacion.numeros.length - pares;
    const balanceParidad = Math.abs(pares - impares);
    puntuacion += (config.numeros - balanceParidad) * 10;
    
    // Puntos por distribución de números (evitar agrupaciones)
    const desviacion = calcularDesviacion(combinacion.numeros);
    puntuacion += Math.round((100 - desviacion) / 10);
    
    // Puntos por Super Balota si existe
    if (combinacion.superBalota) {
        puntuacion += combinacion.superBalota % 2 === 0 ? 5 : 10;
    }
    
    // Puntos por variedad de colores (Color Loto)
    if (combinacion.colores && combinacion.colores.length > 0) {
        const coloresUnicos = new Set(combinacion.colores).size;
        puntuacion += coloresUnicos * 15;
    }
    
    return Math.min(100, Math.max(0, puntuacion));
}

/**
 * Calcula la probabilidad teórica de la combinación
 * @param {Object} combinacion - Combinación a evaluar
 * @param {Object} config - Configuración del juego
 * @returns {number} Probabilidad en porcentaje
 */
function calcularProbabilidad(combinacion, config) {
    // Probabilidad base basada en combinaciones posibles
    let totalCombinaciones = 1;
    
    // Combinaciones de números principales
    const n = config.maxNumero - config.minNumero + 1;
    const k = config.numeros;
    const combinacionesNumeros = factorial(n) / (factorial(k) * factorial(n - k));
    totalCombinaciones *= combinacionesNumeros;
    
    // Combinaciones de Super Balota si aplica
    if (config.superBalota) {
        const combinacionesSuperBalota = config.maxSuperBalota - config.minSuperBalota + 1;
        totalCombinaciones *= combinacionesSuperBalota;
    }
    
    // Combinaciones de colores si aplica
    if (config.colores) {
        const combinacionesColores = Math.pow(config.coloresDisponibles.length, k);
        totalCombinaciones *= combinacionesColores;
    }
    
    // Probabilidad específica de esta combinación (simplificada)
    const probabilidad = 1 / totalCombinaciones;
    
    // Convertir a porcentaje y ajustar por puntuación
    let porcentaje = probabilidad * 100 * 1000000; // Escalar para ver números legibles
    
    // Ajustar por calidad de la combinación
    const factorCalidad = combinacion.puntuacion / 100;
    porcentaje *= (1 + factorCalidad);
    
    return parseFloat(porcentaje.toFixed(8));
}

/**
 * Calcula la desviación estándar de un conjunto de números
 * @param {number[]} numeros - Array de números
 * @returns {number} Desviación estándar
 */
function calcularDesviacion(numeros) {
    const n = numeros.length;
    const mean = numeros.reduce((a, b) => a + b) / n;
    const variance = numeros.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / n;
    return Math.sqrt(variance);
}

/**
 * Calcula el factorial de un número
 * @param {number} n - Número a calcular
 * @returns {number} Factorial
 */
function factorial(n) {
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Filtra y selecciona las mejores combinaciones
 * @param {number} cantidad - Número de combinaciones a seleccionar
 * @returns {Array} Mejores combinaciones
 */
function seleccionarMejoresCombinaciones(cantidad = 5) {
    if (AppState.combinaciones.length === 0) return [];
    
    return [...AppState.combinaciones]
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, cantidad);
}

/**
 * Elimina combinaciones duplicadas
 * @param {Array} combinaciones - Array de combinaciones
 * @returns {Array} Combinaciones únicas
 */
function eliminarDuplicados(combinaciones) {
    const seen = new Set();
    return combinaciones.filter(combinacion => {
        const key = combinacion.numeros.join('-') + 
                   (combinacion.superBalota ? `-${combinacion.superBalota}` : '') +
                   (combinacion.colores ? `-${combinacion.colores.join('-')}` : '');
        
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

/**
 * Genera combinaciones con números calientes (más frecuentes)
 * @param {Object} config - Configuración del juego
 * @param {Object} frecuencia - Frecuencia de números
 * @param {number} cantidad - Cantidad a generar
 * @returns {Array} Combinaciones con números calientes
 */
function generarConNumerosCalientes(config, frecuencia, cantidad = 5) {
    // Ordenar números por frecuencia
    const numerosCalientes = Object.entries(frecuencia)
        .sort((a, b) => b[1] - a[1])
        .slice(0, config.maxNumero)
        .map(([numero]) => parseInt(numero));
    
    const combinaciones = [];
    
    for (let i = 0; i < cantidad; i++) {
        // Mezclar números calientes y tomar los necesarios
        const shuffle = [...numerosCalientes].sort(() => Math.random() - 0.5);
        const numeros = shuffle.slice(0, config.numeros).sort((a, b) => a - b);
        
        const combinacion = {
            id: Date.now() + Math.random(),
            numeros,
            superBalota: config.superBalota ? 
                Math.floor(Math.random() * (config.maxSuperBalota - config.minSuperBalota + 1)) + config.minSuperBalota : null,
            colores: config.colores ? 
                Array(config.numeros).fill().map(() => 
                    config.coloresDisponibles[Math.floor(Math.random() * config.coloresDisponibles.length)]
                ) : [],
            puntuacion: 0,
            probabilidad: 0,
            timestamp: Date.now(),
            usandoNumerosCalientes: true
        };
        
        combinacion.puntuacion = calcularPuntuacion(combinacion, config);
        combinacion.probabilidad = calcularProbabilidad(combinacion, config);
        
        combinaciones.push(combinacion);
    }
    
    return combinaciones;
}

// Exportar funciones
window.generarCombinacionUnica = generarCombinacionUnica;
window.seleccionarMejoresCombinaciones = seleccionarMejoresCombinaciones;
window.eliminarDuplicados = eliminarDuplicados;
window.generarConNumerosCalientes = generarConNumerosCalientes;