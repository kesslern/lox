import Lox from './Lox'
import ReservedWords from './ReservedWords'
import Token from './Token'
import TokenType from './TokenType'

export default class Scanner {
  /** Publicly available list of tokens, generated on construction of the class. */
  public tokens: Token[] = []

  /** Source program stream to parse into tokens. */
  private source: string

  /** Start location of the current token in `this.source`. */
  private start = 0

  /** Location in `this.stream` currently being examined. */
  private current = 0

  /** Current line in `this.source`. Advanced each time `\n` is encountered. */
  private line = 1

  /**
   * Parse `source` into `this.tokens`.
   * @param source - The input program.
   */
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

  /** Check if a character is a digit. */
  private isDigit = (c: string) =>  c >= '0' && c <= '9'

  /** Check if a character. is an alpha (a-z or A-Z) character, or an underscore. */
  private isAlpha = (c: string) => (
    (c >= 'a' && c <= 'z') ||
    (c >= 'A' && c <= 'Z') ||
    c === '_'
  )

  /** Check if a character is alpha, numeric, or an underscore. */
  private isAlphaNumeric = (c: string) => (this.isAlpha(c) || this.isDigit(c))

  /** Check if the current position is at the end of the stream. */
  private isAtEnd = (): boolean => this.current >= this.source.length

  /** Scan the next token and add it to `this.tokens` */
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
        } else if (this.isAlpha(c)) {
            return this.identifier()
        } else {
          return Lox.error(this.line, `Unexpected character: ${c}`)
        }
    }
  }

  /**
   * Return the character after the next character in the stream, i.e. the character after the one returned
   * by `this.peak`.
   */
  private peekNext(): string {
    const { current, source } = this
    if (current + 1 >= source.length) return '\0'
    return source.charAt(current + 1)
  }

  /** Returns the current character in the stream, then a the stream by once character. */
  private advance = (): string => this.source.charAt(this.current++)

  /** Gets the next character in the stream, without advancing the current position. */
  private peek = (): string => this.isAtEnd() ? '' : this.source.charAt(this.current)

  /**
   * Adds a token to `this.tokens` based on the current scanner state.
   * @param type - The identified TokenType.
   * @param literal - The string that consisted of the token.
   */
  private addToken(type: TokenType, literal: string|number = null) {
    const {current, line, source, start, tokens} = this

    const text: string = source.substring(start, current)
    console.log(`Adding token type ${type} text ${text}`)
    tokens.push(new Token(type, text, literal, line))
  }

  /**
   * Checks if the next character in the stream is a specific character. If it is, advance the stream
   * by one character.
   * @param expected - A character to match next in the stream.
   * @returns true if the next character is expected, false otherwise.
   */
  private match(expected: string): boolean {
    if (this.isAtEnd()) return false
    if (this.source.charAt(this.current) !== expected) return false

    this.current++
    return true
  }

  /** Parse a string from the current position in the program stream. */
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

  /** Parse a number from the current position and add it to `this.tokens`. */
  private number() {
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

  /** Parse an identifier from the current position and add it to `this.tokens`. */
  private identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance()

    const { source, start, current } = this
    const text: string = source.substring(start, current)
    this.addToken(ReservedWords[text] || TokenType.IDENTIFIER)
  }
}
