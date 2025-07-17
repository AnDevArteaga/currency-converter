import { APP_CONFIG, ERROR_MESSAGES } from "./config.js";

export class InputValidator {
    //Valida si una cadena de texto no está vacía
    static isNotEmpty(input) {
        return input && input.trim().length > 0;
    }

    //Valida un código de moneda
    static validateCurrency(currency) {
        if (!this.isNotEmpty(currency)) {
            return { isValid: false, error: ERROR_MESSAGES.EMPTY_INPUT };
        }

        const trimmed = currency.trim().toUpperCase();
        
        if (trimmed.length !== APP_CONFIG.MIN_CURRENCY_CODE_LENGTH) {
            return { isValid: false, error: ERROR_MESSAGES.INVALID_CURRENCY };
        }

        // Verificar que solo contenga letras
        if (!/^[A-Z]{3}$/.test(trimmed)) {
            return { isValid: false, error: ERROR_MESSAGES.INVALID_CURRENCY };
        }

        return { isValid: true, currency: trimmed };
    }

    
     //Valida una cantidad para conversión

    static validateAmount(amountStr) {
        if (!this.isNotEmpty(amountStr)) {
            return { isValid: false, error: ERROR_MESSAGES.EMPTY_INPUT };
        }

        //reemplazar comas por puntos)
        const normalized = amountStr.trim().replace(",", ".");
        
        // Verificar que sea un número válido
        if (!/^\d+(\.\d{1,10})?$/.test(normalized)) {
            return { isValid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
        }

        const amount = parseFloat(normalized);

        if (isNaN(amount)) {
            return { isValid: false, error: ERROR_MESSAGES.INVALID_AMOUNT };
        }

        if (amount < APP_CONFIG.MIN_AMOUNT) {
            return { isValid: false, error: ERROR_MESSAGES.AMOUNT_TOO_LOW };
        }

        if (amount > APP_CONFIG.MAX_AMOUNT) {
            return { isValid: false, error: ERROR_MESSAGES.AMOUNT_TOO_HIGH };
        }

        return { isValid: true, amount: parseFloat(amount.toFixed(APP_CONFIG.DECIMAL_PLACES)) };
    }

//Validar monedas destino
    static validateTargets(targetsInput) {
        if (!this.isNotEmpty(targetsInput)) {
            return { isValid: false, error: ERROR_MESSAGES.EMPTY_INPUT };
        }

        const targets = targetsInput.split(",").map(t => t.trim().toUpperCase()).filter(t => t);

        if (targets.length === 0) {
            return { isValid: false, error: ERROR_MESSAGES.EMPTY_INPUT };
        }

        // Validar cada moneda destino
        for (const target of targets) {
            const validation = this.validateCurrency(target);
            if (!validation.isValid) {
                return { isValid: false, error: `Moneda destino inválida: ${target}. ${validation.error}` };
            }
        }

        // Verificar que no haya duplicados
        const uniqueTargets = [...new Set(targets)];
        if (uniqueTargets.length !== targets.length) {
            return { isValid: false, error: "No se permiten monedas duplicadas en los destinos." };
        }

        return { isValid: true, targets: uniqueTargets };
    }

    //Valida una opción del menú
    static validateMenuChoice(choice) {
        if (!this.isNotEmpty(choice)) {
            return { isValid: false, error: ERROR_MESSAGES.EMPTY_INPUT };
        }

        const trimmed = choice.trim();
        
        if (!/^[1-7]$/.test(trimmed)) {
            return { isValid: false, error: ERROR_MESSAGES.INVALID_MENU_OPTION };
        }

        return { isValid: true, choice: trimmed };
    }
}