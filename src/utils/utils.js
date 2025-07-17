import readline from "readline";

export const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
 
export const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
export const prompt = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

export async function showError(message) {
    console.error("❌", message);
    await pause(3000);
}