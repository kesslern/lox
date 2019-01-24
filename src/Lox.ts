import Token from './Token'
import TokenType from './TokenType'

export default class Lox {
  public static hadError = false

  public static error(obj: number|Token, message: string): void {
    Lox.hadError = true
    if (typeof obj === 'number') {
      const line = obj as number
      Lox.report(line, '', message)
    } else {
      const token = obj as Token
      if (token.type === TokenType.EOF) {
        Lox.report(token.line, ' at end', message)
      } else {
        Lox.report(token.line, ` at '${token.lexeme}'`, message)
      }
    }
  }

  public static report(line: number, where: string, message: string): void {
    console.error(`[line ${line}] Error${where}: ${message}`)
  }
}
