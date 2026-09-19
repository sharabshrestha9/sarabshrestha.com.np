const display = document.querySelector("#display");
let expression = "";
let justCalculated = false;

function render() {
  display.value = expression || "0";
}

function calculate() {
  if (!expression) return;
  try {
    const tokens = expression.match(/(?:\d+(?:\.\d+)?|[()+\-*/%])/g) || [];
    if (tokens.join("") !== expression) throw new Error("Invalid expression");
    const values = [];
    const operators = [];
    const precedence = { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2 };
    const apply = () => {
      const operator = operators.pop();
      const right = values.pop();
      const left = values.pop();
      if (operator === undefined || left === undefined || right === undefined)
        throw new Error("Invalid expression");
      if (operator === "+") values.push(left + right);
      if (operator === "-") values.push(left - right);
      if (operator === "*") values.push(left * right);
      if (operator === "/") values.push(left / right);
      if (operator === "%") values.push(left % right);
    };
    tokens.forEach((token) => {
      if (!Number.isNaN(Number(token))) values.push(Number(token));
      else if (token === "(") operators.push(token);
      else if (token === ")") {
        while (operators.at(-1) !== "(") apply();
        operators.pop();
      } else {
        while (
          operators.length &&
          operators.at(-1) !== "(" &&
          precedence[operators.at(-1)] >= precedence[token]
        )
          apply();
        operators.push(token);
      }
    });
    while (operators.length) apply();
    if (values.length !== 1) throw new Error("Invalid expression");
    const result = values[0];
    if (!Number.isFinite(result)) throw new Error("Invalid result");
    expression = String(Math.round(result * 1e10) / 1e10);
    justCalculated = true;
  } catch {
    expression = "";
    display.value = "Error";
  }
}

document
  .querySelector(".calculator-keys")
  .addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button) return;
    const { value, action } = button.dataset;
    if (action === "clear") expression = "";
    else if (action === "equals") calculate();
    else if (value === "±" && expression)
      expression = expression.startsWith("0-(")
        ? expression.slice(3, -1)
        : `0-(${expression})`;
    else if (value === "%" && expression)
      expression = String(Number(expression) / 100);
    else {
      if (justCalculated && /[0-9.]/.test(value)) expression = "";
      expression += value;
      justCalculated = false;
    }
    render();
  });

document.addEventListener("keydown", (event) => {
  if (!document.activeElement.closest(".calculator")) return;
  if (/^[0-9.+\-*/%()]$/.test(event.key)) {
    expression += event.key;
    render();
  } else if (event.key === "Enter") calculate();
  else if (event.key === "Escape") expression = "";
  else if (event.key === "Backspace") expression = expression.slice(0, -1);
  render();
});
