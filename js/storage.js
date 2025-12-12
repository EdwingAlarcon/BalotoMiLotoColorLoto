// Módulo de almacenamiento y persistencia

const STORAGE_KEYS = {
    HISTORIAL: 'generador_combinaciones_historial',
    ESTADISTICAS: 'generador_combinaciones_estadisticas',
    CONFIG: 'generador_combinaciones_config'
};

/**
 * Guarda todos los datos de la aplicación en localStorage
 */
function guardarDatos() {
    try {
        // Guardar histórico
        localStorage.setItem(STORAGE_KEYS.HISTORIAL, JSON.stringify(AppState.historial));
        
        // Guardar estadísticas
        localStorage.setItem(STORAGE_KEYS.ESTADISTICAS, JSON.stringify(AppState.estadisticas));
        
        // Guardar configuración (excluyendo combinaciones actuales)
        const configData = {
            tema: AppState.tema,
            ultimoJuego: document.getElementById('juego').value
        };
        localStorage.setItem(STORAGE_KEYS.CONFIG, JSON.stringify(configData));
        
        console.log('Datos guardados correctamente');
    } catch (error) {
        console.error('Error al guardar datos:', error);
        mostrarNotificacion('error', 'Error al guardar datos en el almacenamiento local');
    }
}

/**
 * Carga todos los datos de la aplicación desde localStorage
 */
function cargarDatos() {
    try {
        // Cargar histórico
        const historialData = localStorage.getItem(STORAGE_KEYS.HISTORIAL);
        if (historialData) {
            AppState.historial = JSON.parse(historialData);
            AppState.estadisticas.totalLotes = AppState.historial.length;
        }
        
        // Cargar estadísticas
        const estadisticasData = localStorage.getItem(STORAGE_KEYS.ESTADISTICAS);
        if (estadisticasData) {
            const savedStats = JSON.parse(estadisticasData);
            // Mantener las estadísticas cargadas pero actualizar totalLotes
            savedStats.totalLotes = AppState.estadisticas.totalLotes;
            AppState.estadisticas = { ...AppState.estadisticas, ...savedStats };
        }
        
        // Cargar configuración
        const configData = localStorage.getItem(STORAGE_KEYS.CONFIG);
        if (configData) {
            const config = JSON.parse(configData);
            AppState.tema = config.tema || 'light';
            
            // Establecer último juego usado
            const juegoSelect = document.getElementById('juego');
            if (config.ultimoJuego && juegoSelect.querySelector(`option[value="${config.ultimoJuego}"]`)) {
                juegoSelect.value = config.ultimoJuego;
            }
        }
        
        console.log('Datos cargados correctamente');
    } catch (error) {
        console.error('Error al cargar datos:', error);
        // Si hay error, limpiar datos corruptos
        limpiarDatosCorruptos();
    }
}

/**
 * Limpia datos corruptos del almacenamiento
 */
function limpiarDatosCorruptos() {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
    
    mostrarNotificacion('warning', 'Se limpiaron datos corruptos. Reiniciando aplicación...');
    
    // Reiniciar estado de la aplicación
    setTimeout(() => {
        location.reload();
    }, 2000);
}

/**
 * Exporta el histórico a un archivo JSON
 */
function exportarHistorial() {
    if (AppState.historial.length === 0) {
        mostrarNotificacion('warning', 'No hay histórico para exportar');
        return;
    }
    
    try {
        const data = {
            version: CONFIG.version,
            fechaExportacion: new Date().toISOString(),
            totalLotes: AppState.historial.length,
            historial: AppState.historial
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `historico_combinaciones_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        mostrarNotificacion('success', 'Histórico exportado correctamente');
    } catch (error) {
        console.error('Error al exportar histórico:', error);
        mostrarNotificacion('error', 'Error al exportar el histórico');
    }
}

/**
 * Importa el histórico desde un archivo JSON
 */
function importarHistorial() {
    const input = document.getElementById('import-file');
    if (!input.files.length) return;
    
    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validar estructura del archivo
            if (!data.historial || !Array.isArray(data.historial)) {
                throw new Error('Formato de archivo inválido');
            }
            
            // Mostrar confirmación
            if (!confirm(`¿Importar ${data.historial.length} lotes del histórico?`)) {
                input.value = '';
                return;
            }
            
            // Agregar historial importado
            AppState.historial.unshift(...data.historial);
            AppState.estadisticas.totalLotes += data.historial.length;
            
            // Limitar tamaño máximo
            if (AppState.historial.length > CONFIG.maxHistorial) {
                AppState.historial = AppState.historial.slice(0, CONFIG.maxHistorial);
            }
            
            guardarDatos();
            mostrarNotificacion('success', `${data.historial.length} lotes importados correctamente`);
            
            // Actualizar UI si el modal está abierto
            if (!document.getElementById('historico-modal').hidden) {
                cargarContenidoHistorico();
            }
            
        } catch (error) {
            console.error('Error al importar histórico:', error);
            mostrarNotificacion('error', 'Error al importar el archivo. Verifica el formato.');
        }
        
        input.value = '';
    };
    
    reader.onerror = function() {
        mostrarNotificacion('error', 'Error al leer el archivo');
        input.value = '';
    };
    
    reader.readAsText(file);
}

/**
 * Limpia todo el histórico
 */
function limpiarHistorial() {
    if (AppState.historial.length === 0) return;
    
    if (!confirm('¿Estás seguro de que quieres limpiar todo el histórico? Esta acción no se puede deshacer.')) {
        return;
    }
    
    AppState.historial = [];
    AppState.estadisticas.totalLotes = 0;
    
    guardarDatos();
    
    // Actualizar UI
    cargarContenidoHistorico();
    actualizarUIEstadisticas();
    
    mostrarNotificacion('info', 'Histórico limpiado correctamente');
}

/**
 * Realiza una copia de seguridad automática
 */
function realizarBackupAutomatico() {
    if (AppState.historial.length === 0) return;
    
    try {
        const backupData = {
            version: CONFIG.version,
            fechaBackup: new Date().toISOString(),
            historial: AppState.historial.slice(0, 50) // Solo últimos 50 lotes
        };
        
        localStorage.setItem('backup_automatico', JSON.stringify(backupData));
        console.log('Backup automático realizado');
    } catch (error) {
        console.error('Error en backup automático:', error);
    }
}

/**
 * Restaura desde el backup automático si es necesario
 */
function restaurarBackupSiNecesario() {
    try {
        const backupData = localStorage.getItem('backup_automatico');
        if (!backupData) return;
        
        const backup = JSON.parse(backupData);
        
        // Solo restaurar si no hay datos actuales
        if (AppState.historial.length === 0 && backup.historial) {
            AppState.historial = backup.historial;
            AppState.estadisticas.totalLotes = backup.historial.length;
            console.log('Datos restaurados desde backup automático');
        }
    } catch (error) {
        console.error('Error al restaurar backup:', error);
    }
}

// Realizar backup automático cada 5 minutos
setInterval(realizarBackupAutomatico, 5 * 60 * 1000);

// Guardar datos antes de cerrar la página
window.addEventListener('beforeunload', guardarDatos);

// Exportar funciones
window.guardarDatos = guardarDatos;
window.exportarHistorial = exportarHistorial;
window.importarHistorial = importarHistorial;
window.limpiarHistorial = limpiarHistorial;