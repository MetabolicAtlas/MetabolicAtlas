import axios from 'axios';

const fetchInteractionPartners = async ({ id, model, version }) => {
  const params = { model, version };
  const { data } = await axios.get(`/interaction-partners/${id}`, { params });
  console.log(id, model, version, 'IP data', data);
  let links = []
  let nodes = []
  let unique = new Set()
  nodes.push({g: data.component.type === 'metabolite' ? 'm' : 'e', id: data.component.id, n: data.component.name})
  unique.add(data.component.id)
  data.reactions.forEach((reaction) => {
    reaction.genes.forEach((gene) => {
      if (!unique.has(gene.id)) {
        nodes.push({g: 'e', id: gene.id, n: gene.name})
        unique.add(gene.id)
      }
      reaction.metabolites.forEach((metabolite) => {
        if (!unique.has(metabolite.id)) {
          nodes.push({g: 'm', id: metabolite.id, n: metabolite.name})
          unique.add(metabolite.id)
          const rep = `${gene.id}-${metabolite.id}`;
          if (!unique.has(rep)) {
            links.push({s: gene.id, t: metabolite.id})
            unique.add(rep)
          }
        }
      })
    })
  })
  console.log(nodes, links)
  return data;
};

export default { fetchInteractionPartners };
