export class History {
    constructor() {
        this.entries = [];
    }
    // Agrega una nueva conversión en el historial.
    add(entry) {
        this.entries.push({ ...entry, timestamp: new Date().toISOString() });
    }

    // Muestra el historial en formato amigable.
    getAll() {
        return this.entries.map((e) => {
            return `${e.timestamp} | ${e.amount} ${e.base} → ${
                e.targets.join(", ")
            } = ${JSON.stringify(e.result)}`;
        });
    }
}
