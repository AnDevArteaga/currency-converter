//api 
import axios from "axios";
import { URLBuilder } from "./utils/urlBuilder.js";

import { API_BASE_URL, ERROR_MESSAGES } from "./config.js";

export class CurrencyAPI {
    constructor() {
        this.API_KEY = process.env.API_KEY;
        this.rates = {};
    }

       buildApiUrl() {
        return URLBuilder
            .create(API_BASE_URL)
            .setPath("/v1/latest")
            .addParam("apikey", this.API_KEY)
            .build();
    }

    //Obtiene las tasas de cambio desde la API
    async fetchRates() {
        try {
            if (!this.API_KEY) {
                throw new Error("API_KEY no configurado. Verifica tus variables de entorno.");
            }

            const url = this.buildApiUrl();
            
            const res = await axios.get(url, {
                timeout: 10000,
                headers: {
                    "User-Agent": "Currency-Converter-App/1.0"
                }
            });

            if (!res.data) {
                throw new Error("Respuesta vacía del servidor.");
            }

            if (!res.data.data || typeof res.data.data !== "object") {
                throw new Error("Formato de respuesta inválido del API.");
            }

            // Verificar que haya tasas de cambio
            const rates = res.data.data;
            if (Object.keys(rates).length === 0) {
                throw new Error("No se encontraron tasas de cambio.");
            }

            // Validar que las tasas sean números válidos
            for (const [currency, rate] of Object.entries(rates)) {
                if (typeof rate !== "number" || isNaN(rate) || rate <= 0) {
                    console.warn(`Tasa inválida para ${currency}: ${rate}`);
                    delete rates[currency];
                }
            }

            if (Object.keys(rates).length === 0) {
                throw new Error("Todas las tasas de cambio son inválidas.");
            }

            this.rates = rates;
            console.log(`Tasas de cambio obtenidas exitosamente (${Object.keys(rates).length} monedas)`);
            return this.rates;

        } catch (error) {
            // Manejo específico de errores de red
            if (error.code === "ECONNABORTED" || error.code === "ENOTFOUND") {
                console.error("Error de conexión:", error.message);
                throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
            }

            // Manejo de errores HTTP
            if (error.response) {
                const status = error.response.status;
                const statusText = error.response.statusText;
                
                switch (status) {
                    case 401:
                        throw new Error("API key inválido o expirado.");
                    case 403:
                        throw new Error("Acceso denegado al servicio de tasas de cambio.");
                    case 429:
                        throw new Error("Límite de peticiones excedido. Intenta más tarde.");
                    case 500:
                    case 502:
                    case 503:
                        throw new Error("Error del servidor. Intenta más tarde.");
                    default:
                        throw new Error(`Error HTTP ${status}: ${statusText}`);
                }
            }

            if (error.message.includes("API_KEY no configurado") || 
                error.message.includes("Respuesta vacía") ||
                error.message.includes("Formato de respuesta inválido")) {
                throw error;
            }

            // Error genérico
            console.error("Error al obtener tasas de cambio:", error.message);
            throw new Error(ERROR_MESSAGES.API_ERROR);
        }
    }

    //Obtiene las monedas disponibles
    getAvailableCurrencies() {
        return Object.keys(this.rates).sort();
    }

    isCurrencyAvailable(currency) {
        return currency in this.rates;
    }

    getRate(currency) {
        return this.rates[currency] || null;
    }
}