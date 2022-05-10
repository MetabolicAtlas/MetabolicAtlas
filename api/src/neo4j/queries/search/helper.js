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

const CHILD_LABELS = ['ExternalDb', 'PubmedReference'];

const getScore = (node, uniqueIds) => {
  const id = node.mid || node.id;
  return id in uniqueIds ? uniqueIds[id]['score'] : 0;
};


export { MODELS, COMPONENT_TYPES, CHILD_LABELS, getScore };
