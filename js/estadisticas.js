// Módulo de estadísticas y análisis

/**
 * Actualiza todas las estadísticas de la aplicación
 */
function actualizarEstadisticas() {
    actualizarFrecuenciaNumeros();
    actualizarProbabilidadPromedio();
    actualizarNumeroMasFrecuente();
    actualizarUIEstadisticas();
}

/**
 * Calcula la frecuencia de todos los números generados
 */
function actualizarFrecuenciaNumeros() {
    const frecuencia = {};
    const config = CONFIG.juegos[document.getElementById('juego').value];
    
    // Reiniciar frecuencia para el juego actual
    AppState.estadisticas.frecuenciaNumeros = {};
    
    // Contar apariciones de cada número
    AppState.combinaciones.forEach(combinacion => {
        combinacion.numeros.forEach(numero => {
            AppState.estadisticas.frecuenciaNumeros[numero] = 
                (AppState.estadisticas.frecuenciaNumeros[numero] || 0) + 1;
        });
        
        // Contar Super Balota si existe
        if (combinacion.superBalota) {
            AppState.estadisticas.frecuenciaNumeros[`SB${combinacion.superBalota}`] = 
                (AppState.estadisticas.frecuenciaNumeros[`SB${combinacion.superBalota}`] || 0) + 1;
        }
    });
    
    // Actualizar probabilidad acumulada
    let probabilidadTotal = 0;
    AppState.combinaciones.forEach(combinacion => {
        probabilidadTotal += combinacion.probabilidad;
    });
    
    AppState.estadisticas.probabilidadAcumulada = probabilidadTotal;
}

/**
 * Calcula la probabilidad promedio de las combinaciones
 */
function actualizarProbabilidadPromedio() {
    if (AppState.combinaciones.length === 0) {
        AppState.estadisticas.probabilidadPromedio = 0;
        return;
    }
    
    const total = AppState.combinaciones.reduce((sum, comb) => sum + comb.probabilidad, 0);
    AppState.estadisticas.probabilidadPromedio = total / AppState.combinaciones.length;
}

/**
 * Encuentra el número más frecuente
 */
function actualizarNumeroMasFrecuente() {
    const frecuencia = AppState.estadisticas.frecuenciaNumeros;
    
    if (Object.keys(frecuencia).length === 0) {
        AppState.estadisticas.numeroMasFrecuente = null;
        return;
    }
    
    // Encontrar el número con mayor frecuencia (excluyendo Super Balotas)
    let maxNumero = null;
    let maxFrecuencia = 0;
    
    Object.entries(frecuencia).forEach(([numero, freq]) => {
        // Solo considerar números normales (no SB)
        if (!numero.startsWith('SB') && freq > maxFrecuencia) {
            maxFrecuencia = freq;
            maxNumero = numero;
        }
    });
    
    AppState.estadisticas.numeroMasFrecuente = maxNumero;
    AppState.estadisticas.frecuenciaMaxima = maxFrecuencia;
}

/**
 * Actualiza la UI con las estadísticas calculadas
 */
function actualizarUIEstadisticas() {
    // Actualizar total de combinaciones
    const totalElement = document.getElementById('total-combinaciones');
    if (totalElement) {
        totalElement.textContent = AppState.estadisticas.totalGeneradas;
    }
    
    // Actualizar total de lotes
    const lotesElement = document.getElementById('total-lotes');
    if (lotesElement) {
        lotesElement.textContent = AppState.estadisticas.totalLotes;
    }
    
    // Actualizar número más frecuente
    const frecuenciaElement = document.getElementById('mejor-frecuencia');
    if (frecuenciaElement) {
        if (AppState.estadisticas.numeroMasFrecuente) {
            const veces = AppState.estadisticas.frecuenciaMaxima || 1;
            frecuenciaElement.textContent = `${AppState.estadisticas.numeroMasFrecuente} (${veces} veces)`;
        } else {
            frecuenciaElement.textContent = '-';
        }
    }
    
    // Actualizar probabilidad promedio
    const probElement = document.getElementById('probabilidad-promedio');
    if (probElement) {
        if (AppState.estadisticas.probabilidadPromedio > 0) {
            probElement.textContent = `${AppState.estadisticas.probabilidadPromedio.toFixed(8)}%`;
        } else {
            probElement.textContent = '-';
        }
    }
    
    // Actualizar panel de probabilidades
    actualizarPanelProbabilidades();
}

/**
 * Actualiza el panel de información de probabilidades
 */
