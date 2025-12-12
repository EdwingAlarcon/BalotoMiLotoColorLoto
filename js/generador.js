// Generador de combinaciones de lotería - VERSION CORREGIDA

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
        colorNumeros: [],  // Para almacenar los números asignados a cada color (Color Loto)
        puntuacion: 0,
        probabilidad: 0,
        timestamp: Date.now()
    };
    
    // Generar números principales según el juego
    if (juego === 'color-loto') {
        // COLOR LOTERÍA: Generar 6 colores únicos con números del 1-7
        const coloresDisponibles = [...config.coloresDisponibles];
        
        // Mezclar colores disponibles
        for (let i = coloresDisponibles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coloresDisponibles[i], coloresDisponibles[j]] = [coloresDisponibles[j], coloresDisponibles[i]];
        }
        
        // Tomar los primeros 6 colores
        combinacion.colores = coloresDisponibles.slice(0, 6);
        
        // Asignar un número del 1 al 7 a cada color
        combinacion.colorNumeros = combinacion.colores.map(() => {
            return Math.floor(Math.random() * 7) + 1;
        });
        
        // Para Color Loto, los "números" son los números asignados a los colores
        combinacion.numeros = [...combinacion.colorNumeros];
        
    } else {
        // BALOTO y MI LOTO: Generar números únicos
        while (combinacion.numeros.length < config.numeros) {
            const numero = Math.floor(Math.random() * (config.maxNumero - config.minNumero + 1)) + config.minNumero;
            if (!combinacion.numeros.includes(numero)) {
                combinacion.numeros.push(numero);
            }
        }
        
        // Ordenar números
        combinacion.numeros.sort((a, b) => a - b);
        
        // Generar Super Balota si corresponde (solo Baloto)
        if (config.superBalota) {
            combinacion.superBalota = Math.floor(Math.random() * 
                (config.maxSuperBalota - config.minSuperBalota + 1)) + config.minSuperBalota;
        }
    }
    
    // Calcular puntuación y probabilidad
    combinacion.puntuacion = calcularPuntuacion(combinacion, config, juego);
    combinacion.probabilidad = calcularProbabilidad(combinacion, config, juego);
    
    return combinacion;
}

/**
 * Calcula la puntuación de una combinación
 * @param {Object} combinacion - Combinación a evaluar
 * @param {Object} config - Configuración del juego
 * @param {string} juego - Tipo de juego
 * @returns {number} Puntuación calculada
 */
function calcularPuntuacion(combinacion, config, juego) {
    let puntuacion = 0;
    
    if (juego === 'color-loto') {
        // PUNTUACIÓN PARA COLOR LOTO
        // Puntos por tener todos los colores diferentes (siempre deberían ser diferentes)
        const coloresUnicos = new Set(combinacion.colores).size;
        puntuacion += (coloresUnicos === 6) ? 30 : (coloresUnicos * 4);
        
        // Puntos por distribución de números (1-7)
        const numeros = combinacion.colorNumeros;
        const numerosUnicos = new Set(numeros).size;
        puntuacion += numerosUnicos * 8;
        
        // Bonus por buena distribución (no todos iguales, no todos diferentes)
        if (numerosUnicos > 1 && numerosUnicos < 6) {
            puntuacion += 15;
        }
        
        // Puntos por distribución de números altos/bajos
        const bajos = numeros.filter(n => n <= 3).length;
        const medios = numeros.filter(n => n > 3 && n <= 5).length;
        const altos = numeros.filter(n => n > 5).length;
        
        const distribucion = Math.max(bajos, medios, altos) - Math.min(bajos, medios, altos);
        puntuacion += (3 - distribucion) * 5;
        
    } else {
        // PUNTUACIÓN PARA BALOTO Y MI LOTO
        // Puntos por números pares/impares balanceados
        const pares = combinacion.numeros.filter(n => n % 2 === 0).length;
        const impares = combinacion.numeros.length - pares;
        const balanceParidad = Math.abs(pares - impares);
        puntuacion += (config.numeros - balanceParidad) * 12;
        
        // Puntos por distribución de números (evitar agrupaciones)
        const desviacion = calcularDesviacion(combinacion.numeros);
        const rango = config.maxNumero - config.minNumero;
        puntuacion += Math.round((rango - desviacion) / (rango / 20));
        
        // Puntos por Super Balota si existe
        if (combinacion.superBalota) {
            // Bonus si Super Balota es diferente de los números principales
            if (!combinacion.numeros.includes(combinacion.superBalota)) {
                puntuacion += 10;
            }
            // Bonus por paridad diferente
            const superPar = combinacion.superBalota % 2 === 0;
            const mainPar = pares > impares;
            if (superPar !== mainPar) {
                puntuacion += 5;
            }
        }
        
        // Puntos por no tener números consecutivos
        let consecutivos = 0;
        for (let i = 1; i < combinacion.numeros.length; i++) {
            if (combinacion.numeros[i] === combinacion.numeros[i-1] + 1) {
                consecutivos++;
            }
        }
        puntuacion -= consecutivos * 8;
    }
    
    // Asegurar que la puntuación esté entre 0 y 100
    return Math.min(100, Math.max(0, Math.round(puntuacion)));
}

