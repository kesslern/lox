import Token from './Token'

export abstract class Expr {
  public abstract accept<R>(visitor: Visitor<R>): R
}

export class Binary extends Expr {
  constructor(
    readonly left: Expr,
    readonly operator: Token,
    readonly right: Expr) {
    super()
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitBinaryExpr(this)
  }
}

export class Grouping extends Expr {
  constructor(
    readonly expression: Expr) {
    super()
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitGroupingExpr(this)
  }
}

export class Literal extends Expr {
  constructor(
    readonly value: any) {
    super()
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitLiteralExpr(this)
  }
}

export class Unary extends Expr {
  constructor(
    readonly operator: Token,
    readonly right: Expr) {
    super()
  }

  public accept<R>(visitor: Visitor<R>): R {
    return visitor.visitUnaryExpr(this)
  }
}

export interface Visitor<R> {
  visitBinaryExpr(expr: Binary): R
  visitGroupingExpr(expr: Grouping): R
  visitLiteralExpr(expr: Literal): R
  visitUnaryExpr(expr: Unary): R
}

export class AstPrinter implements Visitor<string> {
  public print(expr: Expr): string {
    return expr.accept(this)
  }

  public visitBinaryExpr(expr: Binary): string {
    return this.parenthesize(expr.operator.lexeme, expr.left, expr.right)
  }

  public visitGroupingExpr(expr: Grouping): string {
    return this.parenthesize('group', expr.expression)
  }

  public visitLiteralExpr(expr: Literal): string {
    if (expr.value == null) return 'nil'
    else return expr.value.toString()
  }

  public visitUnaryExpr(expr: Unary): string {
    return this.parenthesize(expr.operator.lexeme, expr.right)
  }

  private parenthesize(name: string, ...exprs: Expr[]): string {
    return `(${name} ${exprs.map((expr) => expr.accept(this)).join(' ')})`
  }
}
