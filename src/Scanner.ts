import Lox from './Lox'
import Token from './Token'
import TokenType from './TokenType'

export default class Scanner {
  public source: string
  public tokens: Token[] = []
  public start = 0
  public current = 0
  public line = 1

  constructor(source: string) {
    this.source = source
    console.log('starting scan')

    while (!this.isAtEnd()) {
      console.log(`scanning for another token, start: ${this.start}, current: ${this.current}`)
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
  }

  private isAtEnd = (): boolean => this.current >= this.source.length

  private scanToken(): void {
    const c = this.advance()
    switch (c) {
      case '(': return this.addToken(TokenType.LEFT_PAREN)
      case ')': return this.addToken(TokenType.RIGHT_PAREN)
      case '{': return this.addToken(TokenType.LEFT_BRACE)
      case '}': return this.addToken(TokenType.RIGHT_BRACE)
      case ',': return this.addToken(TokenType.COMMA)
      case '.': return this.addToken(TokenType.DOT)
      case '-': return this.addToken(TokenType.MINUS)
      case '+': return this.addToken(TokenType.PLUS)
      case ';': return this.addToken(TokenType.SEMICOLON)
      case '*': return this.addToken(TokenType.STAR)
      case '!': return this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
      case '=': return this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
      case '<': return this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
      case '>': return this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
      case '/':
        if (this.match('/')) {
          while (this.peek() !== '\n' && !this.isAtEnd()) this.advance()
        } else {
          this.addToken(TokenType.SLASH)
        }
        break
      default: return Lox.error(this.line, `Unexpected character: ${c}`)
    }
  }

  private advance = (): string => this.source.charAt(this.current++)

  private peek = (): string => this.isAtEnd() ? '' : this.source.charAt(this.current)

  private addToken(type: TokenType, literal: object = null) {
    console.log('Adding token type ' + type)
    const {current, line, source, start, tokens} = this

    const text: string = source.substring(start, current)
    tokens.push(new Token(type, text, literal, line))
  }

  private match(expected: string): boolean {
    if (this.isAtEnd()) return false
    if (this.source.charAt(this.current) !== expected) return false

    this.current++
    return true
  }
}
