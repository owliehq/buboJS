export interface Handler {
  (req: any, res: any, next: Function): void
}
