/**
 * Parsea un string a número entero positivo.
 * Retorna el número o null si no es válido.
 */
export function parseId(value: string): number | null {
  const num = Number(value);
  if (Number.isNaN(num) || !Number.isInteger(num) || num <= 0) {
    return null;
  }
  return num;
}
