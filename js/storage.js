// Módulo de almacenamiento y persistencia

const STORAGE_KEYS = {
    HISTORIAL: 'generador_combinaciones_historial_v2',
    ESTADISTICAS: 'generador_combinaciones_estadisticas_v2',
    CONFIG: 'generador_combinaciones_config_v2'
};

/**
 * Guarda todos los datos de la aplicación en localStorage
 */
function guardarDatos() {
    try {
        // Guardar histórico
        const historialParaGuardar = AppState.historial.map(lote => ({
            ...lote,
            // Asegurarse de que solo guardamos datos esenciales
            combinaciones: lote.combinaciones.map(comb => ({
                numeros: comb.numeros,
                superBalota: comb.superBalota,
                colores: comb.colores,
                colorNumeros: comb.colorNumeros,
                puntuacion: comb.puntuacion,
                probabilidad: comb.probabilidad
            }))
        }));
        
        localStorage.setItem(STORAGE_KEYS.HISTORIAL, JSON.stringify(historialParaGuardar));
        
        // Guardar estadísticas
        const estadisticasParaGuardar = {
            totalGeneradas: AppState.estadisticas.totalGeneradas,
            totalLotes: AppState.estadisticas.totalLotes,
            frecuenciaNumeros: AppState.estadisticas.frecuenciaNumeros
        };
        localStorage.setItem(STORAGE_KEYS.ESTADISTICAS, JSON.stringify(estadisticasParaGuardar));
        
        // Guardar configuración
        const configData = {
            tema: AppState.tema,
            ultimoJuego: document.getElementById('juego').value,
            version: CONFIG.version
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
            const historialParseado = JSON.parse(historialData);
            
            // Restaurar IDs y timestamps si faltan (para compatibilidad)
            AppState.historial = historialParseado.map(lote => ({
                ...lote,
                id: lote.id || Date.now() + Math.random(),
                fecha: lote.fecha || new Date().toISOString(),
                combinaciones: lote.combinaciones.map(comb => ({
                    ...comb,
                    id: comb.id || Date.now() + Math.random(),
                    timestamp: comb.timestamp || Date.now()
                }))
            }));
            
            AppState.estadisticas.totalLotes = AppState.historial.length;
        }
        
        // Cargar estadísticas
        const estadisticasData = localStorage.getItem(STORAGE_KEYS.ESTADISTICAS);
        if (estadisticasData) {
            const savedStats = JSON.parse(estadisticasData);
            // Mezclar con estadísticas actuales
            AppState.estadisticas = {
                ...AppState.estadisticas,
                ...savedStats,
                totalLotes: AppState.estadisticas.totalLotes // Mantener el total de lotes actual
            };
        }
        
        // Cargar configuración
        const configData = localStorage.getItem(STORAGE_KEYS.CONFIG);
        if (configData) {
            const config = JSON.parse(configData);
            AppState.tema = config.tema || 'light';
            
            // Verificar compatibilidad de versión
            if (config.version && config.version !== CONFIG.version) {
                console.log(`Actualizando de versión ${config.version} a ${CONFIG.version}`);
                // Podrías agregar lógica de migración aquí si es necesario
            }
            
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
    
    // También limpiar versiones antiguas por compatibilidad
    ['generador_combinaciones_historial', 'generador_combinaciones_estadisticas', 'generador_combinaciones_config']
        .forEach(key => localStorage.removeItem(key));
    
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
            historial: AppState.historial.map(lote => ({
                ...lote,
                // Limpiar datos para exportación
                combinaciones: lote.combinaciones.map(comb => ({
                    numeros: comb.numeros,
                    superBalota: comb.superBalota,
                    colores: comb.colores,
                    colorNumeros: comb.colorNumeros,
                    puntuacion: comb.puntuacion,
                    probabilidad: comb.probabilidad
                }))
            }))
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
    if (file.size > 10 * 1024 * 1024) { // 10MB límite
        mostrarNotificacion('error', 'El archivo es demasiado grande (máximo 10MB)');
        input.value = '';
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // Validar estructura del archivo
            if (!data.historial || !Array.isArray(data.historial)) {
                throw new Error('Formato de archivo inválido: falta el campo "historial"');
            }
            
            // Verificar versión
            if (data.version && data.version !== CONFIG.version) {
                if (!confirm(`Este archivo fue creado con la versión ${data.version}. 
                La versión actual es ${CONFIG.version}. ¿Deseas continuar con la importación?`)) {
                    input.value = '';
                    return;
                }
            }
            
            // Mostrar confirmación
            if (!confirm(`¿Importar ${data.historial.length} lotes del histórico?\n\nEsta acción agregará los nuevos lotes al histórico existente.`)) {
                input.value = '';
                return;
            }
            
            // Procesar y validar cada lote
            const lotesValidos = data.historial.filter(lote => {
                return lote.combinaciones && 
                       Array.isArray(lote.combinaciones) && 
                       lote.combinaciones.length > 0 &&
                       lote.juego && 
                       ['baloto', 'mi-loto', 'color-loto'].includes(lote.juego);
            });
            
            if (lotesValidos.length === 0) {
                throw new Error('No se encontraron lotes válidos en el archivo');
            }
            
            // Agregar historial importado con IDs únicos
            const lotesConIds = lotesValidos.map(lote => ({
                ...lote,
                id: Date.now() + Math.random(),
                fecha: lote.fecha || new Date().toISOString(),
                combinaciones: lote.combinaciones.map(comb => ({
                    ...comb,
                    id: Date.now() + Math.random(),
                    timestamp: Date.now()
                }))
            }));
            
            AppState.historial.unshift(...lotesConIds);
            AppState.estadisticas.totalLotes += lotesConIds.length;
            
            // Limitar tamaño máximo
            if (AppState.historial.length > CONFIG.maxHistorial) {
                AppState.historial = AppState.historial.slice(0, CONFIG.maxHistorial);
                mostrarNotificacion('warning', `Solo se mantuvieron los primeros ${CONFIG.maxHistorial} lotes`);
            }
            
            guardarDatos();
            mostrarNotificacion('success', `${lotesConIds.length} lotes importados correctamente`);
            
            // Actualizar estadísticas
            if (typeof actualizarEstadisticas === 'function') {
                actualizarEstadisticas();
            }
            
            // Actualizar UI del modal si está abierto
            const modal = document.getElementById('historico-modal');
            if (modal && !modal.hidden) {
                // Intentar usar la función de UI si está disponible
                if (typeof cargarContenidoHistorico === 'function') {
                    cargarContenidoHistorico();
                } else if (typeof cargarContenidoHistoricoSimple === 'function') {
                    cargarContenidoHistoricoSimple();
                }
            }
            
        } catch (error) {
            console.error('Error al importar histórico:', error);
            mostrarNotificacion('error', `Error al importar: ${error.message}`);
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
    
    if (!confirm('¿Estás seguro de que quieres limpiar todo el histórico?\n\nEsta acción no se puede deshacer y eliminará todas las combinaciones guardadas.')) {
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
            historial: AppState.historial.slice(0, 50).map(lote => ({
                ...lote,
                combinaciones: lote.combinaciones.slice(0, 5) // Solo primeras 5 combinaciones por lote
            }))
        };
        
        localStorage.setItem('backup_automatico_v2', JSON.stringify(backupData));
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
        const backupData = localStorage.getItem('backup_automatico_v2');
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