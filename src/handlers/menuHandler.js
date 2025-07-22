// src/handlers/menuHandler.js
import { APP_CONFIG, SUCCESS_MESSAGES } from "../config.js";
import { showError, pause, prompt } from "../utils/utils.js";
import { InputValidator } from "../validators.js";

export class MenuHandler {
    constructor(app) {
        this.app = app;
    }

    get api() { return this.app.api; }
    get converter() { return this.app.converter; }
    get history() { return this.app.history; }
    get supportedCurrencies() { return this.app.supportedCurrencies; }

    async showAvailableCurrencies() {
        try {
            console.log("Monedas disponibles:");
            console.log("═".repeat(50));
            
            const currencies = this.supportedCurrencies;
            const columns = 5;
            
            for (let i = 0; i < currencies.length; i += columns) {
                const row = currencies.slice(i, i + columns);
                console.log(row.map(curr => curr.padEnd(8)).join(" "));
            }
            
            console.log("═".repeat(50));
            console.log(`Total: ${currencies.length} monedas disponibles`);
            
            await pause(APP_CONFIG.PAUSE_DURATION);
        } catch (error) {
            await showError("Error al mostrar monedas disponibles");
        }
    }

    async showExchangeRates() {
        try {
            console.log("Tasas de cambio actuales:");
            console.log("═".repeat(50));
            
            const rates = this.converter.rates;
            const sortedRates = Object.entries(rates).sort(([a], [b]) => a.localeCompare(b));
            
            sortedRates.forEach(([currency, rate]) => {
                const formattedRate = rate.toFixed(6);
                console.log(`${currency.padEnd(8)} : ${formattedRate.padStart(12)}`);
            });
            
            console.log("═".repeat(50));
            console.log(`Total: ${sortedRates.length} tasas de cambio`);
            
            await pause(APP_CONFIG.PAUSE_DURATION);
        } catch (error) {
            await showError("Error al mostrar tasas de cambio");
        }
    }

    async setCurrencies() {
        try {
            console.log("Configurar monedas para conversión");
            console.log("═".repeat(50));

            const baseInput = await prompt("💎 Ingresa la moneda base (3 letras, ej: USD): ");
            const baseValidation = InputValidator.validateCurrency(baseInput);

            if (!baseValidation.isValid) {
                await showError(baseValidation.error);
                return;
            }

            if (!this.api.isCurrencyAvailable(baseValidation.currency)) {
                await showError(`La moneda ${baseValidation.currency} no está disponible`);
                return;
            }

            const targetsInput = await prompt("Ingresa monedas destino separadas por coma (ej: EUR,JPY,GBP): ");
            const targetsValidation = InputValidator.validateTargets(targetsInput);

            if (!targetsValidation.isValid) {
                await showError(targetsValidation.error);
                return;
            }

            for (const target of targetsValidation.targets) {
                if (!this.api.isCurrencyAvailable(target)) {
                    await showError(`La moneda ${target} no está disponible`);
                    return;
                }
            }

            this.converter.setCurrencies(baseValidation.currency, targetsValidation.targets);

            console.log("\n" + SUCCESS_MESSAGES.CURRENCIES_SET);
            console.log(`Moneda base: ${baseValidation.currency}`);
            console.log(`Monedas destino: ${targetsValidation.targets.join(", ")}`);

            await pause(APP_CONFIG.PAUSE_DURATION);
        } catch (error) {
            await showError(error.message);
        }
    }

    async setAmount() {
        try {
            console.log("Establecer cantidad a convertir");
            console.log("═".repeat(50));
            
            const amountInput = await prompt("Ingresa la cantidad (usa . para decimales): ");
            
            this.converter.setAmount(amountInput);
            
            console.log("\n" + SUCCESS_MESSAGES.AMOUNT_SET);
            console.log(`Cantidad: ${this.converter.amount}`);
            
            await pause(APP_CONFIG.PAUSE_DURATION);
        } catch (error) {
            await showError(error.message);
        }
    }

    async performConversion() {
        try {
            console.log("Realizando conversión...");
            console.log("═".repeat(50));
            
            const result = this.converter.convert();
            
            console.log("\n" + SUCCESS_MESSAGES.CONVERSION_SUCCESS);
            console.log("═".repeat(50));
            console.log(`Cantidad original: ${this.converter.amount} ${this.converter.base}`);
            console.log("═".repeat(50));
            
            Object.entries(result).forEach(([currency, value]) => {
                console.log(` ${currency.padEnd(8)} : ${value.toFixed(APP_CONFIG.DECIMAL_PLACES).padStart(12)}`);
            });
            
            console.log("═".repeat(50));
            
            this.history.add({
                base: this.converter.base,
                targets: this.converter.targets,
                amount: this.converter.amount,
                result: result
            });
            
            console.log(" Conversión guardada en el historial");
            
            await pause(APP_CONFIG.PAUSE_DURATION);
        } catch (error) {
            await showError(error.message);
        }
    }

    async showHistory() {
        try {
            console.log("Historial de conversiones");
            console.log("═".repeat(70));
            
            const logs = this.history.getAll();
            
            if (logs.length === 0) {
                console.log("📭 No hay conversiones en el historial");
            } else {
                logs.forEach((log, index) => {
                    console.log(`${(index + 1).toString().padStart(3)}. ${log}`);
                });
                
                console.log("═".repeat(70));
                
                const stats = this.history.getStatistics();
                console.log("Estadísticas del historial:");
                console.log(`   Total de conversiones: ${stats.totalEntries}`);
                console.log(`   Moneda base más usada: ${stats.mostUsedBaseCurrency || "N/A"}`);
                console.log(`   Moneda destino más usada: ${stats.mostUsedTargetCurrency || "N/A"}`);
                console.log(`   Cantidad promedio: ${stats.averageAmount || "N/A"}`);
            }
            
            await pause(APP_CONFIG.PAUSE_DURATION);
        } catch (error) {
            await showError("Error al mostrar el historial");
        }
    }
}