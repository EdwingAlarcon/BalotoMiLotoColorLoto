# Copilot instructions for this repository

This is a small, single-file static web app that generates and manages lottery combinations.
Keep changes minimal and focused: prefer small, well-tested edits inside `generador-combinaciones.html`.

Quick summary (big picture)
- Single-page app: all HTML, CSS and JS live in `generador-combinaciones.html`.
- UI is Spanish; variable names and comments are Spanish.
- State is stored in-memory and persisted to `localStorage` under keys: `historicoCombinaciones` and `estadisticasCombinaciones`.

Key files & entrypoints
- `generador-combinaciones.html` — main and only source. Inspect the `<script>` section for core logic.

Important globals & DOM hooks (use these names when editing)
- Globals: `combinacionesActuales`, `historico`, `estadisticas`.
- DOM IDs: `juego`, `combinaciones`, `generar`, `guardar`, `limpiar`, `seleccionar-mejores`, `eliminar-seleccionados`, `ver-historial`, `cerrar-historico`, `limpiar-historico`, `limpiar-estadisticas`, `seleccionar-todas`, `tabla-resultados`, `cuerpo-tabla`, `seccion-historico`, `contenido-historico`, `notification`, `reglas-juego`.

Primary functions / responsibilities (refer to exact function names)
- Initialization & UI: `actualizarReglasYVisibilidad()`, `actualizarReglasJuego(juego)`, `actualizarVisibilidadColumnas(juego)`.
- Generation: `generarCombinaciones()`, `generarCombinacion(juego)`, `generarNumerosAleatorios(cantidad,min,max)`, `generarCombinacionesColorLoto()`.
- Rendering & scoring: `renderizarTablaCombinaciones()`, `calcularPuntuacion(combinacion)`.
- Selection & history: `seleccionarMejoresCombinaciones()`, `eliminarCombinacionesSeleccionadas()`, `guardarEnHistorico()`, `mostrarHistorico()`, `limpiarHistoricoCompleto()`.
- Persistence: `guardarEstadisticas()` plus direct `localStorage.setItem`/`getItem` use.

Developer workflows & debugging
- No build step — open `generador-combinaciones.html` in a browser or use VS Code Live Server.
- Use browser DevTools console to inspect logs (file uses `console.log` liberally) and inspect `localStorage` keys.
- To reset state during dev: use the app buttons `Limpiar Histórico` and `Limpiar Stats`, or clear `localStorage` manually.

Project patterns & conventions
- Keep UI text in Spanish and maintain existing class/ID names; many styles rely on these classes.
- Single-file approach: prefer adding small well-scoped functions inside the existing `<script>` instead of introducing new build tools.
- Styling uses CSS variables at the top — reuse these for new colors.

Integration notes / How to add a new game (concrete example)
1. Add new `<option value="mi-nuevo">Mi Nuevo</option>` to the `select#juego`.
2. Extend `actualizarReglasJuego(juego)` to set `reglasJuego.innerHTML` for `mi-nuevo`.
3. Update `actualizarVisibilidadColumnas(juego)` if the game needs special columns (use existing `.baloto-only` / `.color-loto-only` patterns).
4. Add case to `generarCombinacion(juego)` that returns the same shape used elsewhere (e.g., `numeros` array or `combinaciones` list).
5. Ensure `calcularPuntuacion` can handle the new combination shape.
6. Run in browser and validate rendering in `renderizarTablaCombinaciones()`.

Style & commit guidance for AI edits
- Make minimal, incremental changes. Keep global names and DOM IDs unchanged when possible.
- Preserve Spanish UI and comment style.
- If adding helper functions, place them adjacent to related functions inside the `<script>`.
- Suggested commit message prefix: `feat/ui:` or `fix(logic):` with a short Spanish description.

What to avoid
- Do not convert the project to a multi-file/build setup without the user's approval.
- Do not rename global variables or DOM IDs unless you update every reference.

If anything in these instructions is unclear or you want more examples (e.g., a scaffold for adding a new generator function), tell me which part to expand.

Quick manual test checklist
- Open `generador-combinaciones.html` in a browser (double-click or use Live Server).
- Generate combinations:
	- Select a game in `select#juego` and set `#combinaciones` (try values below `min`, above `max`, and valid values).
	- Click `Generar Combinaciones` and verify the table shows the expected number of rows and the notification message.
- Save and view histórico:
	- Click `Guardar en Histórico` and then `Ver Histórico`.
	- Verify the histórico shows tables with combinations and puntuaciones rendered correctly (no raw HTML strings).
- Export / Import JSON:
	- In `Ver Histórico` click `📤 Exportar JSON` to download `historicoCombinaciones.json`.
	- Click `📥 Importar JSON` and select the downloaded file — historial debe fusionarse y las estadísticas actualizarse.
- Edge cases:
	- Generate with `color-loto` and confirm color/número renderings and scoring.
	- Try `Limpiar Histórico` and `Limpiar Stats` and confirm `localStorage` keys `historicoCombinaciones` and `estadisticasCombinaciones` are removed or reset.

If you'd like, I can also add an automated smoke test (Node + Puppeteer) to run these checks headless.
