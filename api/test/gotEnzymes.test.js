import fetch from 'node-fetch';

describe('gotEnzymes', () => {
  describe('get reactions', () => {
    it('should return reaction for id', async () => {
      const R08948 = {
        info: {
          name: 'dimethylallyl-diphosphate:dimethylallyl-diphosphate dimethylallyltransferase (chrysanthemyl-diphosphate-forming)',
          equation:
            '2 Dimethylallyl diphosphate <=> Diphosphate + Chrysanthemyl diphosphate',
        },
        crossReferences: {
          KEGG: [
            {
              id: 'R08948',
              url: 'https://identifiers.org/kegg.reaction:R08948',
            },
          ],
          MetaNetX: [
            {
              id: 'MNXR112438',
              url: 'https://identifiers.org/metanetx.reaction:MNXR112438',
            },
          ],
          Rhea: [
            {
              id: '14009',
              url: 'https://identifiers.org/rhea:14009',
            },
            {
              id: '14010',
              url: 'https://identifiers.org/rhea:14010',
            },
            {
              id: '14011',
              url: 'https://identifiers.org/rhea:14011',
            },
            {
              id: '14012',
              url: 'https://identifiers.org/rhea:14012',
            },
          ],
          ModelSEED: [
            {
              id: 'rxn14286',
              url: 'https://identifiers.org/seed.reaction:rxn14286',
            },
          ],
          MetaCyc: [
            {
              id: '2.5.1.67-RXN',
              url: 'https://identifiers.org/metacyc.reaction:2.5.1.67-RXN',
            },
          ],
        },
      };
      const res = await fetch(`${API_BASE}/gotenzymes/reactions/R08948`);

      expect(res.status).toBe(200);
      let body = await res.json();
      expect(body).toEqual(R08948);
    });

    it('should return status 404 if no reaction exists for id', async () => {
      const res = await fetch(`${API_BASE}/gotenzymes/reactions/absent`);

      expect(res.status).toBe(404);
    });
  });
});
