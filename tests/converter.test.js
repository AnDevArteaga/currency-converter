import { beforeEach, describe, expect, it } from "vitest";
import { CurrencyConverter } from "../src/converter.js";

describe("CurrencyConverter", () => {
    let converter;

    beforeEach(() => {
        converter = new CurrencyConverter();
        converter.setRates({ USD: 1, EUR: 0.85, JPY: 150 });
    });

    it("debe establecer correctamente las tasas", () => {
        expect(converter.rates).toEqual({ USD: 1, EUR: 0.85, JPY: 150 });
    });

    it("lanza error si la moneda base no existe", () => {
        expect(() => converter.setCurrencies("INVALID", ["EUR"])).toThrow();
    });

    it("lanza error si alguna moneda destino no existe", () => {
        expect(() => converter.setCurrencies("USD", ["EUR", "XXX"])).toThrow();
    });

    it("establece correctamente base y destino", () => {
        converter.setCurrencies("USD", ["EUR", "JPY"]);
        expect(converter.base).toBe("USD");
        expect(converter.targets).toEqual(["EUR", "JPY"]);
    });

    it("lanza error si el monto no es válido", () => {
        expect(() => converter.setAmount("abc")).toThrow();
    });

    it("establece correctamente el monto", () => {
        converter.setAmount("123.45");
        expect(converter.amount).toBeCloseTo(123.45);
    });

    it("lanza error si no se definen monedas o cantidad", () => {
        expect(() => converter.convert()).toThrow();
    });

    it("convierte correctamente entre monedas", () => {
        converter.setCurrencies("USD", ["EUR", "JPY"]);
        converter.setAmount("100");
        const result = converter.convert();
        expect(result.EUR).toBeCloseTo(85.00);
        expect(result.JPY).toBeCloseTo(15000);
    });
});
