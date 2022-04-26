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
  if (node.id in uniqueIds) {
    return uniqueIds[node.id]['score'];
  }
  if (node.mid) {
    return uniqueIds[node.mid]['score'];
  }
  return 0;
};

export { MODELS, COMPONENT_TYPES, CHILD_LABELS, getScore };
