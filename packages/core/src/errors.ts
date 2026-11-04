/** Erro de entrada inválida, com mensagem pronta para o usuário (pt-BR). */
export class ValidationError extends Error {
  constructor(
    public readonly field: string,
    message: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/** Falta um dado necessário para o cálculo (ex.: referência de passagem para a rota). */
export class MissingDataError extends Error {
  constructor(
    public readonly what: string,
    message: string,
  ) {
    super(message);
    this.name = "MissingDataError";
  }
}

export function assertInteger(field: string, value: number, min: number, max: number, label: string): void {
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new ValidationError(field, `${label} deve ser um número inteiro entre ${min} e ${max}.`);
  }
}
