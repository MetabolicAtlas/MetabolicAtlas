import chemicalFormula from '../src/helpers/chemical-formatters';

test('test chemicalreactions', () => {
  expect(chemicalFormula('C24H32O8', 0)).toBe('C<sub>2</sub><sub>4</sub>H<sub>3</sub><sub>2</sub>O<sub>8</sub>');
});

