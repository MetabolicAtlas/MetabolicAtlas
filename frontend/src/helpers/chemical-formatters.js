export default function chemicalFormula(formula, charge) {
  if (formula === null || formula === undefined) {
    return '';
  }
  if (/-\w/g.test(formula)) {
    // avoid bad formatting of metabolite names
    return formula;
  }
  let form = formula.replace(/([0-9])/g, '<sub>$1</sub>');
  if (charge) {
    form = `${form}<sup>${Math.abs(charge) !== 1 ? Math.abs(charge) : ''}${charge > 0 ? '+' : '-'}</sup>`;
  }
  return form;
}
