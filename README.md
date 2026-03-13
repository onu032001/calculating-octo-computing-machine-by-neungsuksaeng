# calculating-octo-computing-machine-by-neungsuksaeng

Expression calculator like a search engine.

## Computation steps

Use this script tag to the `head` add the `calculating-octo-computing-machine-by-neungsuksaeng` module:
```html
<script src="https://onu032001.github.io/calculating-octo-computing-machine-by-neungsuksaeng/octo-calculator-by-neungsuksaeng.js"></script>
```
Then, use this JavaScript function to compute it (Example):
```js
const new_octoCBN = new OctoCalculatorByNeungsuksaeng();
let result = OctoCalculatorByNeungsuksaeng.computeWithNeungsuksaeng('2*(2+3)+7/2-3');
```
or
```js
const new_octoCBN = new octoCBN();
let result = new_octoCBN.compWN('2*(2+3)+7/2-3');
```

| Operator - *Description* | Operator - *Symbol* | Operator - *Usage* | Result - *Representation* | Result - *JavaScript result* |
|:-:|:-:|:-:|:-:|:-:|
| Exponentation | `^` | `(2^3)` | $2^3$ | 8 |
| Multiplication | `*` | `3*5` | $3\times 5$ | 15 |
| Division or fraction - *Division* | `/` | `3/5` | $3\div 5$ | 0.8 |
| Division or fraction - *Fraction* | Same as division but parenthesized | `(1/2)` | $\displaystyle \frac{1}{2}$ | 0.5 |
| Grouping expressions or changing the precedence | Unite with parenthesis `( )` | `(2+3)` | $(2+3)$ | 5 |
