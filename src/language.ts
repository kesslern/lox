import * as fs from 'fs'
import * as readlineSync from 'readline-sync'

import { AstPrinter } from './Expr'
import Lox from './Lox'
import Parser from './Parser'
import Scanner from './Scanner'
import Token from './Token'

const { argv } = process

if (argv.length > 3) {
  console.log(`Usage: ${argv[0]} ${argv[1]} [script]`)
} else if (argv.length === 3) {
  runFile(argv[2])
} else {
  runPrompt()
}

function runFile(filename: string): void {
  fs.readFile(filename, 'utf8', (_, data) => run(data))
  if (Lox.hadError) process.exit(1)
}

function runPrompt(): void {
  while (true) {
    const input = readlineSync.question('> ')

    if (input === '') break

    run(input)
    Lox.hadError = false
  }
}

function run(input: string): void {
  const tokens: Token[] = new Scanner(input).tokens
  const expression = new Parser(tokens).parse()

  if (Lox.hadError) return

  console.log(new AstPrinter().print(expression))
}
