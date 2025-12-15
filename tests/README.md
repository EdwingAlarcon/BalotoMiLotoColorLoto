# tests

Esta carpeta contiene las pruebas del proyecto.

## Estructura de Pruebas

```
tests/
├── unit/           # Pruebas unitarias
├── integration/    # Pruebas de integración
├── e2e/           # Pruebas end-to-end
├── test-data.js   # Datos de prueba
└── setup.js       # Configuración de pruebas
```

## Frameworks Recomendados

### Para Pruebas Unitarias
- **Jest**: Framework completo de testing
- **Mocha + Chai**: Alternativa flexible

### Para Pruebas E2E
- **Playwright**: Testing de navegador moderno
- **Cypress**: Testing E2E intuitivo

## Ejecutar Pruebas

```bash
# Instalar dependencias
npm install --save-dev jest

# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm test -- --coverage

# Ejecutar en modo watch
npm test -- --watch
```

## Ejemplo de Prueba

```javascript
// unit/generador.test.js
import { generarCombinacionUnica } from '../js/generador.js';
import { JUEGOS } from '../js/constants.js';

describe('generador', () => {
    describe('generarCombinacionUnica', () => {
        it('debe generar 5 números para Baloto', () => {
            const config = JUEGOS.BALOTO;
            const resultado = generarCombinacionUnica(config, 'baloto');
            
            expect(resultado.numeros).toHaveLength(5);
            expect(new Set(resultado.numeros).size).toBe(5);
        });
        
        it('debe generar números únicos', () => {
            const config = JUEGOS.BALOTO;
            const resultado = generarCombinacionUnica(config, 'baloto');
            
            const unicos = new Set(resultado.numeros);
            expect(unicos.size).toBe(resultado.numeros.length);
        });
    });
});
```

## Cobertura de Código

Objetivo: > 80% de cobertura

```bash
# Generar reporte de cobertura
npm test -- --coverage

# Ver reporte en navegador
open coverage/lcov-report/index.html
```

## Datos de Prueba

Ver `test-data.js` para ejemplos de datos de prueba reutilizables.

## Próximos Pasos

1. Configurar Jest o framework de testing preferido
2. Escribir pruebas para módulos críticos
3. Configurar CI/CD para ejecutar pruebas automáticamente
4. Mantener cobertura > 80%
