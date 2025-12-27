// Módulo de interfaz de usuario - VERSION CORREGIDA

/**
 * Muestra una notificación en pantalla
 * @param {string} tipo - Tipo de notificación (success, error, warning, info)
 * @param {string} mensaje - Mensaje a mostrar
 * @param {number} duracion - Duración en milisegundos (opcional)
 */
function mostrarNotificacion(tipo, mensaje, duracion = 5000) {
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) return;

    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.setAttribute('role', 'alert');

    const icon = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    }[tipo] || 'ℹ️';

    notification.innerHTML = `
        <span class="notification-icon" aria-hidden="true">${icon}</span>
        <span class="notification-message">${mensaje}</span>
    `;

    notificationArea.appendChild(notification);

    // Auto-eliminar después de la duración
    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duracion);
}

/**
 * Actualiza la tabla de combinaciones generadas
 */
function actualizarTablaCombinaciones() {
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
        // Generar HTML para números principales
        let numerosHTML = '';
        if (juego === 'color-loto') {
            // Para Color Loto: mostrar colores con sus números
            numerosHTML = combinacion.colores.map((color, idx) => {
                const numero = combinacion.colorNumeros ? combinacion.colorNumeros[idx] : '?';
                return `
                    <div class="color-loto-item">
                        <span class="number-ball color-${color}" title="${color} (${numero})">
                            ${color.charAt(0).toUpperCase()}
                        </span>
                        <span class="color-number">${numero}</span>
                    </div>
                `;
            }).join('');
        } else {
            // Para Baloto y Mi Loto: mostrar números
            numerosHTML = combinacion.numeros.map(num =>
                `<span class="number-ball ${juego}-number">${num}</span>`
            ).join('');
        }

        // Generar HTML para columna extra
        let extraHTML = '';
        if (juego === 'baloto' && combinacion.superBalota) {
            extraHTML = `<span class="number-ball super-balota" title="Super Balota">${combinacion.superBalota}</span>`;
        } else if (juego === 'color-loto') {
            // Para Color Loto: mostrar resumen en columna extra
            const coloresStr = combinacion.colores.join(', ');
            extraHTML = `<span class="badge badge-info" title="${coloresStr}">6 colores</span>`;
        }

        return `
            <tr data-id="${combinacion.id}" class="${combinacion.selected ? 'selected' : ''}">
                <td class="col-checkbox">
                    <input type="checkbox" class="combinacion-checkbox"
                           data-id="${combinacion.id}"
                           ${combinacion.selected ? 'checked' : ''}
                           aria-label="Seleccionar combinación ${index + 1}">
                </td>
                <td class="col-index">${index + 1}</td>
                <td class="col-combinacion">
                    <div class="combinacion-container">${numerosHTML}</div>
                </td>
                <td class="col-extra baloto-only">${extraHTML}</td>
                <td class="col-extra color-loto-only">${extraHTML}</td>
                <td class="col-puntuacion">
                    <div class="puntuacion-bar" style="width: ${combinacion.puntuacion}%"></div>
                    ${combinacion.puntuacion}%
                </td>
                <td class="col-probabilidad">${combinacion.probabilidad.toFixed(8)}%</td>
            </tr>
        `;
    }).join('');

    tbody.innerHTML = rows;

    // Agregar eventos a los checkboxes
    tbody.querySelectorAll('.combinacion-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', manejarSeleccionCombinacion);
    });
}

/**
 * Muestra las reglas del juego actual
 */
