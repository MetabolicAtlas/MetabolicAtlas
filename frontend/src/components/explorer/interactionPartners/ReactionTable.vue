<template>
  <div class="container is-fullhd reaction-table">
    <div class="columns">
      <div class="column is-half is-8-tablet">
        <input
          v-model="tableSearch"
          class="input"
          type="text"
          placeholder="Search in table"
          data-hj-whitelist
          @keyup.prevent="updateTable"
        />
      </div>
      <div class="column"></div>
      <div class="column is-narrow">
        <ExportTSV :filename="`${filename}.tsv`" :format-function="formatToTSV" />
      </div>
    </div>
    <div class="field">
      <span class="tag"># Reaction(s): {{ reactions.length }}</span>
      &nbsp;
      <span class="tag"># Unique Metabolite(s): {{ metaboliteCount }}</span>
      &nbsp;
      <span v-show="geneCount" class="tag"># Unique Gene(s): {{ geneCount }}</span>
      <!--span v-show="isGraphVisible">
            &nbsp; Click on a
            <span class="tag is-rounded"><span class="is-size-6">label</span></span>
            to highlight the corresponding element on the graph
          </span-->
    </div>
    <div class="table-container">
      <table ref="table" class="table is-bordered is-narrow is-fullwidth">
        <thead>
          <tr style="background: #f8f4f4">
            <th
              v-for="s in columns"
              :key="s.field"
              class="is-unselectable is-clickable"
              @click="sortBy(s.field)"
            >
              {{ s.display }}
            </th>
          </tr>
        </thead>
        <template v-for="tb in tableBodies" :key="tb.id">
          <tbody :id="tb.id" :ref="tb.id">
            <tr v-for="r in tb.reactions" :key="r.id" class="reaction-tr">
              <td v-for="(s, index) in columns" :key="s.field" :data-label="columns[index].field">
                <template v-if="s.field === 'id'">
                  <div class="td-content">
                    <span
                      class="tag is-rounded"
                      :class="[{ hl: isSelected(r.id) }, '']"
                      @click="HLreaction(r.id)"
                    >
                      <span class="is-size-6">{{ r.id }}</span>
                    </span>
                  </div>
                </template>
                <template v-else-if="['reactants', 'products', 'genes'].includes(s.field)">
                  <div class="td-content">
                    <template v-for="el in r[s.field]">
                      <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
                      <span
                        class="tag is-rounded is-medium"
                        :title="el.id"
                        :class="[{ hl: isSelected(el.id) }, '']"
                        @click="highlight(el.id)"
                      >
                        <span class="tag-text">{{ el.name || el.id }}</span>
                      </span>
                    </template>
                  </div>
                </template>
                <template v-else>
                  <div class="td-content">
                    <compartment-links
                      :compartment-string="r.compartment"
                      :is-reversible="r.reversible"
                    />
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
        </template>
      </table>
    </div>
  </div>
</template>

<script>
import CompartmentLinks from '@/components/shared/CompartmentLinks.vue';
import ExportTSV from '@/components/shared/ExportTSV.vue';
import { default as compare } from '@/helpers/compare';

