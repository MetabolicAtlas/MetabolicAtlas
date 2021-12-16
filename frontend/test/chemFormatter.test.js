import chemicalFormula from '../src/helpers/chemical-formatters';

test('test chemicalreactions', () => {
  expect(chemicalFormula('C24H32O8', 0)).toBe('C<sub>2</sub><sub>4</sub>H<sub>3</sub><sub>2</sub>O<sub>8</sub>');
});
test('test chemicalreactions', () => {
  expect(chemicalFormula('H2PO4-', 0)).toBe('H<sub>2</sub>PO<sub>4</sub><sup>-</sup>');
});

