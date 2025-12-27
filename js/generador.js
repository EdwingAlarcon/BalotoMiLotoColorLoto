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
        // COLOR LOTO: Generar 6 parejas (color, número) únicas
        // REGLAS OFICIALES:
        // 1. Puedes repetir colores si tienen números diferentes
        // 2. Puedes repetir números si tienen colores diferentes
        // 3. NO puedes repetir la pareja (color, número)

        const coloresDisponibles = [...config.coloresDisponibles];
        const parejasGeneradas = new Set(); // Para evitar duplicar (color, número)
        const coloresUsados = [];
        const numerosUsados = [];

        // Generar 6 parejas únicas (color, número)
        // El generador permite cualquier combinación válida según las reglas
        let intentosGlobales = 0;
        const maxIntentos = 100;

        while (coloresUsados.length < 6 && intentosGlobales < maxIntentos) {
            // Seleccionar color aleatorio (puede repetirse)
            const color = coloresDisponibles[Math.floor(Math.random() * coloresDisponibles.length)];

            // Seleccionar número aleatorio del 1 al 7 (puede repetirse)
            const numero = Math.floor(Math.random() * 7) + 1;

            // Verificar que la pareja (color, número) no esté repetida
            const pareja = `${color}-${numero}`;

            if (!parejasGeneradas.has(pareja)) {
                parejasGeneradas.add(pareja);
                coloresUsados.push(color);
                numerosUsados.push(numero);
            }

            intentosGlobales++;
        }

        // Si no se completaron 6 parejas (muy improbable), completar forzadamente
        while (coloresUsados.length < 6) {
            for (const color of coloresDisponibles) {
                if (coloresUsados.length >= 6) break;
                for (let numero = 1; numero <= 7; numero++) {
                    const pareja = `${color}-${numero}`;
                    if (!parejasGeneradas.has(pareja)) {
                        parejasGeneradas.add(pareja);
                        coloresUsados.push(color);
                        numerosUsados.push(numero);
                        break;
                    }
                }
            }
        }

        // NO ordenar por colores - mantener el orden de selección aleatoria
        // Esto permite más variedad en las combinaciones
        combinacion.colores = coloresUsados;
        combinacion.colorNumeros = numerosUsados;

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
        // COLOR LOTO: Combinaciones de parejas (color, número) únicas
        // Con 6 colores y 7 números, permitiendo repeticiones según las reglas
        // Cada posición puede tener cualquiera de 6 colores × 7 números = 42 opciones
        // Pero debemos evitar duplicar parejas, aproximación: 42 × 41 × 40 × 39 × 38 × 37
        totalCombinaciones = 42 * 41 * 40 * 39 * 38 * 37; // ~3,776,965,920

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
 * Filtra y selecciona las mejores combinaciones usando criterios estadísticos
 * @param {number} cantidad - Número específico de combinaciones (opcional)
 * @returns {Array} Mejores combinaciones
 */
function seleccionarMejoresCombinaciones(cantidad = null) {
    if (AppState.combinaciones.length === 0) return [];

    const total = AppState.combinaciones.length;
    let cantidadASeleccionar;

    // Si se especifica cantidad, usarla; si no, aplicar criterio estadístico
    if (cantidad !== null) {
        cantidadASeleccionar = Math.min(cantidad, total);
    } else {
        // Aplicar criterio estadístico basado en la cantidad total
        if (total <= 5) {
            cantidadASeleccionar = Math.max(1, Math.ceil(total * 0.6));
        } else if (total <= 10) {
            cantidadASeleccionar = Math.ceil(total * 0.5);
        } else if (total <= 20) {
            cantidadASeleccionar = Math.ceil(total * 0.35);
        } else if (total <= 50) {
            cantidadASeleccionar = Math.ceil(total * 0.20);
        } else {
            cantidadASeleccionar = Math.max(5, Math.min(20, Math.ceil(total * 0.15)));
        }
    }

    return [...AppState.combinaciones]
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, cantidadASeleccionar);
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
            // Para Color Loto: crear parejas (color, número) y ordenarlas
            const parejas = combinacion.colores.map((color, index) =>
                `${color}:${combinacion.colorNumeros[index]}`
            ).sort();
            key = `CL:${parejas.join('|')}`;
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
