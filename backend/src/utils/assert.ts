
export function assertIsString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`❌ Env ${name} nie jest ustawione`);
  }
}