export default {
  name: 'ReactionTable',
  components: {
    CompartmentLinks,
    ExportTSV,
  },
  props: {
    reactions: Array,
    selectedElmId: String,
    selectedReactionId: String,
    isGraphVisible: Boolean,
    filename: String,
  },
  emits: ['highlight', 'HLreaction'],
  data() {
    return {
      columns: [
        { field: 'id', display: 'Reaction ID' },
        { field: 'reactants', display: 'Reactants' },
        { field: 'products', display: 'Products' },
        { field: 'genes', display: 'Genes' },
        { field: 'compartment', display: 'Compartment' },
      ],
      matchingReactions: [],
      unmatchingReactions: [],
      sortAsc: true,
      sortField: null,
      tableSearch: '',
      errorMessage: '',
      hlID: null,
    };
  },
  computed: {
    tableBodies() {
      return [
        { id: 'matchingTableBody', reactions: this.matchingReactions },
        { id: 'unmatchingTableBody', reactions: this.unmatchingReactions },
      ];
    },
    sortedReactions() {
      const reactions = Array.prototype.slice.call(this.reactions); // Do not mutate original elms;
      return reactions.sort(compare(this.sortField, null, this.sortAsc ? 'asc' : 'desc'));
    },
    geneCount() {
      const genes = new Set();
      this.reactions.forEach(r => {
        r.genes.forEach(e => {
          genes.add(e.id);
        });
      });
      return genes.size;
    },
    metaboliteCount() {
      const metabolites = new Set();
      this.reactions.forEach(r => {
        r.reactants.forEach(e => {
          metabolites.add(e.id);
        });
        r.products.forEach(e => {
          metabolites.add(e.id);
        });
      });
      return metabolites.size;
    },
  },
  watch: {
    reactions() {
      this.sortAsc = true;
      this.sortField = null;
      this.hlID = null;
      this.updateTable();
    },
    selectedElmId() {
      this.hlID = this.selectedElmId.slice();
    },
  },
  mounted() {
    this.hlID = null;
    this.updateTable();
  },
  methods: {
    isSelected(elmId) {
      return this.hlID === elmId || this.selectedReactionId === elmId;
    },
    highlight(elmId) {
      const sameID = this.hlID === elmId;
      this.hlID = sameID ? '' : elmId;
      this.$emit('highlight', this.hlID);
    },
    HLreaction(rID) {
      this.$emit('HLreaction', this.selectedReactionId === rID ? null : rID);
    },
    sortBy(field) {
      this.sortField = field;
      this.sortAsc = !this.sortAsc;
      this.updateTable();
    },
    updateTable() {
      if (this.tableSearch === '') {
        this.matchingReactions = Array.prototype.slice.call(this.sortedReactions);
        this.unmatchingReactions = [];
        if (this.$refs.matchingTableBody.style) {
          this.$refs.matchingTableBody.style.display = '';
        }
      } else {
        this.matchingReactions = [];
        this.unmatchingReactions = [];
        const t = this.tableSearch.toLowerCase();
        this.sortedReactions.forEach(elm => {
          let matches = false;
          this.columns.every(s => {
            const val = elm[s.field];
            if (typeof val === 'object' && ['reactants', 'products', 'genes'].includes(s.field)) {
              let match = false;
              val.every(el => {
                Object.keys(el).every(k => {
                  if (k === 'id') {
                    match = el[k].toLowerCase() === t;
                  } else {
                    match = el[k].toLowerCase().includes(t);
                  }
                  if (match) {
                    matches = match;
                  }
                  return !matches;
                });
                return !matches;
              });
            } else if (!matches && val && val.toLowerCase().includes(t)) {
              matches = true;
            }
            return !matches;
          });
          if (matches) {
            this.matchingReactions.push(elm);
          } else {
            this.unmatchingReactions.push(elm);
          }
        });

        // fix disappearing row/cell borders
        if (this.matchingReactions.length === 0) {
          this.$refs.matchingTableBody.style.display = 'none';
        } else {
          this.$refs.matchingTableBody.style.display = '';
        }
      }
    },
    formatToTSV() {
      let tsvContent = `${this.columns.map(e => e.display).join('\t')}\n`;
      tsvContent += this.sortedReactions
        .map(d =>
          [
            d.id,
            d.reactants.map(e => e.name || e.id).join('; '),
            d.products.map(e => e.name || e.id).join('; '),
            d.genes.map(e => e.name || e.id).join('; '),
            d.compartment,
          ].join('\t')
        )
        .join('\n');
      return tsvContent;
    },
  },
};
</script>

<style lang="scss" scoped>
.reaction-table {
  #unmatchingTableBody {
    opacity: 0.3;
  }

  sup {
    vertical-align: bottom;
    font-size: 0.7em;

    &.top {
      vertical-align: top;
    }
  }
}

@media screen and (max-width: $tablet) {
  .reaction-table table {
    border: 0;
    table-layout: fixed;
    overflow-wrap: break-word;

    thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    tr {
      display: block;
      margin-bottom: 0.625em;

      td {
        border-bottom-width: 0;
        display: block;
        font-size: 0.8em;
        min-height: 2.4em;

        &::before {
          content: attr(data-label);
          float: left;
          font-weight: bold;
          text-transform: uppercase;
          padding-left: 1px;
        }

        &:last-child {
          border-bottom-width: 1px;
        }

        .td-content {
          text-align: right;
        }

        .tag,
        .tag-text {
          max-width: 100%;
        }

        .tag-text {
          overflow: hidden;
        }
      }
    }
  }
}
</style>
