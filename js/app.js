// Configuración global de la aplicación
const CONFIG = {
    version: '1.0.0',
    maxCombinaciones: 100,
    maxHistorial: 1000,
    juegos: {
        baloto: {
            nombre: 'Baloto',
            numeros: 5,
            minNumero: 1,
            maxNumero: 43,
            superBalota: true,
            minSuperBalota: 1,
            maxSuperBalota: 16,
            descripcion: '5 números del 1 al 43 + 1 Super Balota del 1 al 16'
        },
        'mi-loto': {
            nombre: 'Mi Loto',
            numeros: 5,
            minNumero: 1,
            maxNumero: 39,
            superBalota: false,
            descripcion: '5 números del 1 al 39'
        },
        'color-loto': {
            nombre: 'Color Loto',
            numeros: 6,
            minNumero: 1,
            maxNumero: 7,
            superBalota: false,
            colores: true,
            coloresDisponibles: ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'],
            descripcion: '6 colores diferentes, cada uno con un número del 1 al 7'
        }
    }
};

// Estado de la aplicación
const AppState = {
    combinaciones: [],
    historial: [],
    estadisticas: {
        totalGeneradas: 0,
        totalLotes: 0,
        frecuenciaNumeros: {},
        probabilidadAcumulada: 0
    },
    config: CONFIG,
    tema: localStorage.getItem('tema') || 'light'
};

// Inicialización de la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplicación iniciando...');
    
    try {
        // Cargar datos guardados
        if (typeof cargarDatos === 'function') {
            cargarDatos();
        }
        
        // Aplicar tema
        if (typeof aplicarTema === 'function') {
            aplicarTema(AppState.tema);
        } else {
            aplicarTemaSimple(AppState.tema);
        }
        
        // Inicializar UI
        inicializarUI();
        
        // Inicializar eventos
        inicializarEventos();
        
        // Mostrar reglas del juego actual
        if (typeof mostrarReglasJuego === 'function') {
            mostrarReglasJuego();
        } else {
            mostrarReglasJuegoSimple();
        }
        
        console.log('✅ Aplicación inicializada correctamente');
        
    } catch (error) {
        console.error('❌ Error al inicializar la aplicación:', error);
        // Intentar cargar versión simple
        cargarVersionSimple();
    }
});

function aplicarTemaSimple(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
    
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = tema === 'light' ? '🌙' : '☀️';
    }
}

function mostrarReglasJuegoSimple() {
    const juego = document.getElementById('juego').value;
    const reglasContenido = document.getElementById('reglas-contenido');
    
    if (!reglasContenido) return;
    
    let reglasHTML = '';
    
    if (juego === 'baloto') {
        reglasHTML = `
            <p><strong>Baloto:</strong></p>
            <ul>
                <li>Selecciona 5 números diferentes del 1 al 43</li>
                <li>Selecciona 1 Super Balota del 1 al 16</li>
                <li>Total: 5 números + 1 Super Balota</li>
                <li>Combinaciones posibles: 130,321,920</li>
            </ul>
        `;
    } else if (juego === 'mi-loto') {
        reglasHTML = `
            <p><strong>Mi Loto:</strong></p>
            <ul>
                <li>Selecciona 5 números diferentes del 1 al 39</li>
                <li>No hay Super Balota en este juego</li>
                <li>Total: 5 números</li>
                <li>Combinaciones posibles: 575,757</li>
            </ul>
        `;
    } else if (juego === 'color-loto') {
        reglasHTML = `
            <p><strong>Color Loto:</strong></p>
            <ul>
                <li>Selecciona 6 colores diferentes de: amarillo, azul, rojo, verde, blanco, negro</li>
                <li>A cada color se le asigna un número del 1 al 7</li>
                <li>Los números pueden repetirse entre diferentes colores</li>
                <li>Total: 6 colores + 6 números (uno por cada color)</li>
                <li>Combinaciones posibles: 84,707,280</li>
            </ul>
        `;
    }
    
    reglasContenido.innerHTML = reglasHTML;
}

