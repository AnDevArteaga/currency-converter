// index.js
import readline from "readline";
import { CurrencyAPI } from "./src/api.js";
import { CurrencyConverter } from "./src/converter.js";
import { History } from "./src/history.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const api = new CurrencyAPI();
const converter = new CurrencyConverter();
const history = new History();

let supportedCurrencies = [];

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const prompt = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

async function main() {
    try {
        const rates = await api.fetchRates();
        converter.setRates(rates);
        supportedCurrencies = Object.keys(rates);
        menu();
    } catch (err) {
        console.error("Error al obtener tasas:", err);
        rl.close();
    }
}

async function menu() {
    console.log("\n------ Convertidor de Divisas ------");
    console.log("1. Mostrar monedas disponibles");
    console.log("2. Mostrar tasas de cambio");
    console.log("3. Establecer moneda base y destino");
    console.log("4. Establecer cantidad a convertir");
    console.log("5. Convertir");
    console.log("6. Ver historial");
    console.log("7. Salir");

    const choice = await prompt("Elige una opción: ");
    switch (choice) {
        case "1":
            console.log("Monedas disponibles:", supportedCurrencies.join(", "));
            await pause(2000);
            return menu();

        case "2":
            console.log("Tasas de cambio:");
            for (const [key, val] of Object.entries(converter.rates)) {
                console.log(`${key}: ${val}`);
            }
            await pause(2000);
            return menu();

        case "3": {
            let base = (await prompt("Ingresa la moneda base (3 letras): "))
                .trim().toUpperCase();
            if (base.length > 3) base = base.slice(0, 3);
            const targetsInput =
                (await prompt(
                    "Ingresa monedas destino separadas por coma (ej: EUR,JPY): ",
                )).trim();
            const targets = targetsInput.split(",").map((t) =>
                t.trim().toUpperCase()
            );

            try {
                converter.setCurrencies(base, targets);
                console.log(`✅ Moneda base: ${base}`);
                console.log(`✅ Monedas destino: ${targets.join(", ")}`);
            } catch (e) {
                console.error("❌", e.message);
            }
            await pause(2000);
            return menu();
        }

        case "4": {
            const amount = await prompt("Ingresa la cantidad a convertir: ");
            try {
                converter.setAmount(amount);
                console.log(`✅ Cantidad establecida: ${converter.amount}`);
            } catch (e) {
                console.error("❌", e.message);
            }
            await pause(2000);
            return menu();
        }

        case "5": {
            try {
                const result = converter.convert();
                console.log("\n=== Resultado ===");
                console.log(`Cantidad: ${converter.amount} ${converter.base}`);
                for (const [target, value] of Object.entries(result)) {
                    console.log(`${target}: ${value.toFixed(2)}`);
                }
                history.add({
                    base: converter.base,
                    targets: converter.targets,
                    amount: converter.amount,
                    result,
                });
            } catch (e) {
                console.error("❌", e.message);
            }
            await pause(2000);
            return menu();
        }

        case "6": {
            console.log("Historial de conversiones:");
            const logs = history.getAll();
            if (logs.length === 0) console.log("Sin historial.");
            else logs.forEach((log, idx) => console.log(`${idx + 1}. ${log}`));
            await pause(2000);
            return menu();
        }

        case "7":
            console.log("👋 ¡Hasta pronto!");
            rl.close();
            break;

        default:
            console.log("Opción inválida");
            await pause(1000);
            return menu();
    }
}

main();
