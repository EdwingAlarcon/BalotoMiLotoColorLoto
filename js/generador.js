// Módulo generador de combinaciones
function generarCombinaciones() {
    try {
        const juego = document.getElementById('juego').value;
        const cantidadInput = document.getElementById('combinaciones');
        const cantidad = parseInt(cantidadInput?.value || '5');
        
        if (!cantidad || cantidad < 1 || cantidad > 100) {
            if (typeof mostrarNotificacion === 'function') {
                mostrarNotificacion('error', 'Ingresa un número entre 1 y 100');
            } else {
                alert('Ingresa un número entre 1 y 100');
            }
            return;
        }
        
        console.log(`Generando ${cantidad} combinaciones para ${juego}`);
        
        // Lógica temporal
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('success', `Generando ${cantidad} combinaciones...`);
        }
        
        // Si existe la función simple, usarla
        if (typeof generarCombinacionesSimple === 'function') {
            generarCombinacionesSimple();
        }
        
    } catch (error) {
        console.error('Error en generador:', error);
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion('error', 'Error al generar combinaciones');
        }
    }
}

// Manejar cambio de juego
function manejarCambioJuego() {
    console.log('Juego cambiado, limpiando resultados...');
    AppState.combinaciones = [];
    
    if (typeof actualizarTablaCombinaciones === 'function') {
        actualizarTablaCombinaciones();
    } else if (typeof actualizarTablaSimple === 'function') {
        actualizarTablaSimple();
    }
    
    if (typeof actualizarEstadisticas === 'function') {
        actualizarEstadisticas();
    } else if (typeof actualizarEstadisticasSimple === 'function') {
        actualizarEstadisticasSimple();
    }
    
    if (typeof mostrarReglasJuego === 'function') {
        mostrarReglasJuego();
    } else if (typeof mostrarReglasJuegoSimple === 'function') {
        mostrarReglasJuegoSimple();
    }
}

window.generarCombinaciones = generarCombinaciones;
window.manejarCambioJuego = manejarCambioJuego;