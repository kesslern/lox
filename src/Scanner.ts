import Lox from './Lox'
import Token from './Token'
import TokenType from './TokenType'

export default class Scanner {
  public tokens: Token[] = []
  private source: string
  private start = 0
  private current = 0
  private line = 1

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
public number() {
    while (this.isDigit(this.peek())) this.advance()

    // Look for a fractional part.
    if (this.peek() === '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance()

      while (this.isDigit(this.peek())) this.advance()
    }

    this.addToken(TokenType.NUMBER,
        Number(this.source.substring(this.start, this.current)))
  }

  private isDigit = (c: string) =>  c >= '0' && c <= '9'

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
      case ' ':
      case '\r':
      case '\t':
        // Ignore whitespace.
        break

      case '\n':
        this.line++
        break
      case '"':
        this.string()
        break
      default:
      if (this.isDigit(c)) {
        return this.number()
      } else {
        return Lox.error(this.line, `Unexpected character: ${c}`)
      }
    }
  }

  private peekNext(): string {
    const { current, source } = this
    if (current + 1 >= source.length) return '\0'
    return source.charAt(current + 1)
  }

  private advance = (): string => this.source.charAt(this.current++)

  private peek = (): string => this.isAtEnd() ? '' : this.source.charAt(this.current)

  private addToken(type: TokenType, literal: string|number = null) {
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

  private string() {
    while (this.peek() !== '"' && !this.isAtEnd()) {
      if (this.peek() === '\n') this.line++
      this.advance()
    }

    // Unterminated string.
    if (this.isAtEnd()) {
      Lox.error(this.line, 'Unterminated string.')
      return
    }

    // The closing ".
    this.advance()

    // Trim the surrounding quotes.
    const value: string = this.source.substring(this.start + 1, this.current - 1)
    this.addToken(TokenType.STRING, value)
  }
}
