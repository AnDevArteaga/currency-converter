import { beforeEach, describe, expect, it } from "vitest";
import { History } from "../src/history.js";

describe("History", () => {
    let history;

    beforeEach(() => {
        history = new History();
    });

    it("debe empezar vacío", () => {
        expect(history.getAll()).toEqual([]);
    });

    it("agrega una entrada correctamente", () => {
        const entry = {
            base: "USD",
            targets: ["EUR"],
            amount: 100,
            result: { EUR: 90 },
        };
        history.add(entry);

        const logs = history.getAll();
        expect(logs.length).toBe(1);
        expect(logs[0]).toContain("USD");
        expect(logs[0]).toContain("EUR");
        expect(logs[0]).toContain("90");
    });

    it("agrega múltiples entradas y las devuelve en orden", () => {
        history.add({
            base: "USD",
            targets: ["EUR"],
            amount: 50,
            result: { EUR: 45 },
        });
        history.add({
            base: "USD",
            targets: ["JPY"],
            amount: 100,
            result: { JPY: 15000 },
        });

        const logs = history.getAll();
        expect(logs.length).toBe(2);
        expect(logs[1]).toContain("JPY");
    });
});
