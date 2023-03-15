global.beforeAll(() => {
  global.API_BASE = 'http://127.0.0.1:80/api/v2';
  let model = readModelInfo();
  global.FRUITFLY_GEM_VERSION = model['Fruitfly-GEM'];
  global.HUMAN_GEM_VERSION = model['Human-GEM'];
  global.MOUSE_GEM_VERSION = model['Mouse-GEM'];
  global.RAT_GEM_VERSION = model['Rat-GEM'];
  global.WORM_GEM_VERSION = model['Worm-GEM'];
  global.YEAST_GEM_VERSION = model['Yeast-GEM'];
  global.ZEBRAFISH_GEM_VERSION = model['Zebrafish-GEM'];
  global.COMPONENTS = [
    'metabolite',
    'gene',
    'reaction',
    'subsystem',
    'compartment',
  ];
});

function readModelInfo() {
  const json = require('../src/data/integratedModels.json');
  const result = {};
  for (const obj of json) {
    result[obj.short_name] = obj.version.replace(/\./g, '_');
  }
  return result;
}
