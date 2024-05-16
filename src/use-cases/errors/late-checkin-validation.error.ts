export class LateCheckinValidationError extends Error {
    constructor() {
        super('Prazo de validação do Check-In expirou!');
    }
}
