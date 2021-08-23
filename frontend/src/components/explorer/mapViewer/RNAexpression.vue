<template>
  <RNALegend></RNALegend>
</template>

<script>
// TODO: consider moving most of the data processing logic into store module
// and removing this file completely
import { mapGetters, mapState } from 'vuex';
import RNALegend from '@/components/explorer/mapViewer/RNALegend.vue';
import { getSingleRNAExpressionColor, getComparisonRNAExpressionColor, multipleColors } from '@/expression-sources/hpa';

export default {
  name: 'RNAexpression',
  components: {
    RNALegend,
  },
  props: {
    mapType: String,
    mapName: String,
  },
  data() {
    return {
      tissue1Source: '',
      dim: null,

      customTissues: [],
      customRNALevels: {},
      firstRNAlevels: {},

      computedRNAlevels: {}, // enz id as key, current tissue level as value
      multipleColors,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
      showing2D: state => state.maps.showing2D,
      tissue1: state => state.maps.tissue1,
      rnaLevels: state => state.humanProteinAtlas.levels,
    }),
    ...mapGetters({
      HPATissues: 'humanProteinAtlas/HPATissues',
    }),
  },
  async created() {
    await this.getRnaLevels();
  },
  methods: {
    async getRnaLevels() {
      // TODO: use new data overlay endpoint 
      // params: model, data source type (transcriptomics), data source file name
      await this.$store.dispatch('humanProteinAtlas/getLevels');
    },
    // TODO: consider moving following function to src/store/modules
    // parseHPARNAlevels(tissue, index, callback) {
    //   const RNAlevels = {};
    //   const tissueIndex = this.HPATissues.indexOf(tissue);
    //   // this.$store.dispatch(`maps/setTissue${index + 1}`, tissue);

    //   Object.keys(this.rnaLevels).forEach((enzID) => {
    //     RNAlevels[enzID] = this.rnaLevels[enzID][tissueIndex];
    //   });
    //   RNAlevels['n/a'] = 'n/a';
    //   if (index === 0) {
    //     this.firstRNAlevels = RNAlevels;
    //   } else {
    //     this.secondRNAlevels = RNAlevels;
    //   }
    //   if (callback) {
    //     callback();
    //   }
    // },
    loadCustomRNAlevels(file) {
      // TODO: replace usages of emit with store
      // get the tissues / columns and the series
      this.$emit('loadingCustomFile');
      const reader = new FileReader();

      // assigning handler
      reader.onloadend = (evt) => {
        const lines = evt.target.result.split(/\r?\n/);
        let indexLine = 1;
        // fetch Tissue
        if (lines[0].split('\t').length !== 1) {
          const arrLine = lines[0].split('\t');
          const v = Number(arrLine[1]);
          if (Number.isNaN(v)) {
            this.customTissues = lines[0].split('\t');
            this.customTissues.shift();
            lines.shift();
          } else {
            this.customTissues = [];
            for (let i = 1; i < arrLine.length; i += 1) {
              this.customTissues.push(`serie${i}`);
            }
          }
        } else {
          this.$emit('errorCustomFile', 'Error: invalid TSV format, expect at least two columns');
          return;
        }

        // parse lines
        const data = {};
        // make tissues key;
        for (let i = 0; i < this.customTissues.length; i += 1) {
          const tissue = this.customTissues[i];
          if (tissue in data) {
            this.$emit('errorCustomFile', `Error: duplicated column '${tissue}'`);
            return;
          }
          data[tissue] = {};
        }

        let entriesCount = 0;
        for (let k = 0; k < lines.length; k += 1) {
          const line = lines[k];
          if (line) {
            const arrLine = line.split('\t');
            if (arrLine.length !== this.customTissues.length + 1) {
              this.$emit('errorCustomFile', `Error: invalid number of values line ${indexLine}`);
              return;
            }
            for (let i = 1; i < arrLine.length; i += 1) {
              if (arrLine[i]) {
                const v = Number(arrLine[i]);
                if (Number.isNaN(v)) {
                  this.$emit('errorCustomFile', `Error: invalid value line ${indexLine}`);
                  return;
                }
                data[this.customTissues[i - 1]][arrLine[0]] = v;
              }
            }
            entriesCount += 1;
          }
          indexLine += 1;
        }
        this.customRNALevels = data;
        // return the columns loaded
        const info = { tissues: this.customTissues, entries: entriesCount, series: this.customTissues.length };
        this.$emit('loadedCustomLevels', info);
      };

      // start reading
      reader.readAsText(file);
    },
    parseCustomRNAlevels(tissue, index, callback) {
      const RNAlevels = this.customRNALevels[tissue];
      RNAlevels['n/a'] = 'n/a';
      if (index === 0) {
        this.firstRNAlevels = RNAlevels;
      } else {
        this.secondRNAlevels = RNAlevels;
      }
      if (callback) {
        callback();
      }
    },
    computeRNAlevels() {
      if (Object.keys(this.firstRNAlevels).length === 0 && Object.keys(this.secondRNAlevels).length === 0) {
        // nothing to compute
        EventBus.$emit(this.showing2D ? 'apply2DHPARNAlevels' : 'apply3DHPARNAlevels', {});
        this.RNAExpressionLegend = false;
        return;
      }
      this.computedRNAlevels = {};
      let RNAlevels = null;
      if (this.mode === 'single') {
        RNAlevels = Object.keys(this.firstRNAlevels).length === 0 ? this.secondRNAlevels : this.firstRNAlevels;
        Object.keys(RNAlevels).forEach((enzID) => {
          const level = this.roundValue(Math.log2(RNAlevels[enzID] + 1));
          this.computedRNAlevels[enzID] = [getSingleRNAExpressionColor(level), level];
        });
        this.computedRNAlevels['n/a'] = [getSingleRNAExpressionColor(NaN), 'n/a'];
      } else {
        // comparison
        if (this.tissue1Source === 'HPA' && this.tissue1Source === this.tissue2Source) {
          // HPA tissues data have the same entries, so no need to check for missing geneID
          Object.keys(this.firstRNAlevels).forEach((enzID) => {
            const log2tpm1 = this.roundValue(Math.log2(this.firstRNAlevels[enzID] + 1));
            const log2tpm2 = this.roundValue(Math.log2(this.secondRNAlevels[enzID] + 1));
            const level = this.roundValue(
              Math.log2((this.secondRNAlevels[enzID] + 1) / (this.firstRNAlevels[enzID] + 1))
            );
            this.computedRNAlevels[enzID] = [getComparisonRNAExpressionColor(level), level, log2tpm1, log2tpm2];
          });
        } else {
          // HPA/custom file comparison or custom/custom comparison
          Object.keys(this.firstRNAlevels).forEach((enzID) => {
            const log2tpm1 = this.roundValue(Math.log2(this.firstRNAlevels[enzID] + 1));
            if (enzID in this.secondRNAlevels) {
              const log2tpm2 = this.roundValue(Math.log2(this.secondRNAlevels[enzID] + 1));
              const level = this.roundValue(
                Math.log2((this.secondRNAlevels[enzID] + 1) / (this.firstRNAlevels[enzID] + 1))
              );
              this.computedRNAlevels[enzID] = [getComparisonRNAExpressionColor(level), level, log2tpm1, log2tpm2];
            } else {
              this.computedRNAlevels[enzID] = [getComparisonRNAExpressionColor(NaN), 'n/a', log2tpm1, 'n/a'];
            }
          });
          Object.keys(this.secondRNAlevels)
            .filter(enzID => !(enzID in this.firstRNAlevels))
            .forEach((enzID) => {
              const log2tpm2 = this.roundValue(Math.log2(this.secondRNAlevels[enzID] + 1));
              this.computedRNAlevels[enzID] = [getComparisonRNAExpressionColor(NaN), 'n/a', 'n/a', log2tpm2];
            });
        }
        this.computedRNAlevels['n/a'] = [getComparisonRNAExpressionColor(NaN), 'n/a'];
      }
      this.$nextTick(() => {
        EventBus.$emit(this.showing2D ? 'apply2DHPARNAlevels' : 'apply3DHPARNAlevels', this.computedRNAlevels);
      });
    },
    roundValue(value) {
      return Math.round((value + 0.00001) * 100) / 100;
    },
  },
};
</script>

<style lang="scss"></style>