function inicializarUI() {
    // Actualizar versión en el footer
    const versionElement = document.querySelector('.version');
    if (versionElement) {
        versionElement.textContent = `v${CONFIG.version}`;
    }
    
    // Verificar que elementos existan
    console.log('Elementos encontrados:');
    console.log('- Juego select:', document.getElementById('juego'));
    console.log('- Generar button:', document.getElementById('generar'));
    console.log('- Tabla cuerpo:', document.getElementById('cuerpo-tabla'));
    
    // Aplicar clases iniciales
    actualizarClasesJuegoSimple();
}

function actualizarClasesJuegoSimple() {
    const juego = document.getElementById('juego').value;
    document.body.classList.remove('baloto-mode', 'mi-loto-mode', 'color-loto-mode');
    document.body.classList.add(`${juego}-mode`);
}

function manejarCambioJuegoSimple() {
    // Limpiar combinaciones actuales sin confirmación
    if (AppState.combinaciones.length > 0) {
        AppState.combinaciones = [];
        actualizarTablaSimple();
        actualizarEstadisticasSimple();
        mostrarNotificacionSimple('info', 'Resultados limpiados al cambiar tipo de juego');
    }
    
    // Actualizar reglas y clases visuales
    mostrarReglasJuegoSimple();
    actualizarClasesJuegoSimple();
}

function inicializarEventos() {
    console.log('Inicializando eventos...');
    
    // Controles principales
    const juegoSelect = document.getElementById('juego');
    if (juegoSelect) {
        juegoSelect.addEventListener('change', function() {
            if (typeof manejarCambioJuego === 'function') {
                manejarCambioJuego();
            } else {
                manejarCambioJuegoSimple();
            }
        });
    }
    
    const generarBtn = document.getElementById('generar');
    if (generarBtn) {
        generarBtn.addEventListener('click', function() {
            if (typeof generarCombinaciones === 'function') {
                generarCombinaciones();
            } else {
                generarCombinacionesSimple();
            }
        });
    }
    
    const guardarBtn = document.getElementById('guardar');
    if (guardarBtn) {
        guardarBtn.addEventListener('click', function() {
            if (typeof guardarEnHistorial === 'function') {
                guardarEnHistorial();
            } else {
                guardarEnHistorialSimple();
            }
        });
    }
    
    const seleccionarMejoresBtn = document.getElementById('seleccionar-mejores');
    if (seleccionarMejoresBtn) {
        seleccionarMejoresBtn.addEventListener('click', function() {
            if (typeof seleccionarMejores === 'function') {
                seleccionarMejores();
            } else {
                seleccionarMejoresSimple();
            }
        });
    }
    
    const eliminarBtn = document.getElementById('eliminar-seleccionados');
    if (eliminarBtn) {
        eliminarBtn.addEventListener('click', function() {
            if (typeof eliminarSeleccionadas === 'function') {
                eliminarSeleccionadas();
            } else {
                eliminarSeleccionadasSimple();
            }
        });
    }
    
    const limpiarBtn = document.getElementById('limpiar');
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', function() {
            if (typeof limpiarCombinaciones === 'function') {
                limpiarCombinaciones();
            } else {
                limpiarCombinacionesSimple();
            }
        });
    }
    
    const seleccionarTodasCheck = document.getElementById('seleccionar-todas');
    if (seleccionarTodasCheck) {
        seleccionarTodasCheck.addEventListener('change', function(e) {
            if (typeof manejarSeleccionTodas === 'function') {
                manejarSeleccionTodas(e);
            } else {
                manejarSeleccionTodasSimple(e);
            }
        });
    }
    
    // Estadísticas
    const limpiarStatsBtn = document.getElementById('limpiar-estadisticas');
    if (limpiarStatsBtn) {
        limpiarStatsBtn.addEventListener('click', function() {
            if (typeof limpiarEstadisticas === 'function') {
                limpiarEstadisticas();
            } else {
                limpiarEstadisticasSimple();
            }
        });
    }
    
    // Tema
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            const nuevoTema = AppState.tema === 'light' ? 'dark' : 'light';
            aplicarTemaSimple(nuevoTema);
            AppState.tema = nuevoTema;
        });
    }
    
    // Histórico
    const verHistorialBtn = document.getElementById('ver-historial');
    if (verHistorialBtn) {
        verHistorialBtn.addEventListener('click', function() {
            if (typeof mostrarHistorial === 'function') {
                mostrarHistorial();
            } else {
                mostrarHistorialSimple();
            }
        });
    }
    
    const cerrarHistorialBtn = document.getElementById('cerrar-historico');
    if (cerrarHistorialBtn) {
        cerrarHistorialBtn.addEventListener('click', function() {
            if (typeof cerrarHistorial === 'function') {
                cerrarHistorial();
            } else {
                cerrarHistorialSimple();
            }
        });
    }
    
    // Botones del modal de histórico
    const exportHistoricoBtn = document.getElementById('export-historico');
    if (exportHistoricoBtn) {
        exportHistoricoBtn.addEventListener('click', function() {
            if (typeof exportarHistorial === 'function') {
                exportarHistorial();
            } else {
                mostrarNotificacionSimple('error', 'Función de exportar no disponible');
            }
        });
    }
    
    const importHistoricoBtn = document.getElementById('import-historico');
    if (importHistoricoBtn) {
        importHistoricoBtn.addEventListener('click', function() {
            const fileInput = document.getElementById('import-file');
            if (fileInput) {
                fileInput.click();
            }
        });
    }
    
    const importFileInput = document.getElementById('import-file');
    if (importFileInput) {
        importFileInput.addEventListener('change', function() {
            if (typeof importarHistorial === 'function') {
                importarHistorial();
            } else {
                mostrarNotificacionSimple('error', 'Función de importar no disponible');
            }
        });
    }
    
    const limpiarHistoricoBtn = document.getElementById('limpiar-historico');
    if (limpiarHistoricoBtn) {
        limpiarHistoricoBtn.addEventListener('click', function() {
            if (typeof limpiarHistorial === 'function') {
                limpiarHistorial();
            } else {
                limpiarHistorialSimple();
            }
        });
    }
    
    // Cerrar modal con overlay
    const modalOverlay = document.querySelector('.modal-overlay');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function() {
            if (typeof cerrarHistorial === 'function') {
                cerrarHistorial();
            } else {
                cerrarHistorialSimple();
            }
        });
    }
    
    console.log('✅ Eventos inicializados');
}

