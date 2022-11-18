const chemicalFormula = (formula, charge) => {
  if (formula === null || formula === undefined) {
    return '';
  }
  if (
    /-\w/g.test(formula) ||
    /,\w/g.test(formula) ||
    /\btrans|cis|am|apoa|g\d+/g.test(formula.toLowerCase()) ||
    /\b[^o]\d+\b/g.test(formula.toLowerCase()) ||
    formula.toLowerCase() === formula
  ) {
    // avoid bad formatting of metabolite names
    return formula;
  }
  let form = formula.replace(/([0-9])/g, '<sub>$1</sub>');
  if (charge) {
    form = `${form}<sup>${Math.abs(charge) !== 1 ? Math.abs(charge) : ''}${
      charge > 0 ? '+' : '-'
    }</sup>`;
  } else {
    // if no explicit charge is provided, check if the form includes one
    // useful for showing eg NADP+ rather than the formal charge NADP3-
    form = form.replace(/([-+])$/, '<sup>$1</sup>');
  }
  return form;
};

const chemicalEquation = formula => {
  let equation = formula
    .split(' ')
    .map(x => chemicalFormula(x, null))
    .join(' ');
  equation = equation.replace('<=>', '⇔').replace('=>', '⇒').replace('<=', '⇐');
  return equation;
};

export { chemicalFormula, chemicalEquation };
