/**
 *
 */
export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any,
    public errorCode?: number,
    public parentError?: Error
  ) {
    super(message)

    if (parentError) this.stack = parentError.stack
  }
}
