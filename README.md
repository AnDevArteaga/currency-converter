# 💱 Convertidor de Divisas - Aplicación de Consola (JavaScript)

Aplicación de consola escrita en JavaScript que permite convertir montos entre distintas monedas utilizando tasas de cambio en tiempo real obtenidas desde [freecurrencyapi.com](https://freecurrencyapi.com/).

---

## 📁 Estructura del Proyecto

```
currency-converter/
├── src/
│   ├── handlers/
│   │   └── MenuAction.js     # Acciones del menú principal
│   ├── utils/
│   │   └── utils.js          # Funciones utilitarias
│   ├── api.js                # Conexión con la API de divisas
│   ├── config.js             # Constantes y configuraciones
│   ├── converter.js          # Lógica de conversión
│   ├── history.js            # Registro del historial de conversiones
│   └── validator.js          # Validaciones de campos
├── tests/
│   ├── api.test.js           # Pruebas unitarias para el módulo API
│   ├── converter.test.js     # Pruebas unitarias para el conversor
│   └── history.test.js       # Pruebas para el historial
├── .env.example              # Ejemplo de variables de entorno
├── .eslintrc.json           # Configuración de ESLint
├── .gitignore               # Archivos ignorados por Git
├── index.js                 # Entrada principal y menú interactivo
├── package.json             # Configuración del proyecto
└── README.md                # Este archivo
```

---

## 📌 Funcionalidades

- ✅ Obtener tasas de cambio desde una API externa al iniciar
- ✅ Convertir entre monedas con precisión decimal (centavos)
- ✅ Soporte para múltiples monedas destino
- ✅ Validación robusta de entradas del usuario
- ✅ Historial de conversiones por sesión
- ✅ Menú interactivo en consola con opciones
- ✅ Pruebas automatizadas con Vitest
- ✅ Linter con ESLint y reglas básicas
- ✅ Configuración segura con variables de entorno

---

## 🚀 Requisitos Previos

- Node.js >= 18
- Conexión a Internet
- API Key de [freecurrencyapi.com](https://freecurrencyapi.com/)

---

## 🛠 Instalación y Configuración

### 1. Clona el repositorio

```bash
git clone https://github.com/AnDevArteaga/currency-converter.git
cd currency-converter
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Configura las variables de entorno

1. Dirígete a [freecurrencyapi.com](https://freecurrencyapi.com/) y crea una cuenta
2. Obtén tu API Key gratuita
3. Copia el archivo de ejemplo y renombralo correctamente:

```bash
cp .env.example .env
```

4. Edita el archivo `.env` y agrega tu API Key:

```env
API_KEY=tu_api_key_aqui
```

### 4. Ejecuta la aplicación

```bash
npm start
```

---

## ▶️ Flujo de Uso de la Consola

Al ejecutar `npm start`, se abrirá un menú interactivo con las siguientes opciones:

1. **Mostrar monedas disponibles** - Lista todas las monedas soportadas
2. **Mostrar tasas de cambio** - Muestra las tasas actuales desde la API
3. **Establecer moneda base y monedas destino** - Configura las monedas para conversión
4. **Establecer cantidad a convertir** - Define el monto a convertir
5. **Convertir y mostrar resultados** - Ejecuta la conversión y muestra resultados
6. **Ver historial de conversiones** - Revisa todas las conversiones realizadas
7. **Salir** - Termina la aplicación

La aplicación seguirá funcionando hasta que elijas salir.

---

## 🧪 Pruebas Automatizadas

Este proyecto usa **Vitest** para las pruebas unitarias.

### Ejecutar todos los tests:

```bash
npm test
```

### Resultado esperado:

```
✓ converter.test.js (8)
✓ api.test.js (2)
✓ history.test.js (3)

Test Files  3 passed (3)
Tests  13 passed (13)
Start Time ...
```

---

## 🧹 Calidad de Código (Lint)

Usamos ESLint con reglas básicas para mantener consistencia en el código.

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

## 🏗️ Arquitectura del Proyecto

### Separación de Responsabilidades

- **`handlers/MenuAction.js`**: Contiene todas las acciones del menú principal, separando la lógica de interacción
- **`utils/utils.js`**: Funciones utilitarias reutilizables en toda la aplicación
- **`config.js`**: Centralizadas todas las constantes y configuraciones
- **`validator.js`**: Validaciones específicas para todos los campos de entrada
- **`api.js`**: Manejo exclusivo de la conexión con la API externa
- **`converter.js`**: Lógica pura de conversión de monedas
- **`history.js`**: Gestión del historial de conversiones

---

## 🔐 Consideraciones Técnicas

### Seguridad

- **Variables de entorno**: La API Key se maneja de forma segura mediante variables de entorno
- **Validaciones**: Todas las entradas del usuario son validadas antes de procesarse

### Precisión y Rendimiento

- **Precisión decimal**: Se usa `toFixed` y validación con `Number` para mantener precisión hasta centavos
- **Manejo de errores**: Implementación robusta con `try/catch` y mensajes informativos

### Tecnologías Utilizadas

- **Axios**: Para las llamadas HTTP a la API externa
- **Vitest**: Framework de testing con mocking avanzado
- **ESLint**: Análisis estático de código
- **Dotenv**: Gestión de variables de entorno

### Testing

- **Mocking**: Las llamadas externas están simuladas con `vi.mock()` de Vitest
- **Cobertura**: Tests unitarios para todos los módulos críticos
- **Historial**: Las conversiones se guardan en memoria durante la sesión

---
