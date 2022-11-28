const addScript = (type, src) => {
  const script = document.createElement('script');
  script.type = type;
  script.src = src;
  document.body.appendChild(script);
};

export default () => {
  addScript('text/javascript', '//cdn.plu.mx/widget-popup.js');
  addScript('text/javascript', 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js');
  addScript('application/javascript', 'https://cdn.scite.ai/badge/scite-badge-latest.min.js');
  addScript('application/javascript', 'https://badge.dimensions.ai/badge.js');
};
