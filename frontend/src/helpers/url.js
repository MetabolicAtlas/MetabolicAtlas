const COORD_REGEXP = /(?:-)?\d+(?:[.]\d+)?(?:[,](?:-)?\d+(?:[.]\d+)?){5}/;

const routeQueryEntries = [
  { name: 'dim', regexp: '[23]d', default: '2d' },
  { name: 'panel', regexp: '[01]', default: '0' },
  { name: 'coord', regexp: COORD_REGEXP, default: '0,0,0,0,0,0' },
  { name: 'sel', regexp: null, default: '' },
  { name: 'search', regexp: null, default: '' },
];

const roundValue = (value) => Math.round((value + 0.00001) * 1000) / 1000;

const setRouteForMap = ({ route, mapType, mapId, dim }) => ({
  name: 'viewer',
  params: { ...route.params, type: mapType, map_id: mapId, reload: false },
  query: { ...route.query, dim },
});

const setRouteForDim = ({ route, dim }) => ({
  query: { ...route.query, dim },
  params: { ...route.params, reload: false },
});

const setRouteForSel = ({ route, id }) => ({
  query: { ...route.query, sel: id },
  params: { ...route.params, reload: false },
});

const setRouteForSearch = ({ route, searchTerm }) => ({
  query: { ...route.query, search: searchTerm },
  params: { ...route.params, reload: false },
});

const setRouteForCoord = ({ route, x, y, z, u, v, w }) => {
  const coord = [x, y, z, u, v, w].map((val) => roundValue(val)).join(',');
  return {
    query: { ...route.query, coord },
    params: { ...route.params, reload: false },
  };
};

const setRouteForOverlay = ({ route, isOpen }) => ({
  query: { ...route.query, panel: isOpen ? '1' : '0' },
  params: { ...route.params, reload: false },
});

const setDefaultQuery = ({ route, defaultValues }) => {
  const query = {};
  routeQueryEntries.forEach((el) => {
    if (!(el.name in route.query) || !(!el.regexp || route.query[el.name].match(el.regexp))) {
      query[el.name] = el.default;
    } else {
      query[el.name] = route.query[el.name];
    }
  });
  Object.assign(query, defaultValues);
  return { query, params: { ...route.params, reload: false } };
};

const areRoutesIdentical = ({ route, oldRoute }) => {
  if (
    route.name !== oldRoute.name ||
    Object.keys(route).length !== Object.keys(oldRoute).length ||
    Object.keys(route.params).length !== Object.keys(oldRoute.params).length ||
    Object.keys(route.query).length !== Object.keys(oldRoute.query).length
  ) {
    return false;
  }

  const routePKeys = Object.keys(oldRoute.params);
  for (let i = 0; i < routePKeys.length; i += 1) {
    const k = routePKeys[i];
    if (route.params[k] === undefined || route.params[k] !== oldRoute.params[k]) {
      return false;
    }
  }

  const routeQKeys = Object.keys(oldRoute.query);
  for (let i = 0; i < routeQKeys.length; i += 1) {
    const k = routeQKeys[i];
    if (route.query[k] === undefined || route.query[k] !== oldRoute.query[k]) {
      return false;
    }
  }
  return true;
};

const parseRoute = (route) => ({
  searchTerm: route.query.search,
  selectIDs: [route.query.sel].filter((x) => x),
  coords: route.query.coord !== '0,0,0,0,0,0' ? route.query.coord : null,
});

export {
  setRouteForMap,
  setRouteForDim,
  setRouteForSel,
  setRouteForSearch,
  setRouteForCoord,
  setRouteForOverlay,
  setDefaultQuery,
  areRoutesIdentical,
  parseRoute,
};
