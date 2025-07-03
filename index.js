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

async function mainMenu() {
    console.log("\n💱 Convertidor de Divisas\n");
    console.log("1. Mostrar monedas disponibles");
    console.log("2. Mostrar tasas de cambio");
    console.log("3. Establecer monedas base y destino");
    console.log("4. Establecer cantidad a convertir");
    console.log("5. Convertir y mostrar resultados");
    console.log("6. Ver historial de conversiones");
    console.log("7. Salir");

    rl.question("\nSeleccione una opción: ", async (answer) => {
        switch (answer.trim()) {
            case "1":
                console.log(
                    "Monedas disponibles:",
                    Object.keys(api.rates).join(", "),
                );
                break;
            case "2":
                console.log("Tasas de cambio:", api.rates);
                break;
            case "3":
                await setCurrencies();
                return;
            case "4":
                await setAmount();
                return;
            case "5":
                convert();
                return;
            case "6":
                console.log("Historial:", history.getAll());
                break;
            case "7":
                rl.close();
                return;
            default:
                console.log("❌ Opción no válida.");
        }
        mainMenu();
    });
}

async function setCurrencies() {
    rl.question("Ingrese la moneda base (ej: USD): ", (base) => {
        rl.question(
            "Ingrese monedas destino separadas por coma (ej: EUR,JPY): ",
            (targets) => {
                try {
                    converter.setCurrencies(
                        base.trim().toUpperCase(),
                        targets.split(",").map((t) => t.trim().toUpperCase()),
                    );
                } catch (e) {
                    console.error("❌ Error:", e.message);
                }
                mainMenu();
            },
        );
    });
}

async function setAmount() {
    rl.question("Ingrese la cantidad a convertir: ", (amt) => {
        try {
            converter.setAmount(amt);
        } catch (e) {
            console.error("❌ Error:", e.message);
        }
        mainMenu();
    });
}

function convert() {
    try {
        const results = converter.convert();
        console.log("✅ Resultados:", results);
        history.add({
            base: converter.base,
            targets: converter.targets,
            amount: converter.amount,
            result: results,
        });
    } catch (e) {
        console.error("❌ Error:", e.message);
    }
    mainMenu();
}

api.fetchRates().then((rates) => {
    converter.setRates(rates);
    mainMenu();
}).catch((err) => {
    console.error("❌ Error al obtener tasas de cambio:", err.message);
    rl.close();
});
