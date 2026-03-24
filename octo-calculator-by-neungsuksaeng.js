class NeungsuksaengCalculateTokenizer {
  parse(expressionString) {
    let index = 0;
    let tempToken = '';
    const result = [];
    while (index < expressionString.length) {
      const char = expressionString[index];
      if (/\d/.test(char)) {
        if (!(/^(?:-?\d+(?:.\d*)?|\w(?:\w|\d)*)$/.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else if (char === '.' || char === '-' && '+-*/^('.indexOf(result.at(-1)) >= 0) {
        if (!(/^\d+$/.test(tempToken)) && tempToken !== '') {
          result.push(tempToken);
          tempToken = '';
        }
        tempToken += char;
      } else if (/\w/.test(char)) {
        if (!(/^\w(?:\w|\d)*$/.test(tempToken)) && tempToken !== '') {
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
    if (/^-?\d+(?:.\d*)?$/.test(token)) return 'number';
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
    throw new Error(`Unexpected token: %o`, ${this.currentToken});
  }
  parseFactor() {
    const tokenRead = this.currentToken;
    if (tokenRead.type === 'number') {
      this.readNext('number');
      return { type: 'number', value: Number(tokenRead.token) };
    } else if (tokenRead.type === 'open par') {
      this.readNext('open par');
      const subexpression = this.parseExpression();
      this.readNext('close par');
      return subexpression;
    }
  }
}
class NeungsuksaengClass {
  constructor() {
  }
  calculate(expr) {
    const tokens = parse(expr);
    
  }
}
const neungsuk = new NeungsuksaengClass();
