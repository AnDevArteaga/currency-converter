    import { APP_CONFIG, ERROR_MESSAGES } from "./config.js";
    import { InputValidator } from "./validators.js";

    export class CurrencyConverter {
        constructor() {
            this.base = null;
            this.targets = [];
            this.amount = 0;
            this.rates = {};
        }

        setRates(rates) {
            if (!rates || typeof rates !== "object") {
                throw new Error("Las tasas de cambio deben ser un objeto válido.");
            }

            if (Object.keys(rates).length === 0) {
                throw new Error("No se proporcionaron tasas de cambio.");
            }

            this.rates = rates;
        }

        setCurrencies(base, targets) {
            // Validar moneda base
            const baseValidation = InputValidator.validateCurrency(base);
            if (!baseValidation.isValid) {
                throw new Error(`Moneda base inválida: ${baseValidation.error}`);
            }

            // Verificar que la moneda base esté disponible en las tasas
            if (!this.rates[baseValidation.currency]) {
                throw new Error(`Moneda base no disponible: ${baseValidation.currency}`);
            }

            // Validar monedas destino
            if (!Array.isArray(targets) || targets.length === 0) {
                throw new Error("Debes proporcionar al menos una moneda destino.");
            }

            const validTargets = [];
            for (const target of targets) {
                const targetValidation = InputValidator.validateCurrency(target);
                if (!targetValidation.isValid) {
                    throw new Error(`Moneda destino inválida: ${target}. ${targetValidation.error}`);
                }

                if (!this.rates[targetValidation.currency]) {
                    throw new Error(`Moneda destino no disponible: ${targetValidation.currency}`);
                }

                validTargets.push(targetValidation.currency);
            }

            // Verificar que no haya duplicados
            const uniqueTargets = [...new Set(validTargets)];
            if (uniqueTargets.length !== validTargets.length) {
                throw new Error("No se permiten monedas duplicadas en los destinos.");
            }

            // Verificar que la moneda base no esté en los destinos
            if (uniqueTargets.includes(baseValidation.currency)) {
                throw new Error("La moneda base no puede ser igual a una moneda destino.");
            }

            this.base = baseValidation.currency;
            this.targets = uniqueTargets;
        }

        setAmount(amountStr) {
            const validation = InputValidator.validateAmount(amountStr);
            if (!validation.isValid) {
                throw new Error(validation.error);
            }

            this.amount = validation.amount;
        }

        convert() {
            // Verificar que las monedas estén establecidas
            if (!this.base || this.targets.length === 0) {
                throw new Error(ERROR_MESSAGES.CURRENCIES_NOT_SET);
            }

            // Verificar que el monto esté establecido
            if (this.amount <= 0) {
                throw new Error(ERROR_MESSAGES.AMOUNT_NOT_SET);
            }

            // Verificar que las tasas estén disponibles
            const baseRate = this.rates[this.base];
            if (!baseRate || isNaN(baseRate) || baseRate <= 0) {
                throw new Error(`Tasa de cambio inválida para la moneda base: ${this.base}`);
            }

            const results = {};

            try {
                this.targets.forEach((target) => {
                    const targetRate = this.rates[target];
                    if (!targetRate || isNaN(targetRate) || targetRate <= 0) {
                        throw new Error(`Tasa de cambio inválida para la moneda destino: ${target}`);
                    }

                    // Conversión: (monto / tasa_base) * tasa_destino
                    const convertedAmount = (this.amount / baseRate) * targetRate;
                    
                    // Verificar que el resultado sea válido
                    if (isNaN(convertedAmount) || !isFinite(convertedAmount)) {
                        throw new Error(`Error en la conversión a ${target}`);
                    }

                    results[target] = parseFloat(convertedAmount.toFixed(APP_CONFIG.DECIMAL_PLACES));
                });

                return results;
            } catch (error) {
                throw new Error(`Error en la conversión: ${error.message}`);
            }
        }


        getStatus() {
            return {
                base: this.base,
                targets: this.targets,
                amount: this.amount,
                hasRates: Object.keys(this.rates).length > 0,
                isReady: this.base && this.targets.length > 0 && this.amount > 0 && Object.keys(this.rates).length > 0
            };
        }

        reset() {
            this.base = null;
            this.targets = [];
            this.amount = 0;
        }
    }