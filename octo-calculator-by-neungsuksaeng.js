class NeungsuksaengCalculateTokenizer {
  constructor() {
    this.numberRegex = /^-?\d+(?:\.\d*)?$/g;
    this.letterRegex = /^[A-Za-z_][A-Za-z\d_]*$/g;
  }
  tokenize(expressionString) {
    let index = 0;
    let tempToken = '';
    const result = [];
    while (index < expressionString.length) {
      const char = expressionString[index];
      if (char === ' ') continue;
      if (/\d/.test(char)) {
        if (!(this.numberRegex.test(tempToken) || this.letterRegex.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else if (char === '.' || char === '-' && '+-*/^('.indexOf(result.at(-1)) >= 0) {
        if (!(/^\d$/.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else if (/\w/.test(char)) {
        if (!(this.letterRegex.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else {
        result.push(char);
      }
    }
    if (tempToken !== '') {
      result.push(tempToken);
    }
    return result;
  }
}
class NeungsuksaengLexer {
  constructor(tokens) {
    this.tokens = tokens.map(token => {type: getType(token), token});
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
    if (this.currentToken.type === expected) {
      const token = this.lexer.readNext();
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
        let result = { type: 'function call', functionName: tokenRead.name, input: subexpression };
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
        this.parseFunctionCall(result);
      }
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
    while (this.currentToken == '^') {
      const operator = this.currentToken;
      this.readNext('operator');
      const nextFactor = this.parseFactor();
      result = { operator, left: result, right: nextFactor };
    }
    return result;
  }
  parseTerm() {
    let result = this.parseExponent();
    while (this.currentToken == '^') {
      const operator = this.currentToken;
      this.readNext('operator');
      const nextExponent = this.parseExponent();
      result = { operator, left: result, right: nextExponent };
    }
    return result;
  }
  parseExpression() {
    let result = this.parseTerm();
    while (this.currentToken == '+' || this.currentToken == '-') {
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
  }
  calculate(expr) {
    const tokens = parse(expr);
    // More code snippets should be added here for calculating expressions.
  }
}
const neungsuk = new NeungsuksaengClass();
