global.beforeAll(() => {
  global.API_BASE = 'http://localhost:8081/api/v2';
  global.FRUITFLY_GEM_VERSION = '1_1_0';
  global.HUMAN_GEM_VERSION = '1_10_0';
  global.MOUSE_GEM_VERSION = '1_2_0';
  global.RAT_GEM_VERSION = '1_2_0';
  global.WORM_GEM_VERSION = '1_1_0';
  global.YEAST_GEM_VERSION = '8_4_2';
  global.ZEBRAFISH_GEM_VERSION = '1_1_0';
  global.COMPARTMENTS = [
    'metabolite',
    'gene',
    'reaction',
    'subsystem',
    'compartment',
  ];
});
