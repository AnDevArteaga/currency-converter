export const API_BASE_URL = "https://api.freecurrencyapi.com";
export const DEFAULT_FROM = "USD";
export const DEFAULT_TO = "COP";

// Configuración de la aplicación
export const APP_CONFIG = {
    // Tiempo de espera para pausas en el menú
    PAUSE_DURATION: 3000,
    
    // Tiempo de espera para mensajes de error
    ERROR_PAUSE_DURATION: 3000,

    // Número máximo de caracteres para códigos de moneda
    MAX_CURRENCY_CODE_LENGTH: 3,
    
    // Número mínimo de caracteres para códigos de moneda
    MIN_CURRENCY_CODE_LENGTH: 3,
    
    // Cantidad mínima permitida para conversión
    MIN_AMOUNT: 0.01,
    
    // Cantidad máxima permitida para conversión
    MAX_AMOUNT: 999999999,
    
    // Número máximo de decimales para el resultado
    DECIMAL_PLACES: 5
};

// Mensajes de error
export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Error de conexión. Verifica tu conexión a internet e intenta nuevamente.",
    API_ERROR: "Error en el servicio de tasas de cambio. Intenta más tarde.",
    INVALID_CURRENCY: "Código de moneda inválido. Debe tener exactamente 3 letras.",
    INVALID_AMOUNT: "Cantidad inválida. Debe ser un número mayor que 0, Si es decimal, debes separar por puntos",
    AMOUNT_TOO_LOW: `La cantidad debe ser mayor que ${APP_CONFIG.MIN_AMOUNT}`,
    AMOUNT_TOO_HIGH: `La cantidad no puede ser mayor que ${APP_CONFIG.MAX_AMOUNT}`,
    CURRENCIES_NOT_SET: "Debes establecer las monedas antes de convertir.",
    AMOUNT_NOT_SET: "Debes establecer una cantidad antes de convertir.",
    EMPTY_INPUT: "La entrada no puede estar vacía.",
    INVALID_MENU_OPTION: "Opción inválida. Selecciona una opción del 1 al 7."
};

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
    CURRENCIES_SET: "Monedas establecidas correctamente",
    AMOUNT_SET: "Cantidad establecida correctamente",
    CONVERSION_SUCCESS: "Conversión realizada exitosamente"
};