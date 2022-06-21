<template>
  <div>
    <div class="field columns">
      <div class="column"></div>
      <div class="column is-narrow">
        <ExportTSV
          :filename="`Enzymes for ${componentType} ${componentId}.tsv`"
          :format-function="formatToTSV"
        ></ExportTSV>
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
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueGoodTable } from 'vue-good-table';
import ExportTSV from '@/components/shared/ExportTSV';

export default {
  name: 'EnzymesTable',
  components: {
    VueGoodTable,
    ExportTSV,
  },
  props: {
    initialFilter: { type: Object, default: () => {} },
    componentId: { type: String },
    componentType: { type: String },
  },
  data() {
    return {
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
      ].filter(col => col.label !== this.componentType),
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
      enzymes: state => state.gotEnzymes.enzymes,
      totalRows: state => state.gotEnzymes.totalEnzymes,
    }),
  },
  async mounted() {
    await this.setup();
  },
  methods: {
    async setup() {
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        filters: {
          ...this.serverPaginationOptions.filters,
          ...this.initialFilter,
        },
      };

      await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
    },
    async onPageChange({ currentPage }) {
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        pagination: {
          ...this.serverPaginationOptions.pagination,
          page: currentPage,
        },
      };

      await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
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

      await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
    },
    async onColumnFilter({ columnFilters }) {
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        filters: {
          ...this.serverPaginationOptions.filters,
          ...columnFilters,
        },
      };

      await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
    },
    formatToTSV() {
      let tsvContent = `${this.columns.map(e => e.label).join('\t')}\n`;
      tsvContent += this.enzymes
        .map(e => {
          const arr = [];
          this.columns.forEach(field => {
            arr.push(e[field.field]);
          });
          return arr.join('\t');
        })
        .join('\n');
      return tsvContent;
    },
  },
};
</script>

<style lang="scss"></style>