// Funciones simples de respaldo
function generarCombinacionesSimple() {
    const juego = document.getElementById('juego').value;
    const cantidad = parseInt(document.getElementById('combinaciones').value);
    
    if (isNaN(cantidad) || cantidad < 1 || cantidad > CONFIG.maxCombinaciones) {
        mostrarNotificacionSimple('error', `Ingresa un número entre 1 y ${CONFIG.maxCombinaciones}`);
        return;
    }
    
    const configJuego = CONFIG.juegos[juego];
    const nuevasCombinaciones = [];
    
    for (let i = 0; i < cantidad; i++) {
        const combinacion = generarCombinacionSimple(configJuego, juego);
        nuevasCombinaciones.push(combinacion);
    }
    
    AppState.combinaciones.push(...nuevasCombinaciones);
    AppState.estadisticas.totalGeneradas += nuevasCombinaciones.length;
    
    actualizarTablaSimple();
    actualizarEstadisticasSimple();
    mostrarNotificacionSimple('success', `${cantidad} combinación(es) generada(s) correctamente`);
}

function generarCombinacionSimple(config, juego) {
    const combinacion = {
        id: Date.now() + Math.random(),
        numeros: [],
        superBalota: null,
        colores: [],
        colorNumeros: [],
        puntuacion: 0,
        probabilidad: 0,
        timestamp: Date.now(),
        selected: false
    };
    
    if (juego === 'color-loto') {
        // COLOR LOTO
        const coloresDisponibles = [...config.coloresDisponibles];
        for (let i = coloresDisponibles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [coloresDisponibles[i], coloresDisponibles[j]] = [coloresDisponibles[j], coloresDisponibles[i]];
        }
        
        // Tomar los primeros 6 colores y ordenarlos según el patrón
        const coloresSeleccionados = coloresDisponibles.slice(0, 6);
        const ordenColores = ['amarillo', 'azul', 'rojo', 'verde', 'blanco', 'negro'];
        combinacion.colores = coloresSeleccionados.sort((a, b) => {
            return ordenColores.indexOf(a) - ordenColores.indexOf(b);
        });
        
        combinacion.colorNumeros = combinacion.colores.map(() => Math.floor(Math.random() * 7) + 1);
        combinacion.numeros = [...combinacion.colorNumeros];
        
    } else {
        // BALOTO y MI LOTO
        while (combinacion.numeros.length < config.numeros) {
            const numero = Math.floor(Math.random() * (config.maxNumero - config.minNumero + 1)) + config.minNumero;
            if (!combinacion.numeros.includes(numero)) {
                combinacion.numeros.push(numero);
            }
        }
        combinacion.numeros.sort((a, b) => a - b);
        
        if (config.superBalota) {
            combinacion.superBalota = Math.floor(Math.random() * 
                (config.maxSuperBalota - config.minSuperBalota + 1)) + config.minSuperBalota;
        }
    }
    
    // Calcular puntuación simple
    let puntuacion = 50;
    if (combinacion.numeros) {
        const pares = combinacion.numeros.filter(n => n % 2 === 0).length;
        const impares = combinacion.numeros.length - pares;
        puntuacion += (combinacion.numeros.length - Math.abs(pares - impares)) * 5;
    }
    combinacion.puntuacion = Math.min(100, Math.max(0, puntuacion));
    
    // Calcular probabilidad simple
    combinacion.probabilidad = Math.random() * 0.000001;
    
    return combinacion;
}

