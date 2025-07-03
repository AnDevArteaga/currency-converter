import { beforeEach, describe, expect, it, vi } from "vitest";
import axios from "axios";
import { CurrencyAPI } from "../src/api.js";

vi.mock("axios");

describe("CurrencyAPI", () => {
    let api;

    beforeEach(() => {
        api = new CurrencyAPI();
    });

    it("debe obtener las tasas de cambio correctamente", async () => {
        const mockData = {
            data: {
                data: {
                    USD: 1,
                    EUR: 0.9,
                    COP: 4000,
                },
            },
        };
        axios.get.mockResolvedValueOnce(mockData);

        const result = await api.fetchRates();

        expect(result).toEqual({ USD: 1, EUR: 0.9, COP: 4000 });
        expect(api.rates).toEqual(result);
    });

    it("lanza error si no hay respuesta válida", async () => {
        axios.get.mockResolvedValueOnce({});
        await expect(api.fetchRates()).rejects.toThrow(
            "No se pudo obtener las tasas de cambio",
        );
    });
});
