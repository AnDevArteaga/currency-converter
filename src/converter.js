export class CurrencyConverter {
    constructor() {
        this.base = null;
        this.targets = [];
        this.amount = 0;
        this.rates = {};
    }

    // Establece las tasas de cambio obtenidas desde la API.
    setRates(rates) {
        this.rates = rates;
    }
    // Establece la moneda de origen y destino.
    setCurrencies(base, targets) {
        if (!this.rates[base]) throw new Error("Moneda base inválida");
        targets.forEach((t) => {
            if (!this.rates[t]) {
                throw new Error(`Moneda destino inválida: ${t}`);
            }
        });
        this.base = base;
        this.targets = targets;
    }
    // Establece el monto a convertir. Se convierte a Decimal para evitar errores de redondeo.
    setAmount(amountStr) {
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) throw new Error("Cantidad inválida");
        this.amount = parseFloat(amount.toFixed(2));
    }
    // Realiza la conversión entre monedas usando las tasas actuales.
    convert() {
        if (!this.base || this.targets.length === 0) {
            throw new Error("Debes establecer monedas");
        }
        if (this.amount <= 0) throw new Error("Debes establecer una cantidad mayor que 0.");
        const baseRate = this.rates[this.base];
        const results = {};

        this.targets.forEach((t) => {
            const rate = this.rates[t];
            results[t] = parseFloat(
                ((this.amount / baseRate) * rate).toFixed(2),
            );
        });

        return results;
    }
}