function mostrarNotificacionSimple(tipo, mensaje, duracion = 3000) {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) {
        // Crear área de notificaciones si no existe
        const area = document.createElement('div');
        area.id = 'notification-area';
        area.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
        document.body.appendChild(area);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.style.cssText = `
        padding: 12px 16px;
        border-radius: 4px;
        color: white;
        font-weight: bold;
        margin-bottom: 8px;
        animation: slideIn 0.3s ease-out;
    `;
    
    if (tipo === 'success') notification.style.background = '#2ecc71';
    else if (tipo === 'error') notification.style.background = '#e74c3c';
    else if (tipo === 'warning') notification.style.background = '#f39c12';
    else notification.style.background = '#3498db';
    
    notification.textContent = mensaje;
    notificationArea.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, duracion);
}

function actualizarTablaSimple() {
    const tbody = document.getElementById('cuerpo-tabla');
    if (!tbody) return;
    
    if (AppState.combinaciones.length === 0) {
        tbody.innerHTML = `
            <tr class="empty-state">
                <td colspan="7">
                    <div class="empty-message">
                        <p>No hay combinaciones generadas aún.</p>
                        <p>Haz clic en "Generar Combinaciones" para comenzar.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    const juego = document.getElementById('juego').value;
    const config = CONFIG.juegos[juego];
    
    const rows = AppState.combinaciones.map((combinacion, index) => {
        let numerosHTML = '';
        if (juego === 'color-loto') {
            numerosHTML = combinacion.colores.map((color, idx) => {
                const numero = combinacion.colorNumeros ? combinacion.colorNumeros[idx] : '?';
                const colorMap = {
                    amarillo: '#f4c430',
                    azul: '#003d7a',
                    rojo: '#dc3545',
                    verde: '#28a745',
                    blanco: '#f8f9fa',
                    negro: '#212529'
                };
                return `
                    <div style="display: inline-flex; flex-direction: column; align-items: center; margin: 3px;">
                        <div class="number-ball" style="background: ${colorMap[color] || '#666'}; color: ${color === 'amarillo' || color === 'blanco' ? '#000' : 'white'}; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; border: ${color === 'blanco' ? '1px solid #ccc' : 'none'}">
                            ${color.charAt(0).toUpperCase()}
                        </div>
                        <small class="color-number" style="font-size: 10px; font-weight: bold; margin-top: 2px;">${numero}</small>
                    </div>
                `;
            }).join('');
        } else {
            numerosHTML = combinacion.numeros.map(num => {
                const esBaloto = juego === 'baloto';
                return `
                    <div class="number-ball" style="background: ${esBaloto ? '#FFD700' : '#003d7a'}; color: ${esBaloto ? '#000' : 'white'}; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin: 3px;">
                        ${num}
                    </div>
                `;
            }).join('');
        }
        
        let extraHTML = '';
        if (juego === 'baloto' && combinacion.superBalota) {
            extraHTML = `
                <div class="number-ball" style="background: #DC143C; color: white; width: 40px; height: 40px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font-weight: bold; margin: 3px;">
                    ${combinacion.superBalota}
                </div>
            `;
        }
        
        return `
            <tr style="${combinacion.selected ? 'background: #d4edff;' : ''}">
                <td style="text-align: center;">
                    <input type="checkbox" class="combinacion-checkbox" 
                           data-id="${combinacion.id}" 
                           ${combinacion.selected ? 'checked' : ''}
                           style="width: 18px; height: 18px;">
                </td>
                <td style="text-align: center; font-weight: bold;">${index + 1}</td>
                <td>
                    <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 3px;">
                        ${numerosHTML}
                    </div>
                </td>
                <td class="${juego === 'baloto' ? '' : 'hidden'}" style="text-align: center;">${extraHTML}</td>
                <td class="${juego === 'color-loto' ? '' : 'hidden'}" style="text-align: center;">${extraHTML}</td>
                <td>
                    <div style="background: #e0e0e0; border-radius: 4px; height: 8px; width: 100%; margin-bottom: 4px;">
                        <div style="background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #1dd1a1); 
                                    border-radius: 4px; height: 100%; width: ${combinacion.puntuacion}%;"></div>
                    </div>
                    ${combinacion.puntuacion}%
                </td>
                <td>${combinacion.probabilidad.toFixed(8)}%</td>
            </tr>
        `;
    }).join('');
    
    tbody.innerHTML = rows;
    
    // Agregar eventos a los checkboxes
    tbody.querySelectorAll('.combinacion-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const id = this.dataset.id;
            const combinacion = AppState.combinaciones.find(c => c.id == id);
            if (combinacion) {
                combinacion.selected = this.checked;
                this.closest('tr').style.background = this.checked ? '#d4edff' : '';
            }
        });
    });
}

function actualizarEstadisticasSimple() {
    const totalElement = document.getElementById('total-combinaciones');
    if (totalElement) {
        totalElement.textContent = AppState.estadisticas.totalGeneradas;
    }
    
    const lotesElement = document.getElementById('total-lotes');
    if (lotesElement) {
        lotesElement.textContent = AppState.estadisticas.totalLotes;
    }
    
    // Calcular número más frecuente
    const frecuencia = {};
    AppState.combinaciones.forEach(combinacion => {
        combinacion.numeros.forEach(numero => {
            frecuencia[numero] = (frecuencia[numero] || 0) + 1;
        });
    });
    
    let maxNumero = '-';
    let maxFrecuencia = 0;
    Object.entries(frecuencia).forEach(([numero, freq]) => {
        if (freq > maxFrecuencia) {
            maxFrecuencia = freq;
            maxNumero = numero;
        }
    });
    
    const frecuenciaElement = document.getElementById('mejor-frecuencia');
    if (frecuenciaElement) {
        frecuenciaElement.textContent = maxNumero !== '-' ? `${maxNumero} (${maxFrecuencia} veces)` : '-';
    }
    
    // Calcular probabilidad promedio
    if (AppState.combinaciones.length > 0) {
        const promedio = AppState.combinaciones.reduce((sum, c) => sum + c.probabilidad, 0) / AppState.combinaciones.length;
        const probElement = document.getElementById('probabilidad-promedio');
        if (probElement) {
            probElement.textContent = promedio.toFixed(8) + '%';
        }
    }
}

function guardarEnHistorialSimple() {
    if (AppState.combinaciones.length === 0) {
        mostrarNotificacionSimple('warning', 'No hay combinaciones para guardar');
        return;
    }
    
    const lote = {
        id: Date.now(),
        fecha: new Date().toISOString(),
        juego: document.getElementById('juego').value,
        combinaciones: [...AppState.combinaciones]
    };
    
    AppState.historial.unshift(lote);
    AppState.estadisticas.totalLotes++;
    
    if (AppState.historial.length > CONFIG.maxHistorial) {
        AppState.historial.pop();
    }
    
    // Guardar en localStorage
    try {
        localStorage.setItem('generador_combinaciones_historial', JSON.stringify(AppState.historial));
        localStorage.setItem('generador_combinaciones_estadisticas', JSON.stringify(AppState.estadisticas));
    } catch (e) {
        console.error('Error al guardar en localStorage:', e);
    }
    
    mostrarNotificacionSimple('success', 'Combinaciones guardadas en el histórico');
}

function seleccionarMejoresSimple() {
    if (AppState.combinaciones.length === 0) {
        mostrarNotificacionSimple('warning', 'No hay combinaciones para seleccionar');
        return;
    }
    
    const total = AppState.combinaciones.length;
    let cantidadASeleccionar;
    
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
    
    AppState.combinaciones.forEach(c => c.selected = false);
    
    const mejores = [...AppState.combinaciones]
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, cantidadASeleccionar);
    
    mejores.forEach(combinacion => {
        combinacion.selected = true;
    });
    
    actualizarTablaSimple();
    
    const porcentaje = ((cantidadASeleccionar / total) * 100).toFixed(1);
    mostrarNotificacionSimple('success', 
        `${cantidadASeleccionar} mejores combinaciones seleccionadas (top ${porcentaje}%)`
    );
}

function eliminarSeleccionadasSimple() {
    const seleccionadas = AppState.combinaciones.filter(c => c.selected);
    
    if (seleccionadas.length === 0) {
        mostrarNotificacionSimple('warning', 'No hay combinaciones seleccionadas para eliminar');
        return;
    }
    
    AppState.combinaciones = AppState.combinaciones.filter(c => !c.selected);
    actualizarTablaSimple();
    actualizarEstadisticasSimple();
    
    mostrarNotificacionSimple('info', `${seleccionadas.length} combinación(es) eliminada(s)`);
}

function limpiarCombinacionesSimple() {
    if (AppState.combinaciones.length === 0) return;
    
    if (confirm('¿Estás seguro de que quieres limpiar todas las combinaciones?')) {
        AppState.combinaciones = [];
        actualizarTablaSimple();
        actualizarEstadisticasSimple();
        mostrarNotificacionSimple('info', 'Todas las combinaciones han sido eliminadas');
    }
}

function manejarSeleccionTodasSimple(e) {
    const checked = e.target.checked;
    AppState.combinaciones.forEach(combinacion => {
        combinacion.selected = checked;
    });
    
    actualizarTablaSimple();
}

function limpiarEstadisticasSimple() {
    if (AppState.combinaciones.length === 0 && AppState.estadisticas.totalGeneradas === 0) return;
    
    if (confirm('¿Estás seguro de que quieres limpiar todas las estadísticas?')) {
        AppState.estadisticas = {
            totalGeneradas: 0,
            totalLotes: 0,
            frecuenciaNumeros: {},
            probabilidadAcumulada: 0
        };
        AppState.combinaciones = [];
        actualizarTablaSimple();
        actualizarEstadisticasSimple();
        mostrarNotificacionSimple('info', 'Estadísticas limpiadas correctamente');
    }
}

function mostrarHistorialSimple() {
    const modal = document.getElementById('historico-modal');
    if (!modal) return;
    
    modal.hidden = false;
    modal.style.display = 'flex';
    
    // Cargar contenido del histórico
    cargarContenidoHistoricoSimple();
}

function cerrarHistorialSimple() {
    const modal = document.getElementById('historico-modal');
    if (!modal) return;
    
    modal.hidden = true;
    modal.style.display = 'none';
}

function cargarContenidoHistoricoSimple() {
    const contenido = document.getElementById('historico-contenido');
    if (!contenido) return;
    
    if (AppState.historial.length === 0) {
        contenido.innerHTML = `
            <div class="empty-message">
                <p>No hay histórico disponible.</p>
                <p>Genera combinaciones y guárdalas para verlas aquí.</p>
            </div>
        `;
        return;
    }
    
    const historicoHTML = AppState.historial.map(lote => {
        const juegoNombre = CONFIG.juegos[lote.juego].nombre;
        const fecha = new Date(lote.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div style="background: white; padding: 16px; border-radius: 8px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="margin: 0;">${juegoNombre}</h3>
                    <div style="display: flex; gap: 8px;">
                        <span style="background: #6c757d; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">
                            ${fecha}
                        </span>
                        <span style="background: #2ecc71; color: white; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem;">
                            ${lote.combinaciones.length} combinaciones
                        </span>
                    </div>
                </div>
                <div>
                    ${lote.combinaciones.slice(0, 2).map(combinacion => {
                        if (lote.juego === 'color-loto') {
                            return `
                                <div style="display: flex; gap: 4px; margin-bottom: 8px;">
                                    ${combinacion.colores.slice(0, 3).map(color => 
                                        `<div style="width: 25px; height: 25px; border-radius: 50%; background: ${
                                            color === 'amarillo' ? '#f4c430' :
                                            color === 'azul' ? '#003d7a' :
                                            color === 'rojo' ? '#dc3545' :
                                            color === 'verde' ? '#28a745' :
                                            color === 'blanco' ? '#f8f9fa' : '#212529'
                                        }; display: flex; align-items: center; justify-content: center; font-weight: bold; color: ${
                                            color === 'amarillo' || color === 'blanco' ? '#000' : 'white'
                                        }; border: ${color === 'blanco' ? '1px solid #ccc' : 'none'}">
                                            ${color.charAt(0).toUpperCase()}
                                        </div>`
                                    ).join('')}
                                    <span style="background: #17a2b8; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">
                                        +${combinacion.colores.length - 3} más
                                    </span>
                                </div>
                            `;
                        } else {
                            return `
                                <div style="display: flex; gap: 4px; margin-bottom: 8px;">
                                    ${combinacion.numeros.slice(0, 3).map(num => 
                                        `<div style="width: 25px; height: 25px; border-radius: 50%; background: ${lote.juego === 'baloto' ? '#FFD700' : '#003d7a'}; color: ${lote.juego === 'baloto' ? '#000' : 'white'}; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                            ${num}
                                        </div>`
                                    ).join('')}
                                    ${combinacion.superBalota ? 
                                        `<div style="width: 25px; height: 25px; border-radius: 50%; background: #DC143C; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold;">
                                            ${combinacion.superBalota}
                                        </div>` : ''}
                                    <span style="background: #17a2b8; color: white; padding: 2px 6px; border-radius: 4px; font-size: 0.75rem;">
                                        +${combinacion.numeros.length - 3} más
                                    </span>
                                </div>
                            `;
                        }
                    }).join('')}
                    ${lote.combinaciones.length > 2 ? 
                        `<p style="text-align: center; margin: 8px 0 0 0; color: #666; font-size: 0.875rem;">
                            ... y ${lote.combinaciones.length - 2} combinaciones más
                        </p>` : ''}
                </div>
            </div>
        `;
    }).join('');
    
    contenido.innerHTML = historicoHTML;
}

