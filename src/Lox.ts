export default class Lox {
  static hadError = false

  static error(line: number, message: string): void {
    Lox.report(line, "", message)
  }

  static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error ${where}: ${message}`)
  }
}
