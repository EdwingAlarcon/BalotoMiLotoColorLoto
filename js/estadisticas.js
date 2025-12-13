// Módulo de estadísticas y análisis - VERSION CORREGIDA

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
    const juego = document.getElementById('juego').value;
    const config = CONFIG.juegos[juego];
    
    // Reiniciar frecuencia para el juego actual
    AppState.estadisticas.frecuenciaNumeros = {};
    
    if (juego === 'color-loto') {
        // Para Color Loto, contar números asignados a colores (1-7)
        AppState.combinaciones.forEach(combinacion => {
            if (combinacion.colorNumeros) {
                combinacion.colorNumeros.forEach(numero => {
                    AppState.estadisticas.frecuenciaNumeros[numero] = 
                        (AppState.estadisticas.frecuenciaNumeros[numero] || 0) + 1;
                });
            }
        });
    } else {
        // Para Baloto y Mi Loto, contar números principales
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
    }
    
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
        AppState.estadisticas.frecuenciaMaxima = 0;
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
        totalElement.textContent = AppState.estadisticas.totalGeneradas.toLocaleString();
    }
    
    // Actualizar total de lotes
    const lotesElement = document.getElementById('total-lotes');
    if (lotesElement) {
        lotesElement.textContent = AppState.estadisticas.totalLotes.toLocaleString();
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
    
    const juego = document.getElementById('juego').value;
    const config = CONFIG.juegos[juego];
    const probabilidades = calcularProbabilidadesDetalladas(config, juego);
    
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
 * @param {string} juego - Tipo de juego
 * @returns {Array} Array de objetos con probabilidades
 */
function calcularProbabilidadesDetalladas(config, juego) {
    const probabilidades = [];
    
    if (juego === 'color-loto') {
        // COLOR LOTO
        const combinacionesColores = factorial(6); // 720
        const combinacionesNumeros = Math.pow(7, 6); // 117,649
        const totalCombinaciones = combinacionesColores * combinacionesNumeros; // 84,707,280
        
        probabilidades.push({
            label: 'Total combinaciones posibles',
            valor: totalCombinaciones.toLocaleString()
        });
        
        probabilidades.push({
            label: 'Probabilidad de ganar',
            valor: `1 en ${totalCombinaciones.toLocaleString()}`
        });
        
        probabilidades.push({
            label: 'Probabilidad porcentual',
            valor: `${(1/totalCombinaciones*100).toFixed(10)}%`
        });
        
    } else if (juego === 'baloto') {
        // BALOTO
        const combinacionesNumeros = factorial(43) / (factorial(5) * factorial(38)); // 8,145,060
        const totalCombinaciones = combinacionesNumeros * 16; // 130,321,920
        
        probabilidades.push({
            label: 'Combinaciones de 5 números',
            valor: `C(43,5) = ${combinacionesNumeros.toLocaleString()}`
        });
        
        probabilidades.push({
            label: 'Con Super Balota (1-16)',
            valor: `${totalCombinaciones.toLocaleString()}`
        });
        
        probabilidades.push({
            label: 'Probabilidad de acertar 5 números',
            valor: `1 en ${combinacionesNumeros.toLocaleString()}`
        });
        
        probabilidades.push({
            label: 'Probabilidad con Super Balota',
            valor: `1 en ${totalCombinaciones.toLocaleString()}`
        });
        
    } else if (juego === 'mi-loto') {
        // MI LOTO
        const totalCombinaciones = factorial(39) / (factorial(5) * factorial(34)); // 575,757
        
        probabilidades.push({
            label: 'Total combinaciones posibles',
            valor: totalCombinaciones.toLocaleString()
        });
        
        probabilidades.push({
            label: 'Probabilidad de ganar',
            valor: `1 en ${totalCombinaciones.toLocaleString()}`
        });
        
        probabilidades.push({
            label: 'Probabilidad de acertar 1 número',
            valor: `${(5/39*100).toFixed(2)}%`
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
    const juego = document.getElementById('juego').value;
    const config = CONFIG.juegos[juego];
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