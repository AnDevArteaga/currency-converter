import { APP_CONFIG } from "./config.js";

export class History {
    constructor() {
        this.entries = [];
    }


    add(entry) {
        try {

            const historyEntry = {
                ...entry,
                timestamp: new Date().toISOString(),
                id: this.generateId()
            };

            this.entries.push(historyEntry);

            // Limitar el historial a un máximo de entradas para evitar uso excesivo de memoria
            const maxEntries = 1000;
            if (this.entries.length > maxEntries) {
                this.entries = this.entries.slice(-maxEntries);
            }

        } catch (error) {
            console.error("Error al agregar entrada al historial:", error.message);
            throw error;
        }
    }


     //Obtiene todas las entradas del historial en formato legible

    getAll() {
        return this.entries.map((entry, index) => {
            try {
                const date = new Date(entry.timestamp);
                const formattedDate = date.toLocaleString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });

                const resultStr = Object.entries(entry.result)
                    .map(([currency, value]) => `${currency}: ${value.toFixed(APP_CONFIG.DECIMAL_PLACES)}`)
                    .join(", ");

                return `${formattedDate} | ${entry.amount} ${entry.base} → ${resultStr}`;
            } catch (error) {
                console.error("Error al formatear entrada del historial:", error.message);
                return `Entry ${index + 1}: Error al mostrar`;
            }
        });
    }

    getRecent(count = 10) {
        if (typeof count !== "number" || count <= 0) {
            count = 10;
        }

        return this.getAll().slice(-count);
    }

    //Busca entradas en el historial por moneda base

    findByBaseCurrency(baseCurrency) {
        if (!baseCurrency || typeof baseCurrency !== "string") {
            return [];
        }

        return this.entries.filter(entry => 
            entry.base && entry.base.toUpperCase() === baseCurrency.toUpperCase()
        );
    }

    //Busca entradas en el historial por moneda destino

    findByTargetCurrency(targetCurrency) {
        if (!targetCurrency || typeof targetCurrency !== "string") {
            return [];
        }

        return this.entries.filter(entry => 
            entry.targets && entry.targets.includes(targetCurrency.toUpperCase())
        );
    }

    //Obtiene estadísticas del historials
    getStatistics() {
        if (this.entries.length === 0) {
            return {
                totalEntries: 0,
                mostUsedBaseCurrency: null,
                mostUsedTargetCurrency: null,
                averageAmount: 0,
                dateRange: null
            };
        }

        try {
            // Contar monedas base más usadas
            const baseCurrencies = {};
            const targetCurrencies = {};
            let totalAmount = 0;
            let minDate = new Date(this.entries[0].timestamp);
            let maxDate = new Date(this.entries[0].timestamp);

            this.entries.forEach(entry => {
                baseCurrencies[entry.base] = (baseCurrencies[entry.base] || 0) + 1;
                entry.targets.forEach(target => {
                    targetCurrencies[target] = (targetCurrencies[target] || 0) + 1;
                });

                totalAmount += entry.amount;

                const entryDate = new Date(entry.timestamp);
                if (entryDate < minDate) minDate = entryDate;
                if (entryDate > maxDate) maxDate = entryDate;
            });

            const mostUsedBaseCurrency = Object.keys(baseCurrencies).reduce((a, b) => 
                baseCurrencies[a] > baseCurrencies[b] ? a : b
            );

            const mostUsedTargetCurrency = Object.keys(targetCurrencies).reduce((a, b) => 
                targetCurrencies[a] > targetCurrencies[b] ? a : b
            );

            return {
                totalEntries: this.entries.length,
                mostUsedBaseCurrency: mostUsedBaseCurrency,
                mostUsedTargetCurrency: mostUsedTargetCurrency,
                averageAmount: parseFloat((totalAmount / this.entries.length).toFixed(APP_CONFIG.DECIMAL_PLACES)),
                dateRange: {
                    from: minDate.toISOString(),
                    to: maxDate.toISOString()
                }
            };
        } catch (error) {
            console.error("Error al calcular estadísticas:", error.message);
            return {
                totalEntries: this.entries.length,
                mostUsedBaseCurrency: null,
                mostUsedTargetCurrency: null,
                averageAmount: 0,
                dateRange: null
            };
        }
    }

    clear() {
        this.entries = [];
    }

    count() {
        return this.entries.length;
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
}