export class MaxNumberOfCheckinsError extends Error {
    constructor() {
        super('Limite de check-ins atingido.');
    }
}
