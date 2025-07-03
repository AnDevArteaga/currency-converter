import axios from "axios";

export class CurrencyAPI {
    constructor() {
        // IMPORTANTE: Esta API key es de uso público y limitado para fines de prueba.
        // No representa riesgo de seguridad ni expone datos sensibles.
        // Se recomienda reemplazarla por una clave propia en entornos de producción.
        // Mala práctica poner en el código expuesta, se debe crear una variable de entorno, en este caso para agilizar la ejecución de la prueba, se deja expuesta, una vez revisada, se baja y se elimina del commit del repositorio
        this.API_KEY = "fca_live_SMWRP01gWQtjWY7fpJGj7A9WelaPKbOWmwMNypI4";
        this.BASE_URL =
            `https://api.freecurrencyapi.com/v1/latest?apikey=${this.API_KEY}`;
        this.rates = {};
    }

    async fetchRates() {
        const res = await axios.get(this.BASE_URL);
        if (!res.data || !res.data.data) {
            throw new Error("No se pudo obtener las tasas de cambio");
        }
        this.rates = res.data.data;
        return this.rates;
    }
}