function limpiarHistorialSimple() {
    if (AppState.historial.length === 0) {
        mostrarNotificacionSimple('warning', 'No hay histórico para limpiar');
        return;
    }
    
    if (!confirm('¿Estás seguro de que quieres limpiar todo el histórico?\n\nEsta acción no se puede deshacer.')) {
        return;
    }
    
    AppState.historial = [];
    AppState.estadisticas.totalLotes = 0;
    
    try {
        localStorage.setItem('historial', JSON.stringify([]));
        localStorage.setItem('estadisticas', JSON.stringify(AppState.estadisticas));
    } catch (error) {
        console.error('Error al guardar:', error);
    }
    
    cargarContenidoHistoricoSimple();
    actualizarEstadisticasSimple();
    mostrarNotificacionSimple('success', 'Histórico eliminado correctamente');
}

function cargarVersionSimple() {
    console.log('Cargando versión simple...');
    
    // Verificar elementos críticos
    const elementsToCheck = [
        'juego',
        'generar',
        'cuerpo-tabla',
        'reglas-contenido',
        'total-combinaciones'
    ];
    
    elementsToCheck.forEach(id => {
        if (!document.getElementById(id)) {
            console.error(`Elemento crítico no encontrado: #${id}`);
        }
    });
    
    // Aplicar estilos mínimos si CSS no carga
    setTimeout(() => {
        if (!document.querySelector('.card')) {
            document.body.classList.add('no-css');
            mostrarNotificacionSimple('warning', 'CSS no cargado, usando estilos mínimos');
        }
    }, 1000);
}

// Exportar al ámbito global
window.AppState = AppState;
window.CONFIG = CONFIG;
window.generarCombinacionesSimple = generarCombinacionesSimple;