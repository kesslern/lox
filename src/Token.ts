import TokenType from './TokenType'

export default class Token {
  constructor(
    readonly type: TokenType,
    readonly lexeme: string,
    readonly literal: string | number,
    readonly line: number,
  ) {}

  public toString = (): string => `${this.type} ${this.lexeme} ${this.literal}`
}
