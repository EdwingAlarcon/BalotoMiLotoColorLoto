// Módulo de estadísticas
function actualizarEstadisticas() {
    try {
        // Total de combinaciones
        const totalElement = document.getElementById('total-combinaciones');
        if (totalElement) {
            totalElement.textContent = AppState?.combinaciones?.length || 0;
        }
        
        // Total de lotes
        const lotesElement = document.getElementById('total-lotes');
        if (lotesElement) {
            lotesElement.textContent = AppState?.historial?.length || 0;
        }
        
        // Número más frecuente
        const frecuenciaElement = document.getElementById('mejor-frecuencia');
        if (frecuenciaElement) {
            frecuenciaElement.textContent = calcularNumeroMasFrecuente();
        }
        
        // Probabilidad promedio
        const probElement = document.getElementById('probabilidad-promedio');
        if (probElement) {
            probElement.textContent = calcularProbabilidadPromedio();
        }
        
    } catch (error) {
        console.error('Error actualizando estadísticas:', error);
    }
}

function calcularNumeroMasFrecuente() {
    if (!AppState.combinaciones || AppState.combinaciones.length === 0) {
        return '-';
    }
    
    const frecuencia = {};
    AppState.combinaciones.forEach(combinacion => {
        if (combinacion.numeros) {
            combinacion.numeros.forEach(numero => {
                frecuencia[numero] = (frecuencia[numero] || 0) + 1;
            });
        }
    });
    
    let maxNumero = '-';
    let maxFrecuencia = 0;
    
    Object.entries(frecuencia).forEach(([numero, freq]) => {
        if (freq > maxFrecuencia) {
            maxFrecuencia = freq;
            maxNumero = numero;
        }
    });
    
    return maxNumero !== '-' ? `${maxNumero} (${maxFrecuencia} veces)` : '-';
}

function calcularProbabilidadPromedio() {
    if (!AppState.combinaciones || AppState.combinaciones.length === 0) {
        return '-';
    }
    
    const combinacionesConProb = AppState.combinaciones.filter(c => c.probabilidad !== undefined);
    if (combinacionesConProb.length === 0) return '-';
    
    const total = combinacionesConProb.reduce((sum, c) => sum + c.probabilidad, 0);
    const promedio = total / combinacionesConProb.length;
    return promedio.toFixed(8) + '%';
}

function limpiarEstadisticas() {
    if (confirm('¿Limpiar todas las estadísticas?')) {
        AppState.estadisticas = {
            totalGeneradas: 0,
            totalLotes: 0,
            frecuenciaNumeros: {},
            probabilidadAcumulada: 0
        };
        AppState.combinaciones = [];
        actualizarEstadisticas();
        
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('info', 'Estadísticas limpiadas');
        }
    }
}

window.actualizarEstadisticas = actualizarEstadisticas;
window.limpiarEstadisticas = limpiarEstadisticas;
window.calcularNumeroMasFrecuente = calcularNumeroMasFrecuente;
window.calcularProbabilidadPromedio = calcularProbabilidadPromedio;