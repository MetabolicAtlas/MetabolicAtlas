import fetch from 'node-fetch';

describe('gotEnzymes', () => {
  describe('get reactions', () => {
    it('should return reaction info for given id', async () => {
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
      const body = await res.json();
      expect(body).toEqual(R08948);
    });

    it('should return status 404 if no reaction exists for id', async () => {
      const res = await fetch(`${API_BASE}/gotenzymes/reactions/absent`);

      expect(res.status).toBe(404);
    });
  });

  describe('get genes', () => {
    it('should return gene info for given id', async () => {
      const AFR_01160 = {
        info: {
          kegg: 'AFR_01160',
        },
        crossReferences: {
          'NCBI Protein': [
            {
              id: 'AGZ38521',
              url: 'https://identifiers.org/ncbiprotein:AGZ38521',
            },
          ],
          UniProtKB: [
            {
              id: 'U5VS76',
              url: 'https://identifiers.org/uniprot:U5VS76',
            },
          ],
        },
      };

      const res = await fetch(`${API_BASE}/gotenzymes/genes/AFR_01160`);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual(AFR_01160);
    });

    it('should return status 404 if no gene exists for id', async () => {
      const res = await fetch(`${API_BASE}/gotenzymes/genes/absent`);

      expect(res.status).toBe(404);
    });
  });

  describe('get EC numbers', () => {
    it('should return EC number info for given EC number', async () => {
      const EC_4_4_1_37 = {
        info: {
          ec: '4.4.1.37',
          name:
            'pyridinium-3,5-bisthiocarboxylic acid mononucleotide synthase;LarE;P2CMN sulfurtransferase;' +
            'pyridinium-3,5-biscarboxylic acid mononucleotide sulfurtransferase;P2TMN synthase',
        },
        crossReferences: [],
      };

      const res = await fetch(`${API_BASE}/gotenzymes/ecs/4.4.1.37`);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual(EC_4_4_1_37);
    });

    it('should return status 404 if EC number does not exists', async () => {
      const res = await fetch(`${API_BASE}/gotenzymes/ecs/absent`);

      expect(res.status).toBe(404);
    });
  });

  describe('get compounds', () => {
    it('should return compound info for given id', async () => {
      const C00003 = {
        info: {
          name: 'NAD+',
          formula: 'C21H28N7O14P2',
          smiles:
            'NC(=O)c1ccc[n+]([C@@H]2O[C@H](COP(=O)(O)OP(=O)(O)OC[C@H]3O[C@@H](n4cnc5c(N)ncnc54)[C@H](O)[C@@H]3O)[C@@H](O)[C@H]2O)c1',
        },
        crossReferences: {
          KEGG: [
            {
              id: 'C00003',
              url: 'https://identifiers.org/kegg.compound:C00003',
            },
          ],
          MetaNetX: [
            {
              id: 'MNXM8',
              url: 'https://identifiers.org/metanetx.chemical:MNXM8',
            },
          ],
          ModelSEED: [
            {
              id: 'cpd00003',
              url: 'https://identifiers.org/seed.compound:cpd00003',
            },
          ],
          BiGG: [
            {
              id: 'nad',
              url: 'https://identifiers.org/bigg.metabolite:nad',
            },
          ],
          ChEBI: [
            {
              id: '15846',
              url: 'https://identifiers.org/CHEBI:15846',
            },
            {
              id: '44215',
              url: 'https://identifiers.org/CHEBI:44215',
            },
            {
              id: '57540',
              url: 'https://identifiers.org/CHEBI:57540',
            },
          ],
          MetaCyc: [
            {
              id: 'NAD',
              url: 'https://identifiers.org/metacyc.compound:NAD',
            },
          ],
          'SABIO-RK': [
            {
              id: '37',
              url: 'https://identifiers.org/sabiork.compound:37',
            },
          ],
          Reactome: [
            {
              id: 'R-ALL-113526',
              url: 'https://identifiers.org/reactome:R-ALL-113526',
            },
            {
              id: 'R-ALL-192307',
              url: 'https://identifiers.org/reactome:R-ALL-192307',
            },
            {
              id: 'R-ALL-194653',
              url: 'https://identifiers.org/reactome:R-ALL-194653',
            },
            {
              id: 'R-ALL-29360',
              url: 'https://identifiers.org/reactome:R-ALL-29360',
            },
            {
              id: 'R-ALL-352330',
              url: 'https://identifiers.org/reactome:R-ALL-352330',
            },
            {
              id: 'R-ALL-427523',
              url: 'https://identifiers.org/reactome:R-ALL-427523',
            },
          ],
        },
      };
      const res = await fetch(`${API_BASE}/gotenzymes/compounds/C00003`);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual(C00003);
    });

    it('should return status 404 if no compound exists for id', async () => {
      const res = await fetch(`${API_BASE}/gotenzymes/compounds/absent`);

      expect(res.status).toBe(404);
    });
  });

  describe('get organisms', () => {
    it('should return organism info for given id', async () => {
      const vcp = {
        info: {
          kegg: 'vcp',
          entry: 'T06797',
          name: 'Vagococcus carniphilus',
          taxa: '218144',
        },
        crossReferences: [],
      };
      const res = await fetch(`${API_BASE}/gotenzymes/organisms/vcp`);

      expect(res.status).toBe(200);
      const body = await res.json();
      expect(body).toEqual(vcp);
    });

    it('should return status 404 if no organsism exists for id', async () => {
      const res = await fetch(`${API_BASE}/gotenzymes/organisms/absent`);

      expect(res.status).toBe(404);
    });
  });
});
