export default class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    public readonly message: string,
    public readonly field?: string
  ) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}