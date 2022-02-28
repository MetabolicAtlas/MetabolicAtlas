const INTEGRATED_MODELS = require('data/integratedModels');

const MODELS = INTEGRATED_MODELS.map(m => ({
  label: m.short_name.replace('-GEM', 'Gem'),
  name: m.short_name,
}));

const COMPONENT_TYPES = [
  'CompartmentalizedMetabolite',
  'Metabolite',
  'Gene',
  'Reaction',
  'Subsystem',
  'Compartment',
];

export { MODELS, COMPONENT_TYPES };
