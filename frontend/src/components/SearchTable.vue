<template>
  <section class="section extended-section">
    <div id="search-table" class="container is-fullhd pb-6">
      <div class="columns">
        <div class="column has-text-centered content mt-5">
          <h3 class="title is-3">Search within all integrated GEMs</h3>
          <h5 class="subtitle is-5 has-text-weight-normal">
            for reactions, metabolites, genes, subsystems and compartments
          </h5>
        </div>
      </div>
      <div class="columns is-centered">
        <div
          class="column is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile control"
        >
          <div class="searchWrapper">
            <p class="control has-icons-right has-icons-left searchInput">
              <input
                id="search"
                v-model="searchTerm"
                role="searchbox"
                data-hj-whitelist
                class="input"
                type="text"
                placeholder="uracil, SULT1A3, Acyl-CoA hydrolysis"
                aria-label="search box"
                @keyup.enter="updateSearch()"
              />
              <span
                v-show="showSearchCharAlert"
                class="has-text-info icon is-right"
                style="width: 220px"
              >
                Type at least 2 characters
              </span>
              <span class="icon is-medium is-left">
                <i class="fa fa-search is-primary"></i>
              </span>
            </p>
            <HelpButton
              redirect-page-path="documentation"
              redirect-page-hash="global-search"
            ></HelpButton>
          </div>
        </div>
      </div>
      <!-- eslint-disable-next-line max-len -->
      <div
        v-if="notFoundSuggestions.length !== 0 && searchResultsEmpty"
        class="columns is-centered"
      >
        <div
          class="column is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile control"
        >
          Do you mean:&nbsp;
          <template v-for="v in notFoundSuggestions" :key="v">
            <router-link :to="{ name: 'search', query: { term: v } }">
              <span class="suggestions">{{ v }}</span>
            </router-link>
            &nbsp;
          </template>
          ?
        </div>
      </div>
      <div>
        <div v-if="showTabType" class="tabs is-boxed is-fullwidth">
          <ul>
            <li
              v-for="tab in tabs"
              :key="tab"
              :disabled="resultsCount[tab] === 0 || null"
              :class="[
                { 'is-active has-text-weight-bold': showTab(tab) && resultsCount[tab] !== 0 },
                { 'is-disabled': resultsCount[tab] === 0 },
              ]"
              @click="resultsCount[tab] !== 0 ? (showTabType = tab) : ''"
            >
              <a class="is-capitalized">
                <p>
                  {{ tab }}s
                  <span :class="{ 'has-text-info': resultsCount[tab] !== 0 }">
                    ({{ resultsCount[tab] }})
                  </span>
                </p>
              </a>
            </li>
          </ul>
        </div>
        <loader v-show="loading && searchTerm !== ''"></loader>
        <div v-show="!loading">
          <div class="columns is-centered">
            <div
              v-if="searchResultsEmpty"
              class="column is-three-fifths-desktop is-three-quarters-tablet is-fullwidth-mobile"
            >
              <div v-if="searchedTerm" class="has-text-centered notification">
                {{ messages.searchNoResult }} for
                <b>
                  <i>{{ searchedTerm }}</i>
                </b>
                among all {{ Object.keys(models).length }} integrated GEMs
              </div>
              <div class="content">
                <h5 class="title is-5">You may search for the following items:</h5>
                <h6 class="title is-6 m-0">Metabolites</h6>
                <ul>
                  <li>
                    ID (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'MAM01738p' } }">
                      MAM01738p
                    </router-link>
                    )
                  </li>
                  <li>
                    Name or aliases (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'dopamine-O-quinone' } }">
                      dopamine-O-quinone
                    </router-link>
                    )
                  </li>
                  <li>
                    Formula without charge (e.g.
                    <router-link
                      :to="{
                        name: 'search',
                        query: { term: 'C8H10NO2' },
                      }"
                    >
                      C8H10NO2
                    </router-link>
                    )
                  </li>
                  <li>
                    Cross references (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'CE5276' } }">
                      CE5276
                    </router-link>
                    )
                  </li>
                </ul>
                <h6 class="title is-6 m-0">Genes</h6>
                <ul>
                  <li>
                    ID (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'ENSG00000151883' } }">
                      ENSG00000151883
                    </router-link>
                    )
                  </li>
                  <li>
                    Name or aliases (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'PARP8' } }">
                      PARP8
                    </router-link>
                    )
                  </li>
                  <li>
                    Cross references (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'Q8N3A8' } }">
                      Q8N3A8
                    </router-link>
                    )
                  </li>
                </ul>
                <h6 class="title is-6 m-0">Reactions</h6>
                <ul>
                  <li>
                    ID (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'MAR04255' } }">
                      MAR04255
                    </router-link>
                    )
                  </li>
                  <li>
                    EC code (e.g.
                    <router-link :to="{ name: 'search', query: { term: '3.6.1.22;3.6.1.9' } }">
                      3.6.1.22;3.6.1.9
                    </router-link>
                    )
                  </li>
                  <li>
                    Cross references (e.g.
                    <router-link :to="{ name: 'search', query: { term: 'RCR13746' } }">
                      RCR13746
                    </router-link>
                    )
                  </li>
                  <li>
                    PMID (e.g.
                    <router-link :to="{ name: 'search', query: { term: '11579996' } }">
                      11579996
                    </router-link>
                    )
                  </li>
                </ul>
                <h6 class="title is-6 m-0">Subsystems and compartments</h6>
                <ul>
                  <li>
                    Name (e.g.
                    <router-link
                      :to="{ name: 'search', query: { term: 'Keratan sulfate degradation' } }"
                    >
                      Keratan sulfate degradation
                    </router-link>
                    )
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <template v-for="(header, index) in tabs">
            <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
            <div v-show="showTab(header) && resultsCount[header] !== 0">
              <vue-good-table
                ref="searchTables"
                :columns="columns[header]"
                :rows="rows[header]"
                :sort-options="{ enabled: true, skipDiacritics: true }"
                style-class="vgt-table striped bordered"
                :pagination-options="tablePaginationOpts"
              >
                <template #table-actions>
                  <ExportTSV
                    :arg="index"
                    class="my-1 mx-4"
                    :filename="`${searchTerm}-${header}.tsv`"
                    :format-function="formatToTSV"
                  ></ExportTSV>
                </template>
                <template #table-row="props">
                  <!-- eslint-disable max-len -->
                  <template v-if="props.column.field === 'model'">
                    {{ props.formattedRow[props.column.field].name }}
                  </template>

                  <template v-else-if="props.column.field === 'formula'">
                    <span
                      v-html="chemicalFormula(props.row[props.column.field], props.row.charge)"
                    ></span>
                  </template>
                  <template v-else-if="['name', 'id'].includes(props.column.field)">
                    <router-link
                      :to="{
                        name: header,
                        params: { model: props.row.model.id, id: props.row.id },
                      }"
                    >
                      {{ props.row.name || props.row.id }}
                    </router-link>
                  </template>
                  <template v-else-if="props.column.field === 'subsystem'">
                    <template v-if="props.formattedRow[props.column.field].length === 0">
                      {{ '' }}
                    </template>
                    <template v-for="(sub, i) in props.formattedRow[props.column.field]" v-else>
                      <template v-if="i !== 0">;</template>
                      <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key max-len -->
                      <router-link
                        :to="{
                          name: 'subsystem',
                          params: { model: props.row.model.id, id: sub.id },
                        }"
                      >
                        {{ sub.name }}
                      </router-link>
                    </template>
                  </template>
                  <template
                    v-else-if="['compartment', 'compartments'].includes(props.column.field)"
                  >
                    <template v-if="props.formattedRow[props.column.field].length === 0">
                      {{ '' }}
                    </template>
                    <template v-else-if="['gene', 'subsystem', 'reaction'].includes(header)">
                      <template v-for="(comp, i) in props.formattedRow[props.column.field]">
                        <!-- eslint-disable vue/valid-v-for vue/require-v-for-key -->
                        <template v-if="i != 0">;</template>
                        <router-link
                          :to="{
                            name: 'compartment',
                            params: { model: props.row.model.id, id: comp.id },
                          }"
                        >
                          {{ comp.name }}
                        </router-link>
                        <!-- eslint-enable vue/valid-v-for vue/require-v-for-key -->
                      </template>
                    </template>
                    <template v-else-if="Array.isArray(props.formattedRow[props.column.field])">
                      {{ props.formattedRow[props.column.field].join('; ') }}
                    </template>
                    <template v-else>
                      <router-link
                        :to="{
                          name: 'compartment',
                          params: {
                            model: props.row.model.id,
                            id: props.formattedRow[props.column.field].id,
                          },
                        }"
                      >
                        {{ props.formattedRow[props.column.field].name }}
                      </router-link>
                    </template>
                  </template>
                  <template v-else-if="Array.isArray(props.formattedRow[props.column.field])">
                    {{ props.formattedRow[props.column.field].join('; ') }}
                  </template>
                  <template v-else>
                    {{ props.formattedRow[props.column.field] }}
                  </template>
                </template>
              </vue-good-table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import 'vue-good-table-next/dist/vue-good-table-next.css';
