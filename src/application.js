import dotenv from "dotenv";
import { CurrencyAPI } from "./api.js";
import { CurrencyConverter } from "./converter.js";
import { History } from "./history.js";
import { InputValidator } from "./validators.js";
import { APP_CONFIG } from "./config.js";
import { MenuHandler } from "./handlers/menuHandler.js";
import { rl, showError, pause, prompt } from "./utils/utils.js";

dotenv.config();

export class Application {
    constructor() {
        this.api = new CurrencyAPI();
        this.converter = new CurrencyConverter();
        this.history = new History();
        this.menuHandler = new MenuHandler(this);
        this.supportedCurrencies = [];
        this.isRunning = false;
    }

    async initialize() {
        try {
            console.log("Iniciando convertidor de divisas...");
            console.log("Obteniendo tasas de cambio...");
            
            const rates = await this.api.fetchRates();
            this.converter.setRates(rates);
            this.supportedCurrencies = this.api.getAvailableCurrencies();
            
            console.log(`Sistema iniciado correctamente con ${this.supportedCurrencies.length} monedas disponibles`);
            await pause(1000);
            
            return true;
        } catch (error) {
            this.handleInitializationError(error);
            return false;
        }
    }

    async start() {
        const initialized = await this.initialize();
        if (!initialized) return;

        this.isRunning = true;
        while (this.isRunning) {
            try {
                await this.showMenu();
                const choice = await this.getMenuChoice();
                await this.handleMenuChoice(choice);
            } catch (error) {
                console.error("❌ Error inesperado en el menú:", error.message);
                await pause(APP_CONFIG.ERROR_PAUSE_DURATION);
            }
        }
    }

    async showMenu() {
        console.log("        CONVERTIDOR DE DIVISAS          ");
        console.log(" 1. Mostrar monedas disponibles         ");
        console.log(" 2. Mostrar tasas de cambio             ");
        console.log(" 3. Establecer moneda base y destino    ");
        console.log(" 4. Establecer cantidad a convertir     ");
        console.log(" 5. Convertir                           ");
        console.log(" 6. Ver historial                       ");
        console.log(" 7. Salir                               ");
        
        this.showCurrentStatus();
    }

    showCurrentStatus() {
        const status = this.converter.getStatus();
        console.log("Estado actual:");
        console.log(`   Moneda base: ${status.base || "No establecida"}`);
        console.log(`   Monedas destino: ${status.targets.length > 0 ? status.targets.join(", ") : "No establecidas"}`);
        console.log(`   Cantidad: ${status.amount > 0 ? status.amount : "No establecida"}`);
        console.log(`   Listo para convertir: ${status.isReady ? "✅" : "❌"}`);
    }

    async getMenuChoice() {
        const choice = await prompt("\n🔸 Elige una opción (1-7): ");
        const validation = InputValidator.validateMenuChoice(choice);
        
        if (!validation.isValid) {
            await showError(validation.error);
            return this.getMenuChoice(); // Recursión controlada
        }
        
        return validation.choice;
    }

    async handleMenuChoice(choice) {
        switch (choice) {
            case "1":
                await this.menuHandler.showAvailableCurrencies();
                break;
            case "2":
                await this.menuHandler.showExchangeRates();
                break;
            case "3":
                await this.menuHandler.setCurrencies();
                break;
            case "4":
                await this.menuHandler.setAmount();
                break;
            case "5":
                await this.menuHandler.performConversion();
                break;
            case "6":
                await this.menuHandler.showHistory();
                break;
            case "7":
                await this.exit();
                break;
        }
    }

    async exit() {
        this.isRunning = false;
        
        console.log("Finalizando aplicación...");
        
        const stats = this.history.getStatistics();
        if (stats.totalEntries > 0) {
            console.log(`Realizaste ${stats.totalEntries} conversiones en esta sesión`);
        }
        
        console.log("¡Gracias por usar el Convertidor de Divisas!");
        console.log("¡Hasta pronto!");
        
        rl.close();
        process.exit(0);
    }

    handleInitializationError(error) {
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