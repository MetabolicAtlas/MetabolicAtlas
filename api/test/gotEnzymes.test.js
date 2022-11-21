import fetch from 'node-fetch';

describe('gotEnzymes', () => {
  describe('search', () => {
    it.each(['aspmetasp', 'dioxat', 'glnasngln', 'vacuole', 'zurr'])(
      'should return same results matches for %p no matter case',
      async searchTerm => {
        const [res_lower, res_upper] = await Promise.all([
          fetch(`${API_BASE}/gotenzymes/search/${searchTerm}`),
          fetch(`${API_BASE}/gotenzymes/search/${searchTerm.toUpperCase()}`)
        ]);

        expect(res_lower.status).toBe(200);
        expect(res_upper.status).toBe(200);

        const [body_lower, body_upper] = await Promise.all([
          res_lower.json(),
          res_upper.json()
        ]);

        expect(body_upper).toEqual(body_lower);
      }
    );
  });

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

  describe('search enzymes', () => {
    describe('pagination', () => {
      it('should use 50 as default page size', async () => {
        const res = await fetch(`${API_BASE}/gotenzymes/enzymes`);

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.enzymes.length).toBe(50);
      });

      it('should use requested page size', async () => {
        const res = await fetch(
          encodeURI(`${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=99`)
        );

        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.enzymes.length).toBe(99);
      });

      it('should use 1 as default page', async () => {
        const defaultPage = await fetch(`${API_BASE}/gotenzymes/enzymes`);
        const firstPage = await fetch(
          `${API_BASE}/gotenzymes/enzymes?pagination[page]=1`
        );

        const defaultPageBody = await defaultPage.json();
        const firstPageBody = await firstPage.json();
        expect(defaultPageBody).toEqual(firstPageBody);
      });

      it('should be consistent', async () => {
        const first80 = await fetch(
          encodeURI(`${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=80`)
        );
        const first40 = await fetch(
          encodeURI(`${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=40`)
        );
        const second40 = await fetch(
          encodeURI(
            `${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=40&pagination[page]=2`
          )
        );
        const first80Body = await first80.json();
        const first40Body = await first40.json();
        const second40Body = await second40.json();

        expect(first80Body.enzymes).toEqual([
          ...first40Body.enzymes,
          ...second40Body.enzymes,
        ]);
      });
    });

    describe('sorting', () => {
      it('should be based on gene if no sort column is given', async () => {
        const defaultSorted = await fetch(
          encodeURI(`${API_BASE}/gotenzymes/enzymes`)
        );
        const sortedByGene = await fetch(
          encodeURI(`${API_BASE}/gotenzymes/enzymes?pagination[column]=gene`)
        );
        const defaultSortedBody = await defaultSorted.json();
        const sortedByGeneBody = await sortedByGene.json();

        expect(defaultSortedBody).toEqual(sortedByGeneBody);
      });

      it('should be sorted in ascending order if no isAscending flag is given', async () => {
        const defaultSorted = await fetch(
          encodeURI(`${API_BASE}/gotenzymes/enzymes`)
        );
        const sortedByGene = await fetch(
          encodeURI(
            `${API_BASE}/gotenzymes/enzymes?pagination[isAscending]=true`
          )
        );
        const defaultSortedBody = await defaultSorted.json();
        const sortedByGeneBody = await sortedByGene.json();

        expect(defaultSortedBody).toEqual(sortedByGeneBody);
      });

      it.each([
        ['gene', true],
        ['organism', true],
        ['domain', true],
        ['reaction_id', true],
        ['ec_number', true],
        ['compound', true],
        ['kcat_values', true],
        ['gene', false],
        ['organism', false],
        ['domain', false],
        ['reaction_id', false],
        ['ec_number', false],
        ['compound', false],
        ['kcat_values', false],
      ])(
        'should sort enzymes by to %p with ascending order = %p',
        async (column, ascending) => {
          const sorted = await fetch(
            encodeURI(
              `${API_BASE}/gotenzymes/enzymes?pagination[page]=1&pagination[pageSize]=1000&pagination[column]=${column}&pagination[isAscending]=${ascending}`
            )
          );

          const sortedBody = await sorted.json();

          const values = sortedBody.enzymes.map(enzyme => enzyme[column]);
          const sortedValues = sortedBody.enzymes
            .map(enzyme => enzyme[column])
            .sort((a, b) => (ascending ? a - b : b - a));

          expect(values).toEqual(sortedValues);
        }
      );

      it('should return 400 BAD REQUEST if sort column does not exist', async () => {
        const res = await fetch(
          encodeURI(
            `${API_BASE}/gotenzymes/enzymes?pagination[column]=non-existing`
          )
        );

        expect(res.status).toBe(400);
      });
    });
  });

  describe('filtering', () => {
    it.each([
      ['gene', 'AXYL_01798'],
      ['organism', 'sce'],
      ['domain', 'B'],
      ['reaction_id', 'R00470'],
      ['compound', 'C00027'],
    ])('should filter by %p by equality', async (column, filterData) => {
      const filtered = await fetch(
        encodeURI(
          `${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=1000&filters[${column}]=${filterData}`
        )
      );
      const filteredBody = await filtered.json();

      filteredBody.enzymes.forEach(enzyme =>
        expect(enzyme[column]).toBe(filterData)
      );
    });

    it.each([
      ['gene', 'AXYL_01798'],
      ['organism', 'SCE'],
      ['domain', 'B'],
      ['reaction_id', 'R00470'],
      ['compound', 'C00027'],
    ])(
      'should return the same number of matches for %p when filtering by lower and upper case',
      async (column, filterData) => {
        const filtered = await fetch(
          encodeURI(
            `${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=1000&filters[${column}]=${filterData}`
          )
        );
        const filteredLower = await fetch(
          encodeURI(
            `${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=1000&filters[${column}]=${filterData.toLowerCase()}`
          )
        );
        const filteredBody = await filtered.json();
        const filteredBodyLower = await filteredLower.json();
        expect(filteredBody.totalCount).toBe(filteredBodyLower.totalCount);
      }
    );

    it('should filter by EC number by existence in comma separated string', async () => {
      const filtered = await fetch(
        encodeURI(
          `${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=1000&filters[ec_number]=4.1.3.42`
        )
      );
      const filteredBody = await filtered.json();

      filteredBody.enzymes.forEach(enzyme =>
        expect(enzyme.ec_number.split(';')).toContain('4.1.3.42')
      );
    });

    it('should filter by kcat_values by inclusion in range', async () => {
      const filtered = await fetch(
        encodeURI(
          `${API_BASE}/gotenzymes/enzymes?pagination[pageSize]=1000&filters[kcat_values]={"min":10.4,"max":10.42}`
        )
      );
      const filteredBody = await filtered.json();

      filteredBody.enzymes.forEach(enzyme => {
        expect(enzyme.kcat_values).toBeGreaterThanOrEqual(10.4);
        expect(enzyme.kcat_values).toBeLessThanOrEqual(10.42);
      });
    });
  });
});
