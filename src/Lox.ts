export default class Lox {
  public static hadError = false

  public static error(line: number, message: string): void {
    Lox.report(line, '', message)
  }

  public static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error ${where}: ${message}`)
  }
}
