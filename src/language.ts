import * as readlineSync from 'readline-sync'
import * as fs from 'fs'

const { argv } = process
let hadError = false

enum TokenType {
  // Single-character tokens.
  LEFT_PAREN, RIGHT_PAREN, LEFT_BRACE, RIGHT_BRACE,
  COMMA, DOT, MINUS, PLUS, SEMICOLON, SLASH, STAR,

  // One or two character tokens.
  BANG, BANG_EQUAL,
  EQUAL, EQUAL_EQUAL,
  GREATER, GREATER_EQUAL,
  LESS, LESS_EQUAL,

  // Literals.
  IDENTIFIER, STRING, NUMBER,

  // Keywords.
  AND, CLASS, ELSE, FALSE, FUN, FOR, IF, NIL, OR,
  PRINT, RETURN, SUPER, THIS, TRUE, VAR, WHILE,

  EOF
}

class Token {
  type: TokenType
  lexeme: string
  literal: object
  line: number

  constructor(type: TokenType, lexeme: string, literal: object, line: number) {
    this.type = type
    this.lexeme = lexeme
    this.literal = literal
    this.line = line
  }

  toString = (): string => `${this.type} ${this.lexeme} ${this.literal}`
}

class Scanner {
  source: string
  tokens: Token[] = []
  start = 0
  current = 0
  line = 1

  constructor(source: string) {
    this.source = source
    console.log('starting scan')

    while (!this.isAtEnd()) {
      console.log(`scanning for another token, start: ${this.start}, current: ${this.current}`)
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line))
  }

  private isAtEnd = (): boolean => this.current >= this.source.length

  private scanToken(): void {
    const c = this.advance()
    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN); break
      case ')': this.addToken(TokenType.RIGHT_PAREN); break
      case '{': this.addToken(TokenType.LEFT_BRACE); break
      case '}': this.addToken(TokenType.RIGHT_BRACE); break
      case ',': this.addToken(TokenType.COMMA); break
      case '.': this.addToken(TokenType.DOT); break
      case '-': this.addToken(TokenType.MINUS); break
      case '+': this.addToken(TokenType.PLUS); break
      case ';': this.addToken(TokenType.SEMICOLON); break
      case '*': this.addToken(TokenType.STAR); break
    }
  }

  private advance = () => this.source.charAt(this.current++)

  private addToken(type: TokenType, literal: object = null) {
    console.log("Adding token type " + type)
    const {current, line, source, start, tokens} = this

    const text: string = source.substring(start, current)
    tokens.push(new Token(type, text, literal, line))
  }
}

function error(line: number, message: string): void {
  report(line, "", message)
}

function report(line: number, where: string, message: string): void {
  console.error(`[line ${line}] Error ${where}: ${message}`)
}

if (argv.length > 3) {
  console.log(`Usage: ${argv[0]} ${argv[1]} [script]`)
} else if (argv.length === 3) {
  runFile(argv[2])
} else {
  runPrompt()
}

function runFile(filename: string): void {
  fs.readFile(filename, 'utf8', (_, data) => run(data))
  if (hadError) process.exit(1)
}

function runPrompt(): void {
  while (true) {
    const input = readlineSync.question('> ')

    if (input === '') {
      break
    }
    run(input)
    hadError = false
  }
}

function run(input: string): void {
  const tokens: Token[] = new Scanner(input).tokens
  tokens.forEach(token => console.log(token.toString()))
}
