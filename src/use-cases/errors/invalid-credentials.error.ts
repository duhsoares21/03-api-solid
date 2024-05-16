export class InvalidCredentialsError extends Error {
    constructor() {
        super('Dados de acesso incorretos!');
    }
}
