/**
 * Módulo de Gestión de Tablas
 * Maneja la renderización y actualización de la tabla de combinaciones
 */

const TableManager = {
    tbody: null,
    emptyMessage: null,

    /**
     * Inicializa el gestor de tablas
     */
    init() {
        this.tbody = document.getElementById('cuerpo-tabla');
        this.emptyMessage = this._createEmptyMessage();

        if (!this.tbody) {
            console.error('Elemento tbody no encontrado');
        }
    },

    /**
     * Crea el mensaje de estado vacío
     * @private
     */
    _createEmptyMessage() {
        const tr = document.createElement('tr');
        tr.className = 'empty-state';
        tr.innerHTML = `
            <td colspan="7">
                <div class="empty-message">
                    <span class="empty-icon" aria-hidden="true">🎲</span>
                    <p>No hay combinaciones generadas aún.</p>
                    <p class="empty-hint">Haz clic en "Generar Combinaciones" para comenzar.</p>
                </div>
            </td>
        `;
        return tr;
    },

    /**
     * Actualiza la tabla con las combinaciones
     * @param {Array} combinaciones - Array de objetos de combinación
     * @param {string} tipoJuego - Tipo de juego actual
     */
    update(combinaciones, tipoJuego) {
        if (!this.tbody) return;

        // Limpiar tabla
        this.tbody.innerHTML = '';

        // Mostrar mensaje vacío si no hay combinaciones
        if (!combinaciones || combinaciones.length === 0) {
            this.tbody.appendChild(this.emptyMessage.cloneNode(true));
            return;
        }

        // Crear fragmento para mejor performance
        const fragment = document.createDocumentFragment();

        combinaciones.forEach((combinacion, index) => {
            const row = this._createRow(combinacion, index, tipoJuego);
            fragment.appendChild(row);
        });

        this.tbody.appendChild(fragment);

        // Agregar eventos después de insertar en el DOM
        this._attachEventListeners();
    },

    /**
     * Crea una fila de la tabla
     * @private
     */
    _createRow(combinacion, index, tipoJuego) {
        const tr = document.createElement('tr');
        tr.dataset.id = combinacion.id;
        tr.className = combinacion.selected ? 'selected' : '';

        // Checkbox
        const tdCheckbox = document.createElement('td');
        tdCheckbox.className = 'col-checkbox';
        tdCheckbox.innerHTML = `
            <input type="checkbox"
                   class="combinacion-checkbox"
                   data-id="${combinacion.id}"
                   ${combinacion.selected ? 'checked' : ''}
                   aria-label="Seleccionar combinación ${index + 1}">
        `;

        // Índice
        const tdIndex = document.createElement('td');
        tdIndex.className = 'col-index';
        tdIndex.textContent = index + 1;

        // Combinación
        const tdCombinacion = document.createElement('td');
        tdCombinacion.className = 'col-combinacion';
        tdCombinacion.appendChild(this._createCombinacionDisplay(combinacion, tipoJuego));

        // Extra (Baloto/Color Loto)
        const tdExtraBaloto = document.createElement('td');
        tdExtraBaloto.className = 'col-extra baloto-only';
        const tdExtraColor = document.createElement('td');
        tdExtraColor.className = 'col-extra color-loto-only';

        if (tipoJuego === 'baloto' && combinacion.superBalota) {
            tdExtraBaloto.innerHTML = `<span class="super-balota">${combinacion.superBalota}</span>`;
        } else if (tipoJuego === 'color-loto' && combinacion.colores) {
            tdExtraColor.appendChild(this._createColorDisplay(combinacion.colores));
        }

        // Puntuación
        const tdPuntuacion = document.createElement('td');
        tdPuntuacion.className = 'col-puntuacion';
        tdPuntuacion.innerHTML = `
            <div class="puntuacion-container">
                <div class="puntuacion-bar-bg">
                    <div class="puntuacion-bar" style="width: ${combinacion.puntuacion}%"></div>
                </div>
                <span class="puntuacion-value">${combinacion.puntuacion}%</span>
            </div>
        `;

        // Probabilidad
        const tdProbabilidad = document.createElement('td');
        tdProbabilidad.className = 'col-probabilidad';
        tdProbabilidad.textContent = combinacion.probabilidad.toFixed(8) + '%';

        // Ensamblar fila
        tr.appendChild(tdCheckbox);
        tr.appendChild(tdIndex);
        tr.appendChild(tdCombinacion);
        tr.appendChild(tdExtraBaloto);
        tr.appendChild(tdExtraColor);
        tr.appendChild(tdPuntuacion);
        tr.appendChild(tdProbabilidad);

        return tr;
    },

    /**
     * Crea la visualización de números
     * @private
     */
    _createCombinacionDisplay(combinacion, tipoJuego) {
        const container = document.createElement('div');
        container.className = 'combinacion-container';

        combinacion.numeros.forEach(num => {
            const span = document.createElement('span');
            span.className = 'numero';
            span.textContent = num;
            container.appendChild(span);
        });

        return container;
    },

    /**
     * Crea la visualización de colores
     * @private
     */
    _createColorDisplay(colores) {
        const container = document.createElement('div');
        container.className = 'color-loto-container';

        Object.entries(colores).forEach(([color, numero]) => {
            const item = document.createElement('div');
            item.className = `color-item color-${color}`;
            item.innerHTML = `<span class="color-name">${color}</span><span class="color-num">${numero}</span>`;
            container.appendChild(item);
        });

        return container;
    },

    /**
     * Adjunta event listeners a los checkboxes
     * @private
     */
    _attachEventListeners() {
        if (!this.tbody) return;

        this.tbody.querySelectorAll('.combinacion-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (event) => {
                this._handleCheckboxChange(event);
            });
        });
    },

    /**
     * Maneja cambio en checkbox
     * @private
     */
    _handleCheckboxChange(event) {
        const checkbox = event.target;
        const id = checkbox.dataset.id;
        const row = checkbox.closest('tr');

        if (row) {
            row.classList.toggle('selected', checkbox.checked);
        }

        // Emitir evento personalizado para que app.js lo maneje
        const customEvent = new CustomEvent('combinacion-selection-changed', {
            detail: { id, selected: checkbox.checked }
        });
        document.dispatchEvent(customEvent);
    },

    /**
     * Selecciona todas las combinaciones
     */
    selectAll(selected) {
        if (!this.tbody) return;

        this.tbody.querySelectorAll('.combinacion-checkbox').forEach(checkbox => {
            checkbox.checked = selected;
            const row = checkbox.closest('tr');
            if (row) {
                row.classList.toggle('selected', selected);
            }
        });
    }
};

// Exportar
if (typeof window !== 'undefined') {
    window.TableManager = TableManager;
}
