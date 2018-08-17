import TokenType from './TokenType'

export default class Token {
  public type: TokenType
  public lexeme: string
  public literal: string | number
  public line: number

  constructor(type: TokenType, lexeme: string, literal: string | number, line: number) {
    this.type = type
    this.lexeme = lexeme
    this.literal = literal
    this.line = line
  }

  public toString = (): string => `${this.type} ${this.lexeme} ${this.literal}`
}
