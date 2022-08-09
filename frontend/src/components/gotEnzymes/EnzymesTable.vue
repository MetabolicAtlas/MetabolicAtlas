<template>
  <div id="enzymes-table">
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
    >
      <template slot="table-row" slot-scope="props">
        <template v-if="linkableFields.includes(props.column.field)">
          <template v-if="props.column.field === 'ec_number'">
            <template v-for="(ec, index) in props.row[props.column.field].split(';')">
              <template v-if="index > 0">; </template>
              <router-link :key="ec" :to="`/gotenzymes/ec/${ec}`">
                {{ ec }}
              </router-link>
            </template>
          </template>
          <router-link
            v-else
            :to="`/gotenzymes/${props.column.field.split('_')[0]}/${props.row[props.column.field]}`"
          >
            {{ props.row[props.column.field] }}
          </router-link>
        </template>
        <template v-else>
          {{ props.formattedRow[props.column.field] }}
        </template>
      </template>
      <template slot="column-filter" slot-scope="props">
        <range-filter
          v-if="props.column.filterOptions.customFilter"
          :field="props.column.field"
          :handle-update="handleRangeFilterUpdate"
        />
      </template>
    </vue-good-table>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { VueGoodTable } from 'vue-good-table';
import ExportTSV from '@/components/shared/ExportTSV';
import RangeFilter from '@/components/shared/RangeFilter';

export default {
  name: 'EnzymesTable',
  components: {
    VueGoodTable,
    ExportTSV,
    RangeFilter,
  },
  props: {
    initialFilter: { type: Object, default: () => {} },
    componentId: { type: String },
    componentType: { type: String },
  },
  data() {
    return {
      linkableFields: ['compound', 'domain', 'ec_number', 'gene', 'organism', 'reaction_id'],
      columns: [
        {
          label: 'Gene',
          field: 'gene',
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
          label: 'kcat[1/s]',
          field: 'kcat_values',
          sortable: true,
          filterOptions: { customFilter: true },
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
          column: 'gene',
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
  async beforeMount() {
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
    async handleRangeFilterUpdate({ field, remove, ...payload }) {
      // payload can look like { min: 0, max: 1 }

      const filters = { ...this.serverPaginationOptions.filters };
      if (remove) {
        delete filters[field];
      } else {
        filters[field] = payload;
      }

      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        filters,
      };

      await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
    },
  },
};
</script>

<style lang="scss">
#enzymes-table .footer__navigation__page-info__current-entry {
  width: 50px;
}
</style>
