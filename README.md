# 💱 Convertidor de Divisas - Aplicación de Consola (JavaScript)

Aplicación de consola escrita en JavaScript que permite convertir montos entre distintas monedas utilizando tasas de cambio en tiempo real obtenidas desde [freecurrencyapi.com](https://freecurrencyapi.com/).

---

## 📁 Estructura del Proyecto

```
currency-converter/
├── src/
│   ├── api.js             # Conexión con la API de divisas
│   ├── converter.js       # Lógica de conversión
│   ├── history.js         # Registro del historial de conversiones
├── tests/
│   ├── api.test.js        # Pruebas unitarias para el módulo API
│   ├── converter.test.js  # Pruebas unitarias para el conversor
│   ├── history.test.js    # Pruebas para el historial
├── index.js               # Entrada principal y menú interactivo
├── package.json           # Configuración del proyecto
├── .eslintrc.json         # Configuración de ESLint
└── README.md              # Este archivo
```

---

## 📌 Funcionalidades

- Obtener tasas de cambio desde una API externa al iniciar
- Convertir entre monedas con precisión decimal (centavos)
- Soporte para múltiples monedas destino
- Validación de entradas del usuario
- Historial de conversiones por sesión
- Menú interactivo en consola con opciones
- Pruebas automatizadas con Vitest
- Linter con ESLint y reglas básicas

---

## 🚀 Requisitos Previos

- Node.js >= 18
- Conexión a Internet

---

## 🛠 Instalación y ejecución

1. **Clona el repositorio**

```bash
git clone https://github.com/tuusuario/currency-converter.git
cd currency-converter
```

2. **Instala dependencias**

```bash
npm install
```

3. **Ejecuta la aplicación**

```bash
npm start
```

---

## ▶️ Flujo de uso de la consola

Al ejecutar `npm start`, se abrirá un menú con las siguientes opciones:

1. Mostrar monedas disponibles
2. Mostrar tasas de cambio
3. Establecer moneda base y monedas destino
4. Establecer cantidad a convertir
5. Convertir y mostrar resultados
6. Ver historial de conversiones
7. Salir

La aplicación seguirá funcionando hasta que elijas salir.

---

## 🧪 Pruebas Automatizadas

Este proyecto usa **Vitest** para las pruebas.

### Ejecutar todos los tests:

```bash
npm test
```

### Resultado esperado:

Todos los tests deben pasar sin errores. Salida esperada:

```
✓ converter.test.js (8)
✓ api.test.js (2)
✓ history.test.js (3)

Test Files  3 passed (3)
      Tests  13 passed (13)
   Start Time ...
``` 

---

## 🧹 Estilo de Código (Lint)

Usamos ESLint con reglas básicas (`semi`, `quotes`, `no-unused-vars`).

### Ejecutar lint:

```bash
npm run lint
```

### Resultado esperado:

Si no hay errores, la salida será vacía:

```
(no output)
```

---

## 🔐 Consideraciones Técnicas

- **Precisión Decimal:** se usa `toFixed` y validación con `Number` para mantener precisión hasta centavos.
- **Key API expuesta:** por facilidad de revisión técnica, la clave de la API está escrita directamente en el código. Esta **no expone información personal**, solo permite hacer peticiones públicas de tasas de cambio. Será eliminada del código final y retirada del commit una vez revisada.
- **Axios:** se usa `axios` para las llamadas a la API, con manejo de errores básico.
- **Historial:** las conversiones realizadas se guardan en memoria durante la sesión.
- **Mocking:** las llamadas externas están simuladas en los tests con `vi.mock()` de Vitest.

