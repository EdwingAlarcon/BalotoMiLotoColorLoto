// Módulo de interfaz de usuario

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
        const numerosHTML = combinacion.numeros.map(num => 
            `<span class="number-ball ${juego}-number">${num}</span>`
        ).join('');
        
        let extraHTML = '';
        if (juego === 'baloto' && combinacion.superBalota) {
            extraHTML = `<span class="number-ball super-balota">${combinacion.superBalota}</span>`;
        } else if (juego === 'color-loto' && combinacion.colores) {
            extraHTML = combinacion.colores.map(color => 
                `<span class="number-ball color-${color}">${color.charAt(0).toUpperCase()}</span>`
            ).join('');
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
    
    reglasContenido.innerHTML = `
        <p><strong>${config.nombre}:</strong> ${config.descripcion}</p>
        <ul>
            <li>Números por combinación: ${config.numeros}</li>
            <li>Rango de números: ${config.minNumero} - ${config.maxNumero}</li>
            ${config.superBalota ? 
                `<li>Rango Super Balota: ${config.minSuperBalota} - ${config.maxSuperBalota}</li>` : ''}
            ${config.colores ? 
                `<li>Colores disponibles: ${config.coloresDisponibles.join(', ')}</li>` : ''}
        </ul>
    `;
    
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
 */
function seleccionarMejores() {
    if (AppState.combinaciones.length === 0) {
        mostrarNotificacion('warning', 'No hay combinaciones para seleccionar');
        return;
    }
    
    // Deseleccionar todas primero
    AppState.combinaciones.forEach(c => c.selected = false);
    
    // Seleccionar las 5 mejores por puntuación
    const mejores = [...AppState.combinaciones]
        .sort((a, b) => b.puntuacion - a.puntuacion)
        .slice(0, 5);
    
    mejores.forEach(combinacion => {
        combinacion.selected = true;
    });
    
    actualizarTablaCombinaciones();
    mostrarNotificacion('success', '5 mejores combinaciones seleccionadas');
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
 * Alterna entre tema claro y oscuro
 */
function alternarTema() {
    const nuevoTema = AppState.tema === 'light' ? 'dark' : 'light';
    aplicarTema(nuevoTema);
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
    
    const historicoHTML = AppState.historial.map(lote => `
        <div class="historico-lote card">
            <div class="lote-header">
                <h3>Lote #${lote.id.toString().slice(-4)}</h3>
                <span class="badge">${new Date(lote.fecha).toLocaleDateString()}</span>
                <span class="badge badge-info">${CONFIG.juegos[lote.juego].nombre}</span>
                <span class="badge badge-success">${lote.combinaciones.length} combinaciones</span>
            </div>
            <div class="lote-combinaciones">
                ${lote.combinaciones.slice(0, 3).map(combinacion => `
                    <div class="combinacion-mini">
                        ${combinacion.numeros.map(n => `<span class="number-ball mini-ball">${n}</span>`).join('')}
                        ${combinacion.superBalota ? `<span class="number-ball mini-ball super-balota">${combinacion.superBalota}</span>` : ''}
                    </div>
                `).join('')}
                ${lote.combinaciones.length > 3 ? 
                    `<p class="text-center">... y ${lote.combinaciones.length - 3} más</p>` : ''}
            </div>
        </div>
    `).join('');
    
    contenido.innerHTML = historicoHTML;
}

// Exportar funciones
window.mostrarNotificacion = mostrarNotificacion;
window.actualizarTablaCombinaciones = actualizarTablaCombinaciones;
window.mostrarReglasJuego = mostrarReglasJuego;