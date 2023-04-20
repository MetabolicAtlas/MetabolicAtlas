const parseParams = (model, version) => {
  if (model && model.includes('(')) {
    throw new Error('Malformed model');
  }

  const m = model ? `:${model}` : '';
  const v = version ? `:V${version}` : '';

  return [m, v];
};

export default parseParams;
