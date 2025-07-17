import dotenv from "dotenv";
import { CurrencyAPI } from "./src/api.js";
import { CurrencyConverter } from "./src/converter.js";
import { History } from "./src/history.js";
import { InputValidator } from "./src/validators.js";
import { APP_CONFIG, ERROR_MESSAGES, SUCCESS_MESSAGES } from "./src/config.js";
import { showAvailableCurrencies, showHistory, showExchangeRates, setCurrencies, setAmount, performConversion, exitApplication } from "./src/handlers/menuAction.js";
import { rl, showError, pause, prompt } from "./src/utils/utils.js";
// Cargar variables de entorno desde el archivo .env
dotenv.config();


const api = new CurrencyAPI();
const converter = new CurrencyConverter();
const history = new History();
let supportedCurrencies = [];


async function main() {
    try {
        console.log("Iniciando convertidor de divisas...");
        console.log("Obteniendo tasas de cambio...");
        
        const rates = await api.fetchRates();
        converter.setRates(rates);
        supportedCurrencies = api.getAvailableCurrencies();
        
        console.log(`Sistema iniciado correctamente con ${supportedCurrencies.length} monedas disponibles`);
        await pause(1000);
        
        await menu();
    } catch (error) {
        console.error("Error fatal al inicializar la aplicación:");
        console.error(error.message);
        console.log("Sugerencias:");
        console.log("• Verifica tu conexión a internet");
        console.log("• Asegúrate de que la variable API_KEY esté configurada");
        console.log("• Intenta ejecutar la aplicación nuevamente");
        rl.close();
        process.exit(1);
    }
}

async function menu() {
    try {
        //console.clear();
        console.log("        CONVERTIDOR DE DIVISAS          ");
        console.log(" 1. Mostrar monedas disponibles         ");
        console.log(" 2. Mostrar tasas de cambio             ");
        console.log(" 3. Establecer moneda base y destino    ");
        console.log(" 4. Establecer cantidad a convertir     ");
        console.log(" 5. Convertir                           ");
        console.log(" 6. Ver historial                       ");
        console.log(" 7. Salir                               ");

        // Mostrar estado actual
        const status = converter.getStatus();
        console.log("Estado actual:");
        console.log(`   Moneda base: ${status.base || "No establecida"}`);
        console.log(`   Monedas destino: ${status.targets.length > 0 ? status.targets.join(", ") : "No establecidas"}`);
        console.log(`   Cantidad: ${status.amount > 0 ? status.amount : "No establecida"}`);
        console.log(`   Listo para convertir: ${status.isReady ? "✅" : "❌"}`);

        const choice = await prompt("\n🔸 Elige una opción (1-7): ");
        
        const validation = InputValidator.validateMenuChoice(choice);
        if (!validation.isValid) {
            await showError(validation.error);
            return menu();
        }

        switch (validation.choice) {
            case "1":
                await showAvailableCurrencies(supportedCurrencies, pause, APP_CONFIG, showError);
                break;
            case "2":
                await showExchangeRates(converter, pause, APP_CONFIG, showError);
                break;
            case "3":
                await setCurrencies(api, converter, prompt, InputValidator, APP_CONFIG, pause, showError, SUCCESS_MESSAGES);
                break;
            case "4":
                await setAmount(prompt, pause, converter, SUCCESS_MESSAGES, APP_CONFIG, showError);
                break;
            case "5":
                await performConversion(converter, SUCCESS_MESSAGES, history, pause, APP_CONFIG, showError);
                break;
            case "6":
                await showHistory(history, pause, APP_CONFIG, showError);
                break;
            case "7":
                await exitApplication(history, rl, process);
                return;
            default:
                await showError(ERROR_MESSAGES.INVALID_MENU_OPTION);
                break;
        }

        return menu();
    } catch (error) {
        console.error("❌ Error inesperado en el menú:", error.message);
        await pause(APP_CONFIG.ERROR_PAUSE_DURATION);
        return menu();
    }
}



// Inicializar la aplicación
main();