class NeungsuksaengCalculateTokenizer {
  constructor() {
    this.numberRegex = /^-?\d+(?:\.\d*)?$/;
    this.letterRegex = /^[A-Za-z_][A-Za-z\d_]*$/;
  }
  tokenize(expressionString) {
    let index = 0;
    let tempToken = '';
    const result = [];
    while (index < expressionString.length) {
      const char = expressionString[index];
      if (char === ' ') continue;
      if (/^\d$/.test(char)) {
        if (!(this.numberRegex.test(tempToken) || this.letterRegex.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else if (char === '.' || char === '-' && '+-*/^('.indexOf(result.at(-1)) >= 0) {
        if (!(/^\d*$/.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else if (/^[A-Za-z_]$/.test(char)) {
        if (!(this.letterRegex.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else {
        if (tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        result.push(char);
      }
      index++;
    }
    if (tempToken !== '') {
      result.push(tempToken);
    }
    return result;
  }
}
class NeungsuksaengCalculateLexer {
  constructor(tokens) {
    this.tokens = tokens.map(token => ({ type: this.getType(token), token }));
    this.position = 0;
  }
  getType(token) {
    if (/^-?\d+(?:\.\d*)?$/.test(token)) return 'number';
    if (/^\w(?:\w|\d)*$/.test(token)) return 'identifier';
    if (token === '(') return 'open par';
    if (token === ')') return 'close par';
    return 'operator';
  }
  readNext() {
    return this.tokens[this.position++] || null;
  }
  read() {
    return this.tokens[this.position] || null;
  }
}
class NeungsuksaengCalculateParser {
  constructor(lexer) {
    this.lexer = lexer;
    this.currentToken = this.lexer.readNext();
  }
  readNext(expectedType) {
    if (this.currentToken.type === expectedType) {
      const token = this.currentToken;
      this.currentToken = this.lexer.readNext();
      return token;
    }
    throw new Error(`Unexpected token: %o`, this.currentToken);
  }
  parseFunctionCall(tokenInput) {
    let tokenRead = this.currentToken;
    if (tokenInput.type === 'identifier') {
      if (tokenRead.type === 'open par') {
        this.readNext('open par');
        const subexpression = this.parseExpression();
        this.readNext('close par');
        let result = { type: 'function call', functionName: tokenInput.name, input: subexpression };
        return result;
      }
      return null;
    }
    return null;
  }
  parseFactor() {
    let tokenRead = this.currentToken;
    if (tokenRead.type === 'number') {
      this.readNext('number');
      return { type: 'number', value: Number(tokenRead.token) };
    } else if (tokenRead.type === 'identifier') {
      this.readNext('identifier');
      let result = { type: 'identifier', name: tokenRead.token };
      tokenRead = this.currentToken;
      if (tokenRead.type === 'open par') {
        result = this.parseFunctionCall(result);
      }
      return result;
    } else if (tokenRead.type === 'open par') {
      this.readNext('open par');
      const subexpression = this.parseExpression();
      this.readNext('close par');
      return subexpression;
    }
    return null;
  }
  parseExponent() {
    let result = this.parseFactor();
    while (this.currentToken?.token === '^') {
      const operator = this.currentToken;
      this.readNext('operator');
      const nextFactor = this.parseFactor();
      result = { operator, left: result, right: nextFactor };
    }
    return result;
  }
  parseTerm() {
    let result = this.parseExponent();
    while (this.currentToken?.token === '*' || this.currentToken?.token === '/') {
      const operator = this.currentToken;
      this.readNext('operator');
      const nextExponent = this.parseExponent();
      result = { operator, left: result, right: nextExponent };
    }
    return result;
  }
  parseExpression() {
    let result = this.parseTerm();
    while (this.currentToken?.token === '+' || this.currentToken?.token === '-') {
      const operator = this.currentToken;
      this.readNext('operator');
      const nextTerm = this.parseTerm();
      result = { operator, left: result, right: nextTerm };
    }
    return result;
  }
}
class NeungsuksaengClass {
  constructor() {
    this.funcs = {
      sqrt: Math.sqrt, cbrt: Math.cbrt,
      sin: Math.sin, cos: Math.cos, tan: Math.tan, sec: x => 1/Math.cos(x), csc: x => 1/Math.sin(x), cot: x => 1/Math.tan(x),
      arcsin: Math.asin, arccos: Math.acos, arctan: Math.atan, arcsec: x=>Math.acos(1/x), arccsc: x=>Math.asin(1/x), arccot: x=>Math.atan(1/x),
      ln: Math.log, log: Math.log10, exp: Math.exp,
      floor: Math.floor, ceil: Math.ceil, round: Math.round
    };
  }
  operatorFunc(operation) {
    return new Function('left', 'right', `return left ${operation === "^" ? "**" : operation} right;`);
  }
  calculateObject(obj, variables = {}) {
    if (obj.type === 'number') {
      return obj.value;
    } else if (obj.type === 'identifier') {
      if (obj.name === 'pi') {
        return Math.PI;
      } else if (obj.name === 'e') {
        return Math.E;
      }
      const result = variables[obj.name];
      if (result !== null && result !== undefined) {
        return result;
      }
      throw new Error(`There is no such variable called \'${obj.name}\'`);
    } else if (obj.type === 'operation') {
      return this.operatorFunc(obj.operator)(calculateObject(obj.left, variables), calculateObject(obj.right, variables));
    } else if (obj.type === 'function call') {
      return this.funcs[obj.functionName](calculateObject(obj.input, variables));
    }
    return null;
  }
  tokenize(expr) {
    const tokenizer = new NeungsuksaengCalculateTokenizer();
    const tokenized = tokenizer.tokenize(expr);
    const lexer = new NeungsuksaengCalculateLexer(tokenized);
    const parser = new NeungsuksaengCalculateParser(lexer);
    const parsed = parser.parseExpression();
    return parsed;
  }
  parse(tokens) {}
  calculate(expr, variables = {}) {
    const result = this.calculateObject(parsed, variables);
    return result;
  }
}
const neungsuk = new NeungsuksaengClass();
