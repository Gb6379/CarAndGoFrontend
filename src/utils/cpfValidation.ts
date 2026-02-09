/**
 * Remove caracteres não numéricos
 */
export function stripCpfCnpj(value: string): string {
  return (value || '').replace(/\D/g, '');
}

/**
 * Valida CPF (11 dígitos) pelo algoritmo dos dígitos verificadores
 */
export function validateCPF(cpf: string): boolean {
  const digits = stripCpfCnpj(cpf);
  if (digits.length !== 11) return false;

  // Rejeita sequências iguais (111.111.111-11, etc.)
  if (/^(\d)\1+$/.test(digits)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(digits[i], 10) * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(digits[i], 10) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10) remainder = 0;
  if (remainder !== parseInt(digits[10], 10)) return false;

  return true;
}

/**
 * Valida CNPJ (14 dígitos) pelo algoritmo dos dígitos verificadores
 */
export function validateCNPJ(cnpj: string): boolean {
  const digits = stripCpfCnpj(cnpj);
  if (digits.length !== 14) return false;

  if (/^(\d)\1+$/.test(digits)) return false;

  const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(digits[i], 10) * weights1[i];
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  if (digit1 !== parseInt(digits[12], 10)) return false;

  const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  sum = 0;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(digits[i], 10) * weights2[i];
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  if (digit2 !== parseInt(digits[13], 10)) return false;

  return true;
}

/**
 * Valida CPF ou CNPJ conforme o tamanho (11 = CPF, 14 = CNPJ)
 */
export function validateCpfCnpj(value: string): { valid: boolean; message?: string } {
  const digits = stripCpfCnpj(value);
  if (digits.length === 0) {
    return { valid: false, message: 'CPF/CNPJ é obrigatório.' };
  }
  if (digits.length === 11) {
    return validateCPF(value) ? { valid: true } : { valid: false, message: 'CPF inválido.' };
  }
  if (digits.length === 14) {
    return validateCNPJ(value) ? { valid: true } : { valid: false, message: 'CNPJ inválido.' };
  }
  return { valid: false, message: 'CPF deve ter 11 dígitos ou CNPJ 14 dígitos.' };
}