/**
 * Calcula la probabilidad teórica de la combinación
 * @param {Object} combinacion - Combinación a evaluar
 * @param {Object} config - Configuración del juego
 * @param {string} juego - Tipo de juego
 * @returns {number} Probabilidad en porcentaje
 */
function calcularProbabilidad(combinacion, config, juego) {
    let totalCombinaciones = 1;
    
    if (juego === 'color-loto') {
        // COLOR LOTO: 6! × 7^6
        const combinacionesColores = factorial(6); // 720
        const combinacionesNumeros = Math.pow(7, 6); // 117,649
        totalCombinaciones = combinacionesColores * combinacionesNumeros; // 84,707,280
        
    } else if (juego === 'baloto') {
        // BALOTO: C(43,5) × 16
        const n = 43;
        const k = 5;
        const combinacionesNumeros = factorial(n) / (factorial(k) * factorial(n - k)); // 8,145,060
        const combinacionesSuperBalota = 16;
        totalCombinaciones = combinacionesNumeros * combinacionesSuperBalota; // 130,321,920
        
    } else if (juego === 'mi-loto') {
        // MI LOTO: C(39,5)
        const n = 39;
        const k = 5;
        totalCombinaciones = factorial(n) / (factorial(k) * factorial(n - k)); // 575,757
    }
    
    // Probabilidad específica de esta combinación
    const probabilidad = 1 / totalCombinaciones;
    
    // Convertir a porcentaje y escalar para ver números legibles
    let porcentaje = probabilidad * 100 * 1000000;
    
    // Ajustar por calidad de la combinación
    const factorCalidad = combinacion.puntuacion / 100;
    porcentaje *= (1 + factorCalidad * 0.5);
    
    return parseFloat(porcentaje.toFixed(10));
}

/**
 * Calcula la desviación estándar de un conjunto de números
 * @param {number[]} numeros - Array de números
 * @returns {number} Desviación estándar
 */
function calcularDesviacion(numeros) {
    const n = numeros.length;
    if (n === 0) return 0;
    
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
        // Crear una clave única para la combinación
        let key = '';
        
        if (combinacion.colores && combinacion.colores.length > 0) {
            // Para Color Loto: colores + números asociados
            const coloresOrdenados = [...combinacion.colores].sort();
            const numerosOrdenados = combinacion.colorNumeros ? 
                [...combinacion.colorNumeros].sort((a, b) => a - b) : [];
            key = `C:${coloresOrdenados.join('-')}|N:${numerosOrdenados.join('-')}`;
        } else {
            // Para Baloto y Mi Loto: números + super balota
            const numerosOrdenados = [...combinacion.numeros].sort((a, b) => a - b);
            key = `N:${numerosOrdenados.join('-')}`;
            if (combinacion.superBalota) {
                key += `|SB:${combinacion.superBalota}`;
            }
        }
        
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
        .slice(0, 20) // Tomar los 20 más frecuentes
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
            colores: [],
            colorNumeros: [],
            puntuacion: 0,
            probabilidad: 0,
            timestamp: Date.now(),
            usandoNumerosCalientes: true
        };
        
        combinacion.puntuacion = calcularPuntuacion(combinacion, config, document.getElementById('juego').value);
        combinacion.probabilidad = calcularProbabilidad(combinacion, config, document.getElementById('juego').value);
        
        combinaciones.push(combinacion);
    }
    
    return combinaciones;
}

// Exportar funciones
window.generarCombinacionUnica = generarCombinacionUnica;
window.seleccionarMejoresCombinaciones = seleccionarMejoresCombinaciones;
window.eliminarDuplicados = eliminarDuplicados;
window.generarConNumerosCalientes = generarConNumerosCalientes;
window.factorial = factorial;