import { VueGoodTable } from 'vue-good-table-next';
import Loader from '@/components/Loader.vue';
import ExportTSV from '@/components/shared/ExportTSV.vue';
import { chemicalFormula } from '@/helpers/chemical-formatters';
import { sortResultsScore } from '@/helpers/utils';
import { default as messages } from '@/content/messages';
import HelpButton from '@/components/shared/HelpButton.vue';

export default {
  name: 'SearchTable',
  components: {
    Loader,
    ExportTSV,
    VueGoodTable,
    HelpButton,
  },
  data() {
    return {
      messages,
      tablePaginationOpts: {
        enabled: true,
        perPage: 50,
        position: 'bottom',
        perPageDropdown: [25, 50, 100, 200],
        dropdownAllowAll: false,
        setCurrentPage: 1,
        nextLabel: 'next',
        prevLabel: 'prev',
        rowsPerPageLabel: 'Rows per page',
        ofLabel: 'of',
      },
      columns: {
        metabolite: [
          {
            label: 'Model',
            field: 'model',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.id === s,
            },
            sortable: true,
          },
          {
            label: 'Name',
            field: 'name',
            filterOptions: {
              enabled: true,
            },
            sortable: true,
          },
          {
            label: 'Formula',
            field: 'formula',
            filterOptions: {
              enabled: true,
            },
            sortable: true,
          },
          {
            label: 'Subsystem',
            field: 'subsystem',
            filterOptions: {
              enabled: true,
              filterFn: (e, s) =>
                e.filter(v => v.name.toLowerCase().includes(s.toLowerCase())).length !== 0,
            },
            sortable: true,
          },
          {
            label: 'Compartment',
            field: 'compartment',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.name === s,
            },
            sortable: true,
          },
        ],
        gene: [
          {
            label: 'Model',
            field: 'model',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.id === s,
            },
            sortable: true,
          },
          {
            label: 'Name',
            field: 'name',
            filterOptions: {
              enabled: true,
            },
            sortable: true,
          },
          {
            label: 'Subsystem',
            field: 'subsystem',
            filterOptions: {
              enabled: true,
              filterFn: (e, s) =>
                e.filter(v => v.name.toLowerCase().includes(s.toLowerCase())).length !== 0,
            },
            sortable: true,
          },
          {
            label: 'Compartment',
            field: 'compartment',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.filter(v => v.name === s).length !== 0,
            },
            sortable: true,
          },
        ],
        reaction: [
          {
            label: 'Model',
            field: 'model',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.id === s,
            },
            sortable: true,
          },
          {
            label: 'ID',
            field: 'id',
            filterOptions: {
              enabled: true,
            },
            sortable: true,
          },
          {
            label: 'Subsystem',
            field: 'subsystem',
            filterOptions: {
              enabled: true,
              filterFn: (e, s) =>
                e.filter(v => v.name.toLowerCase().includes(s.toLowerCase())).length !== 0,
            },
            sortable: true,
          },
          {
            label: 'Compartment',
            field: 'compartment',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.filter(v => v.name === s).length !== 0,
            },
            sortable: true,
          },
        ],
        subsystem: [
          {
            label: 'Model',
            field: 'model',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.id === s,
            },
            sortable: true,
          },
          {
            label: 'Name',
            field: 'name',
            filterOptions: {
              enabled: true,
            },
            sortable: true,
          },
          {
            label: 'Compartment',
            field: 'compartments',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.filter(v => v.name === s).length !== 0,
            },
            sortable: true,
          },
          {
            label: 'Metabolites',
            field: 'compartmentalizedMetaboliteCount',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
          {
            label: 'Genes',
            field: 'geneCount',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
          {
            label: 'Reactions',
            field: 'reactionCount',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
        ],
        compartment: [
          {
            label: 'Model',
            field: 'model',
            filterOptions: {
              enabled: true,
              filterDropdownItems: [],
              filterFn: (e, s) => e.id === s,
            },
            formatFn: this.getDisplayModelName,
            sortable: true,
          },
          {
            label: 'Name',
            field: 'name',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
          {
            label: 'Metabolites',
            field: 'compartmentalizedMetaboliteCount',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
          {
            label: 'Genes',
            field: 'geneCount',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
          {
            label: 'Reactions',
            field: 'reactionCount',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
          {
            label: 'Subsystems',
            field: 'subsystemCount',
            filterOptions: {
              enabled: false,
            },
            sortable: true,
          },
        ],
      },
      searchTerm: '',
      searchedTerm: '',
      showSearchCharAlert: false,
      showTabType: '',
      loading: false,
      rows: {
        metabolite: [],
        gene: [],
        reaction: [],
        subsystem: [],
        compartment: [],
      },
      notFoundSuggestions: [],
    };
  },
  computed: {
    ...mapState({
      tabs: state => state.search.categories,
    }),
    ...mapGetters({
      searchResults: 'search/categorizedGlobalResults',
      searchResultsEmpty: 'search/globalResultsEmpty',
      resultsCount: 'search/categorizedGlobalResultsCount',
      componentTypeOrder: 'search/globalResultsComponentTypeOrder',
      models: 'models/models',
    }),
  },
  // the following two navigation guards are ignored
  // see: https://router.vuejs.org/guide/migration/index.html#navigation-guards-in-mixins-are-ignored
  // eslint-disable-next-line no-unused-vars
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.query.term) {
        vm.searchedTerm = to.query.term; // eslint-disable-line no-param-reassign
        vm.validateSearch(to.query.term);
      } else if (vm.searchTerm) {
        vm.$router.replace({ query: { term: vm.searchTerm } });
      }
      next();
    });
  },
  // eslint-disable-next-line no-unused-vars
  async beforeRouteUpdate(to, from, next) {
    if (to.query.term && to.query.term !== this.searchedTerm) {
      this.searchedTerm = to.query.term;
      await this.validateSearch(to.query.term);
    }
    next();
  },
  updated() {
    document.getElementById('search').focus();
  },
  methods: {
    fillFilterFields() {
      const filterTypeDropdown = {
        metabolite: {
          model: {},
          compartment: {},
        },
        gene: {
          model: {},
          compartment: {},
        },
        reaction: {
          model: {},
          compartment: {},
        },
        subsystem: {
          model: {},
          compartment: {},
        },
        compartment: {
          model: {},
        },
      };

      const rows = {
        metabolite: [],
        gene: [],
        reaction: [],
        subsystem: [],
        compartment: [],
      };

      // store choice only once in a dict
      Object.keys(this.searchResults).forEach(componentType => {
        const compoList = this.searchResults[componentType];
        /* Sorted twice as sortResultsSearchTerm does not catch cases when
        this.searchResult contains nodes that were returned because they have a relationship
        with a node where searchedTerm is part of a property, not because they have that property themselves.
        (e.g. when searching for matches for external id:s). Thus they need to be sorted by their score.
        Unfortunately, one can not rely only to sorting on score, as the scores return by neo4j in some cases
        are not 100% as desired (e.g, searching for 'POLR3F' and gene POLR2A has a higher score than gene POLR3F)
        */
        compoList.sort((a, b) => sortResultsScore(a, b));
        compoList.forEach(el => {
          // e.g. results list for metabolites
          if (componentType === 'metabolite') {
            Object.keys(filterTypeDropdown[componentType]).forEach(field => {
              if (field === 'model') {
                filterTypeDropdown[componentType][field][el[field].id] = el[field].name;
              } else if (el[field] && field === 'compartment') {
                filterTypeDropdown[componentType][field][el[field].name] = 1;
              }
            });
            rows[componentType].push(el);
          } else if (componentType === 'gene') {
            Object.keys(filterTypeDropdown[componentType]).forEach(field => {
              if (field === 'model') {
                filterTypeDropdown[componentType][field][el[field].id] = el[field].name;
              } else if (el[field] && field === 'compartment') {
                el[field]
                  .filter(v => !(v.id in filterTypeDropdown[componentType][field]))
                  .forEach(v => {
                    filterTypeDropdown[componentType][field][v.name] = 1;
                  });
              }
            });
            rows[componentType].push(el);
          } else if (componentType === 'reaction') {
            Object.keys(filterTypeDropdown[componentType]).forEach(field => {
              if (field === 'compartment') {
                el[field]
                  .filter(v => !(v in filterTypeDropdown[componentType][field]))
                  .forEach(v => {
                    filterTypeDropdown[componentType][field][v.name] = 1;
                  });
              } else if (field === 'model') {
                filterTypeDropdown[componentType][field][el[field].id] = el[field].name;
              } else if (!(el[field] in filterTypeDropdown[componentType][field])) {
                filterTypeDropdown[componentType][field][el[field]] = 1;
              }
            });
            rows[componentType].push({
              id: el.id,
              model: el.model,
              subsystem: el.subsystem,
              compartment: el.compartment,
            });
          } else if (componentType === 'subsystem') {
            Object.keys(filterTypeDropdown[componentType]).forEach(field => {
              if (field === 'compartments') {
                el[field]
                  .filter(
                    compartment => !(compartment.id in filterTypeDropdown[componentType][field]),
                  )
                  .forEach(compartment => {
                    filterTypeDropdown[componentType][field][compartment.name] = 1;
                  });
              } else if (field === 'model') {
                filterTypeDropdown[componentType][field][el[field].id] = el[field].name;
              }
            });
            rows[componentType].push(el);
          } else if (componentType === 'compartment') {
            Object.keys(filterTypeDropdown[componentType]).forEach(field => {
              // 'model' field
              filterTypeDropdown[componentType][field][el[field].id] = el[field].name;
            });
            rows[componentType].push(el);
          }
        });
        Object.keys(filterTypeDropdown[componentType]).forEach(field => {
          if (field === 'model') {
            filterTypeDropdown[componentType][field] = Object.keys(
              filterTypeDropdown[componentType][field],
            ).map(
              e => {
                const d = {};
                d.value = e;
                d.text = filterTypeDropdown[componentType][field][e];
                return d;
              }, // eslint-disable-line
            );
          } else {
            filterTypeDropdown[componentType][field] = Object.keys(
              filterTypeDropdown[componentType][field],
            )
              .map(e => {
                let v = e;
                if (v === 'true') {
                  v = 'Yes';
                } else if (v === 'false') {
                  v = 'No';
                }
                return v;
              })
              .sort();
          }
        });
      });
      // assign filter choices lists to the columns
      this.columns.metabolite[0].filterOptions.filterDropdownItems =
        filterTypeDropdown.metabolite.model;
      this.columns.metabolite[4].filterOptions.filterDropdownItems =
        filterTypeDropdown.metabolite.compartment;

      this.columns.gene[0].filterOptions.filterDropdownItems = filterTypeDropdown.gene.model;
      this.columns.gene[3].filterOptions.filterDropdownItems = filterTypeDropdown.gene.compartment;

      this.columns.reaction[0].filterOptions.filterDropdownItems =
        filterTypeDropdown.reaction.model;
      this.columns.reaction[3].filterOptions.filterDropdownItems =
        filterTypeDropdown.reaction.compartment;

      this.columns.subsystem[0].filterOptions.filterDropdownItems =
        filterTypeDropdown.subsystem.model;
      this.columns.subsystem[2].filterOptions.filterDropdownItems =
        filterTypeDropdown.subsystem.compartments;

      this.columns.compartment[0].filterOptions.filterDropdownItems =
        filterTypeDropdown.subsystem.model;
      this.rows = rows;
    },
    updateSearch() {
      if (this.searchTerm !== this.searchedTerm) {
        this.$router.push({
          name: 'search',
          query: {
            term: this.searchTerm,
          },
        });
      }
    },
    showTab(elementType) {
      return this.showTabType === elementType;
    },
    async validateSearch(term) {
      this.searchTerm = term;
      this.showSearchCharAlert = false;
      this.$store.dispatch('search/clearGlobalSearchResults');
      this.showTabType = '';
      this.searchResultsFiltered = {};
      if (this.searchTerm.length > 1) {
        await this.search();
      } else if (this.searchTerm.length === 1) {
        this.showSearchCharAlert = true;
      }
    },
    async search() {
      this.loading = true;
      try {
        await this.$store.dispatch('search/globalSearch', this.searchTerm);
      } catch (error) {
        if (error.response.headers.suggestions) {
          this.notFoundSuggestions = JSON.parse(error.response.headers.suggestions);
        } else {
          this.notFoundSuggestions = [];
        }
        this.$store.dispatch('search/clearGlobalSearchResults');
      } finally {
        this.loading = false;
        // get filters
        this.fillFilterFields();
        // select the tab with the highest ranked result
        const [topRankedComponentType] = this.componentTypeOrder;
        this.showTabType = topRankedComponentType;
      }
    },
    formatToTSV(index) {
      const rows = Array.from(this.$refs.searchTables[index].filteredRows[0].children);
      const header = [];
      let getHeader = false;
      const tsvContent = rows
        .map(e => {
          const rowData = [];
          Object.entries(e).forEach(entry => {
            const key = entry[0];
            let value = entry[1];
            if (key !== 'vgt_id' && key !== 'originalIndex') {
              if (!getHeader) {
                header.push(key);
              }
              if (key === 'model') {
                rowData.push(value.name);
              } else {
                if (Array.isArray(value)) {
                  value = value.join('; ');
                }
                rowData.push(value);
              }
            }
          });
          if (!getHeader) {
            getHeader = true;
          }
          return rowData.join('\t');
        })
        .join('\n');
      return `${header.join('\t')}\n${tsvContent}`;
    },
    chemicalFormula,
    sortResultsScore,
  },
};
</script>

<style lang="scss">
.searchWrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
}
.searchInput {
  flex: 1;
}
#search-table {
  .tabs li.is-disabled {
    cursor: not-allowed;
    color: gray;
    opacity: 0.75;

    a {
      cursor: not-allowed;
    }
  }
  .suggestions {
    text-decoration: underline;
  }
}
</style>