function actualizarPanelProbabilidades() {
    const panel = document.getElementById('probabilityContent');
    if (!panel) return;
    
    const config = CONFIG.juegos[document.getElementById('juego').value];
    const probabilidades = calcularProbabilidadesDetalladas(config);
    
    panel.innerHTML = probabilidades.map(prob => `
        <div class="probability-card">
            <div class="probability-value">${prob.valor}</div>
            <div class="probability-label">${prob.label}</div>
        </div>
    `).join('');
}

/**
 * Calcula probabilidades detalladas para el juego actual
 * @param {Object} config - Configuración del juego
 * @returns {Array} Array de objetos con probabilidades
 */
function calcularProbabilidadesDetalladas(config) {
    const probabilidades = [];
    
    // Probabilidad de acertar todos los números
    const n = config.maxNumero - config.minNumero + 1;
    const k = config.numeros;
    const combinacionesTotal = factorial(n) / (factorial(k) * factorial(n - k));
    
    probabilidades.push({
        label: 'Probabilidad de acertar todos los números',
        valor: `1 en ${combinacionesTotal.toLocaleString()}`
    });
    
    // Probabilidad de acertar 1 número
    const prob1Numero = k / n * 100;
    probabilidades.push({
        label: 'Probabilidad de acertar al menos 1 número',
        valor: `${prob1Numero.toFixed(2)}%`
    });
    
    // Probabilidad considerando Super Balota
    if (config.superBalota) {
        const combinacionesConSuperBalota = combinacionesTotal * (config.maxSuperBalota - config.minSuperBalota + 1);
        probabilidades.push({
            label: 'Probabilidad con Super Balota',
            valor: `1 en ${combinacionesConSuperBalota.toLocaleString()}`
        });
    }
    
    // Probabilidad basada en combinaciones generadas
    if (AppState.combinaciones.length > 0) {
        const mejorProbabilidad = Math.max(...AppState.combinaciones.map(c => c.probabilidad));
        probabilidades.push({
            label: 'Mejor probabilidad generada',
            valor: `${mejorProbabilidad.toFixed(8)}%`
        });
    }
    
    // Distribución recomendada
    probabilidades.push({
        label: 'Distribución ideal pares/impares',
        valor: `${Math.floor(k/2)} pares / ${Math.ceil(k/2)} impares`
    });
    
    return probabilidades;
}

/**
 * Limpia todas las estadísticas
 */
function limpiarEstadisticas() {
    if (AppState.combinaciones.length > 0 && 
        !confirm('¿Estás seguro de que quieres limpiar todas las estadísticas? Las combinaciones actuales se perderán.')) {
        return;
    }
    
    AppState.estadisticas = {
        totalGeneradas: 0,
        totalLotes: 0,
        frecuenciaNumeros: {},
        probabilidadAcumulada: 0,
        probabilidadPromedio: 0,
        numeroMasFrecuente: null,
        frecuenciaMaxima: 0
    };
    
    AppState.combinaciones = [];
    actualizarUIEstadisticas();
    actualizarTablaCombinaciones();
    mostrarNotificacion('info', 'Estadísticas limpiadas correctamente');
}

/**
 * Genera un reporte estadístico detallado
 * @returns {Object} Reporte estadístico
 */
function generarReporteEstadistico() {
    const config = CONFIG.juegos[document.getElementById('juego').value];
    const frecuencia = AppState.estadisticas.frecuenciaNumeros;
    
    // Separar números normales de Super Balotas
    const numerosNormales = {};
    const superBalotas = {};
    
    Object.entries(frecuencia).forEach(([numero, freq]) => {
        if (numero.startsWith('SB')) {
            superBalotas[numero.substring(2)] = freq;
        } else {
            numerosNormales[numero] = freq;
        }
    });
    
    // Encontrar números fríos y calientes
    const numerosOrdenados = Object.entries(numerosNormales)
        .sort((a, b) => b[1] - a[1]);
    
    const numerosCalientes = numerosOrdenados.slice(0, 5).map(([n]) => n);
    const numerosFrios = numerosOrdenados.slice(-5).map(([n]) => n);
    
    return {
        fechaGeneracion: new Date().toISOString(),
        juego: config.nombre,
        totalCombinaciones: AppState.estadisticas.totalGeneradas,
        totalLotes: AppState.estadisticas.totalLotes,
        probabilidadPromedio: AppState.estadisticas.probabilidadPromedio,
        numerosCalientes,
        numerosFrios,
        distribucionNumeros: numerosNormales,
        distribucionSuperBalotas: superBalotas,
        combinacionesUnicas: AppState.combinaciones.length
    };
}

// Exportar funciones
window.actualizarEstadisticas = actualizarEstadisticas;
window.limpiarEstadisticas = limpiarEstadisticas;
window.generarReporteEstadistico = generarReporteEstadistico;