function mostrarReglasJuego() {
    const juego = document.getElementById('juego').value;
    const config = CONFIG.juegos[juego];
    const reglasSection = document.getElementById('reglas-juego');
    const reglasContenido = document.getElementById('reglas-contenido');

    if (!reglasSection || !reglasContenido) return;

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
            <p><strong>Color Loto - Reglas Oficiales:</strong></p>
            <ul>
                <li>🎨 Debes escoger <strong>6 colores</strong> entre: amarillo, azul, rojo, verde, blanco, negro</li>
                <li>🔢 A cada color debes asignarle un <strong>número del 1 al 7</strong></li>
                <li>✅ <strong>Colores pueden repetirse</strong> si tienen números diferentes</li>
                <li>✅ <strong>Números pueden repetirse</strong> si tienen colores diferentes</li>
                <li>❌ <strong>NO puedes repetir</strong> la misma pareja (color + número)</li>
                <li>📊 Combinaciones posibles: 84,707,280</li>
            </ul>
            <div class="reglas-ejemplos">
                <p><strong>Ejemplos válidos:</strong></p>
                <ul>
                    <li>✅ Amarillo-4, Azul-2, Rojo-6, Verde-6, Blanco-3, Negro-5 (números repetidos OK)</li>
                    <li>✅ Amarillo-4, Amarillo-5, Rojo-4, Verde-2, Blanco-1, Negro-7 (colores repetidos OK)</li>
                </ul>
                <p><strong>Ejemplo inválido:</strong></p>
                <ul>
                    <li>❌ Amarillo-4, Azul-2, Amarillo-4, Verde-6, Blanco-3, Negro-5 (Amarillo-4 repetido)</li>
                </ul>
            </div>
        `;
    }

    reglasContenido.innerHTML = reglasHTML;
    reglasSection.hidden = false;
}

/**
 * Actualiza las clases CSS según el juego seleccionado
 */
function actualizarClasesJuego() {
    const juego = document.getElementById('juego').value;
    document.body.classList.remove('baloto-mode', 'mi-loto-mode', 'color-loto-mode');
    document.body.classList.add(`${juego}-mode`);
}

/**
 * Maneja la selección de una combinación individual
 * @param {Event} event - Evento del checkbox
 */
function manejarSeleccionCombinacion(event) {
    const checkbox = event.target;
    const id = checkbox.dataset.id;
    const combinacion = AppState.combinaciones.find(c => c.id == id);

    if (combinacion) {
        combinacion.selected = checkbox.checked;
        const row = checkbox.closest('tr');
        if (row) {
            row.classList.toggle('selected', checkbox.checked);
        }
    }
}

/**
 * Maneja la selección de todas las combinaciones
 * @param {Event} event - Evento del checkbox
 */
function manejarSeleccionTodas(event) {
    const checked = event.target.checked;
    AppState.combinaciones.forEach(combinacion => {
        combinacion.selected = checked;
    });

    actualizarTablaCombinaciones();
}

/**
 * Selecciona las mejores combinaciones basadas en puntuación
 * Aplica criterios estadísticos según la cantidad de combinaciones
 * Ordena las combinaciones seleccionadas de mejor a peor
 */
function seleccionarMejores() {
    if (AppState.combinaciones.length === 0) {
        mostrarNotificacion('warning', 'No hay combinaciones para seleccionar');
        return;
    }

    const total = AppState.combinaciones.length;
    let cantidadASeleccionar;

    // Aplicar criterio estadístico basado en la cantidad total
    if (total <= 5) {
        // Si hay 5 o menos, seleccionar máximo 3 (top 60%)
        cantidadASeleccionar = Math.max(1, Math.ceil(total * 0.6));
    } else if (total <= 10) {
        // Entre 6 y 10: seleccionar top 50%
        cantidadASeleccionar = Math.ceil(total * 0.5);
    } else if (total <= 20) {
        // Entre 11 y 20: seleccionar top 30-40%
        cantidadASeleccionar = Math.ceil(total * 0.35);
    } else if (total <= 50) {
        // Entre 21 y 50: seleccionar top 20%
        cantidadASeleccionar = Math.ceil(total * 0.20);
    } else {
        // Más de 50: seleccionar top 10-15%, mínimo 5, máximo 20
        cantidadASeleccionar = Math.max(5, Math.min(20, Math.ceil(total * 0.15)));
    }

    // Deseleccionar todas primero
    AppState.combinaciones.forEach(c => c.selected = false);

    // Ordenar todas las combinaciones por puntuación (de mayor a menor)
    AppState.combinaciones.sort((a, b) => {
        // Ordenar por puntuación descendente (mejor primero)
        if (b.puntuacion !== a.puntuacion) {
            return b.puntuacion - a.puntuacion;
        }
        // En caso de empate, ordenar por probabilidad (mayor probabilidad primero)
        if (a.probabilidad && b.probabilidad) {
            return b.probabilidad - a.probabilidad;
        }
        return 0;
    });

    // Seleccionar las mejores (que ahora están al principio del array)
    for (let i = 0; i < cantidadASeleccionar; i++) {
        AppState.combinaciones[i].selected = true;
    }

    actualizarTablaCombinaciones();

    const porcentaje = ((cantidadASeleccionar / total) * 100).toFixed(1);
    mostrarNotificacion('success',
        `${cantidadASeleccionar} mejores combinaciones seleccionadas y ordenadas (top ${porcentaje}%)`
    );
}

/**
 * Elimina las combinaciones seleccionadas
 */
function eliminarSeleccionadas() {
    const seleccionadas = AppState.combinaciones.filter(c => c.selected);

    if (seleccionadas.length === 0) {
        mostrarNotificacion('warning', 'No hay combinaciones seleccionadas para eliminar');
        return;
    }

    AppState.combinaciones = AppState.combinaciones.filter(c => !c.selected);
    actualizarTablaCombinaciones();
    actualizarEstadisticas();

    mostrarNotificacion('info', `${seleccionadas.length} combinación(es) eliminada(s)`);
}

/**
 * Limpia todas las combinaciones sin confirmación
 * Versión silenciosa para uso interno
 */
function limpiarCombinacionesSilencioso() {
    AppState.combinaciones = [];
    actualizarTablaCombinaciones();
    actualizarEstadisticas();
}

/**
 * Maneja el cambio de tipo de juego con animación
 * Limpia resultados y actualiza la UI
 */
function manejarCambioJuego() {
    const rulesSection = document.querySelector('.rules-section');

    // Agregar clase de actualización para animación
    if (rulesSection) {
        rulesSection.classList.add('updating');
        setTimeout(() => rulesSection.classList.remove('updating'), 500);
    }

    // Limpiar combinaciones actuales sin confirmación
    if (AppState.combinaciones.length > 0) {
        limpiarCombinacionesSilencioso();
        mostrarNotificacion('info', 'Resultados limpiados al cambiar tipo de juego');
    }

    // Actualizar reglas y clases visuales
    mostrarReglasJuego();
    actualizarClasesJuego();
}

/**
 * Limpia todas las combinaciones
 */
function limpiarCombinaciones() {
    if (AppState.combinaciones.length === 0) return;

    if (!confirm('¿Estás seguro de que quieres limpiar todas las combinaciones?')) {
        return;
    }

    AppState.combinaciones = [];
    actualizarTablaCombinaciones();
    actualizarEstadisticas();

    mostrarNotificacion('info', 'Todas las combinaciones han sido eliminadas');
}

/**
 * Alterna entre tema claro y oscuro con animación
 */
function alternarTema() {
    const nuevoTema = AppState.tema === 'light' ? 'dark' : 'light';

    // Agregar clase de transición
    document.body.setAttribute('data-theme-transitioning', '');

    // Aplicar tema
    aplicarTema(nuevoTema);

    // Remover clase después de la animación
    setTimeout(() => {
        document.body.removeAttribute('data-theme-transitioning');
    }, 500);
}

/**
 * Aplica el tema especificado
 * @param {string} tema - Tema a aplicar (light/dark)
 */
function aplicarTema(tema) {
    AppState.tema = tema;
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);

    // Actualizar icono
    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
        themeIcon.textContent = tema === 'light' ? '🌙' : '☀️';
    }
}

/**
 * Muestra el modal del histórico
 */
function mostrarHistorial() {
    const modal = document.getElementById('historico-modal');
    if (!modal) return;

    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    // Cargar contenido del histórico
    cargarContenidoHistorico();

    // Enfocar el botón de cerrar para accesibilidad
    setTimeout(() => {
        const closeBtn = document.getElementById('cerrar-historico');
        if (closeBtn) closeBtn.focus();
    }, 100);
}

/**
 * Cierra el modal del histórico
 */
function cerrarHistorial() {
    const modal = document.getElementById('historico-modal');
    if (!modal) return;

    modal.hidden = true;
    document.body.style.overflow = '';

    // Regresar el foco al botón que abrió el modal
    const openBtn = document.getElementById('ver-historial');
    if (openBtn) openBtn.focus();
}

/**
 * Carga el contenido del histórico en el modal
 */
function cargarContenidoHistorico() {
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
            <div class="historico-lote card">
                <div class="lote-header">
                    <h3>${juegoNombre}</h3>
                    <span class="badge">${fecha}</span>
                    <span class="badge badge-success">${lote.combinaciones.length} combinaciones</span>
                </div>
                <div class="lote-combinaciones">
                    ${lote.combinaciones.slice(0, 3).map(combinacion => {
                        if (lote.juego === 'color-loto') {
                            // Mostrar primeros 3 colores para Color Loto
                            const coloresMostrar = combinacion.colores.slice(0, 3);
                            return `
                                <div class="combinacion-mini">
                                    ${coloresMostrar.map(color =>
                                        `<span class="number-ball mini-ball color-${color}">${color.charAt(0)}</span>`
                                    ).join('')}
                                    <span class="badge badge-info">+${combinacion.colores.length - 3} más</span>
                                </div>
                            `;
                        } else {
                            // Mostrar números para Baloto/Mi Loto
                            const numerosMostrar = combinacion.numeros.slice(0, 3);
                            return `
                                <div class="combinacion-mini">
                                    ${numerosMostrar.map(num =>
                                        `<span class="number-ball mini-ball ${lote.juego}-number">${num}</span>`
                                    ).join('')}
                                    ${combinacion.superBalota ?
                                        `<span class="number-ball mini-ball super-balota">${combinacion.superBalota}</span>` : ''}
                                    <span class="badge badge-info">+${combinacion.numeros.length - 3} más</span>
                                </div>
                            `;
                        }
                    }).join('')}
                    ${lote.combinaciones.length > 3 ?
                        `<p class="text-center mt-1">... y ${lote.combinaciones.length - 3} combinaciones más</p>` : ''}
                </div>
            </div>
        `;
    }).join('');

    contenido.innerHTML = historicoHTML;
}

// Exportar funciones
window.mostrarNotificacion = mostrarNotificacion;
window.actualizarTablaCombinaciones = actualizarTablaCombinaciones;
window.mostrarReglasJuego = mostrarReglasJuego;
window.actualizarClasesJuego = actualizarClasesJuego;
window.manejarCambioJuego = manejarCambioJuego;
window.mostrarHistorial = mostrarHistorial;
window.cerrarHistorial = cerrarHistorial;
window.cargarContenidoHistorico = cargarContenidoHistorico;
window.seleccionarMejores = seleccionarMejores;
window.eliminarSeleccionadas = eliminarSeleccionadas;
window.limpiarCombinaciones = limpiarCombinaciones;
window.alternarTema = alternarTema;
