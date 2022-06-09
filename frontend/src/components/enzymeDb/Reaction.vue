<template>
  <div class="section extended-section">
    <div class="container is-fullhd">
      <div>
        <div class="columns">
          <div class="column">
            <h3 class="title is-3">Reaction {{ reactionId }}</h3>
          </div>
        </div>
        <loader v-if="showLoaderMessage" :message="showLoaderMessage" class="columns" />
        <div v-else class="columns is-8 is-centered">
          <div class="table-template column">
            <div class="table-container">
              <table class="table main-table is-fullwidth">
                <tr v-for="[k, v] in Object.entries(info).filter(([_, v]) => v)" :key="k">
                  <td class="td-key has-background-primary has-text-white-bis is-capitalized">
                    {{ k }}
                  </td>
                  <td>{{ v }}</td>
                </tr>
              </table>
            </div>
            <div v-if="Object.keys(crossReferences).length > 0">
              <h4 class="subtitle is-4">Cross references</h4>
              <div class="table-container">
                <table class="table main-table is-fullwidth">
                  <tr
                    v-for="[k, v] in Object.entries(crossReferences).filter(([_, v]) => v)"
                    :key="k"
                  >
                    <td class="td-key has-background-primary has-text-white-bis is-uppercase">
                      {{ reformatTableKey(k) }}
                    </td>
                    <td>{{ v }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <vue-good-table
          mode="remote"
          style-class="vgt-table striped"
          :columns="columns"
          :rows="enzymes"
          :sort-options="{ enabled: true }"
          :pagination-options="tablePaginationOptions"
          :total-rows="totalRows"
          @on-page-change="onPageChange"
          @on-sort-change="onSortChange"
          @on-column-filter="onColumnFilter"
        ></vue-good-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueGoodTable } from 'vue-good-table';
import Loader from '@/components/Loader';
import { default as messages } from '@/content/messages';
import { reformatTableKey } from '@/helpers/utils';

export default {
  name: 'EnzymeReaction',
  components: {
    Loader,
    VueGoodTable,
  },
  data() {
    return {
      reactionId: this.$route.params.id,
      notFound: false,
      showLoaderMessage: '',
      messages,
      columns: [
        {
          label: 'Protein',
          field: 'protein',
          sortable: true,
          filterOptions: { enabled: true },
        },
        {
          label: 'Organism',
          field: 'organism',
          sortable: true,
          filterOptions: { enabled: true },
        },
        {
          label: 'Domain',
          field: 'domain',
          sortable: true,
          filterOptions: { enabled: true },
        },
        {
          label: 'KO',
          field: 'ko',
          sortable: true,
          filterOptions: { enabled: true },
        },
        {
          label: 'Reaction',
          field: 'reaction_id',
          sortable: true,
          filterOptions: { enabled: true },
        },
        {
          label: 'EC',
          field: 'ec_number',
          sortable: true,
          filterOptions: { enabled: true },
        },
        {
          label: 'Compound',
          field: 'compound',
          sortable: true,
          filterOptions: { enabled: true },
        },
        {
          label: 'kcat',
          field: 'kcat_values',
          sortable: true,
          filterOptions: { enabled: false },
        },
        {
          label: 'km',
          field: 'km_values',
          sortable: true,
          filterOptions: { enabled: false },
        },
      ],
      tablePaginationOptions: {
        enabled: true,
        mode: 'pages',
        perPage: 50,
        position: 'bottom',
        setCurrentPage: 1,
        nextLabel: 'next',
        prevLabel: 'prev',
        rowsPerPageLabel: 'Rows per page',
        ofLabel: 'of',
        perPageDropdownEnabled: false,
      },
      serverPaginationOptions: {
        filters: {},
        pagination: {
          page: 1,
          pageSize: 50,
          column: 'protein',
          isAscending: true,
        },
      },
    };
  },
  computed: {
    ...mapState({
      info: state => state.enzymeDb.info,
      crossReferences: state => state.enzymeDb.crossReferences,
      enzymes: state => state.enzymeDb.enzymes,
      totalRows: state => state.enzymeDb.totalEnzymes,
    }),
  },
  async mounted() {
    await this.setup();
  },
  methods: {
    async setup() {
      this.reactionId = this.$route.params.id;
      this.showLoaderMessage = 'Loading reaction data';

      try {
        await this.$store.dispatch('enzymeDb/getReactionData', this.reactionId);

        this.serverPaginationOptions = {
          ...this.serverPaginationOptions,
          filters: {
            ...this.serverPaginationOptions.filters,
            reaction_id: this.reactionId,
          },
        };

        await this.$store.dispatch('enzymeDb/getEnzymes', this.serverPaginationOptions);
        this.notFound = false;
        this.showLoaderMessage = '';
      } catch {
        this.notFound = true;
        this.showLoaderMessage = '';
      }
    },
    async onPageChange({ currentPage }) {
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        pagination: {
          ...this.serverPaginationOptions.pagination,
          page: currentPage,
        },
      };

      await this.$store.dispatch('enzymeDb/getEnzymes', this.serverPaginationOptions);
    },
    async onSortChange([{ field, type }]) {
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        pagination: {
          ...this.serverPaginationOptions.pagination,
          column: field,
          isAscending: type === 'asc',
        },
      };

      await this.$store.dispatch('enzymeDb/getEnzymes', this.serverPaginationOptions);
    },
    async onColumnFilter({ columnFilters }) {
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        filters: {
          ...this.serverPaginationOptions.filters,
          ...columnFilters,
        },
      };

      await this.$store.dispatch('enzymeDb/getEnzymes', this.serverPaginationOptions);
    },
    reformatTableKey,
  },
};
</script>

<style lang="scss"></style>
