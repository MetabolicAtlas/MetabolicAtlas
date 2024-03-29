import axios from 'axios';
import { reformatChemicalReactionHTML } from '@/helpers/utils';

const search = async ({ searchTerm, model, version, limit }) => {
  const params = { searchTerm, model, version, limit };
  const { data } = await axios.get('/search', { params });

  // the metabolites are returned ONLY if limit is provided
  if (!limit) {
    return data;
  }

  return Object.entries(data).reduce((obj, [k, v]) => {
    // eslint-disable-next-line no-param-reassign
    obj[k] = {
      ...v,
      reaction: v.reaction
        .map(r => ({
          ...r,
          compartment_str: r.compartment.map(c => c.name).join(', '),
          reactants: r.metabolites.filter(m => m.outgoing),
          products: r.metabolites.filter(m => !m.outgoing),
        }))
        .map(r => ({
          ...r,
          equation: reformatChemicalReactionHTML({
            reaction: r,
            noLink: true,
            model: model.short_name,
          }),
        })),
    };

    return obj;
  }, {});
};

export default { search };
