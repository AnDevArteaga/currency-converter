//Muestra las monedas disponibles
export async function showAvailableCurrencies(supportedCurrencies, pause, APP_CONFIG, showError) {
    try {
        console.log("Monedas disponibles:");
        console.log("═".repeat(50));
        
        // Mostrar monedas en columnas para mejor visualización
        const currencies = supportedCurrencies;
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

//Muestra las tasas de cambio actuales

export async function showExchangeRates(converter, pause, APP_CONFIG, showError) {
    try {
        console.log("Tasas de cambio actuales:");
        console.log("═".repeat(50));
        
        const rates = converter.rates;
        const sortedRates = Object.entries(rates).sort(([a], [b]) => a.localeCompare(b));
        
        // Mostrar en columnas para mejor visualización
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

//Establece la moneda base y destino
export async function setCurrencies(
    api,
    converter,
    prompt,
    InputValidator,
    APP_CONFIG,
    pause,
    showError,
    SUCCESS_MESSAGES
) {
    try {
        console.log("Configurar monedas para conversión");
        console.log("═".repeat(50));

        const baseInput = await prompt("💎 Ingresa la moneda base (3 letras, ej: USD): ");
        const baseValidation = InputValidator.validateCurrency(baseInput);

        if (!baseValidation.isValid) {
            await showError(baseValidation.error);
            return;
        }

        if (!api.isCurrencyAvailable(baseValidation.currency)) {
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
            if (!api.isCurrencyAvailable(target)) {
                await showError(`La moneda ${target} no está disponible`);
                return;
            }
        }

        converter.setCurrencies(baseValidation.currency, targetsValidation.targets);

        console.log("\n" + SUCCESS_MESSAGES.CURRENCIES_SET);
        console.log(`Moneda base: ${baseValidation.currency}`);
        console.log(`Monedas destino: ${targetsValidation.targets.join(", ")}`);

        await pause(APP_CONFIG.PAUSE_DURATION);
    } catch (error) {
        await showError(error.message);
    }
}

export async function setAmount(prompt, pause, converter, SUCCESS_MESSAGES, APP_CONFIG, showError) {
    try {
        console.log("Establecer cantidad a convertir");
        console.log("═".repeat(50));
        
        const amountInput = await prompt("Ingresa la cantidad (usa . para decimales): ");
        
        converter.setAmount(amountInput);
        
        console.log("\n" + SUCCESS_MESSAGES.AMOUNT_SET);
        console.log(`Cantidad: ${converter.amount}`);
        
        await pause(APP_CONFIG.PAUSE_DURATION);
    } catch (error) {
        await showError(error.message);
    }
}


export async function performConversion(converter, SUCCESS_MESSAGES, history, pause, APP_CONFIG, showError ) {
    try {
        console.log("Realizando conversión...");
        console.log("═".repeat(50));
        
        const result = converter.convert();
        
        console.log("\n" + SUCCESS_MESSAGES.CONVERSION_SUCCESS);
        console.log("═".repeat(50));
        console.log(`Cantidad original: ${converter.amount} ${converter.base}`);
        console.log("═".repeat(50));
        
        Object.entries(result).forEach(([currency, value]) => {
            console.log(` ${currency.padEnd(8)} : ${value.toFixed(APP_CONFIG.DECIMAL_PLACES).padStart(12)}`);
        });
        
        console.log("═".repeat(50));
        
        // Agregar al historial
        history.add({
            base: converter.base,
            targets: converter.targets,
            amount: converter.amount,
            result: result
        });
        
        console.log(" Conversión guardada en el historial");
        
        await pause(APP_CONFIG.PAUSE_DURATION);
    } catch (error) {
        await showError(error.message);
    }
}

export async function showHistory(history, pause, APP_CONFIG, showError) {
    try {
        console.log("Historial de conversiones");
        console.log("═".repeat(70));
        
        const logs = history.getAll();
        
        if (logs.length === 0) {
            console.log("📭 No hay conversiones en el historial");
        } else {
            logs.forEach((log, index) => {
                console.log(`${(index + 1).toString().padStart(3)}. ${log}`);
            });
            
            console.log("═".repeat(70));
            
            // Mostrar estadísticas
            const stats = history.getStatistics();
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

//Maneja la salida de la aplicación
export async function exitApplication(history, rl, process) {
    try {
        console.log("Finalizando aplicación...");
        
        const stats = history.getStatistics();
        if (stats.totalEntries > 0) {
            console.log(`Realizaste ${stats.totalEntries} conversiones en esta sesión`);
        }
        
        console.log("¡Gracias por usar el Convertidor de Divisas!");
        console.log("¡Hasta pronto!");
        
        rl.close();
        process.exit(0);
    } catch (error) {
        console.error("Error al cerrar la aplicación:", error.message);
        rl.close();
        process.exit(1);
    }
}