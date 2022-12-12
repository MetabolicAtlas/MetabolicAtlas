<template>
  <div id="enzymes-table">
    <ErrorPanel :message="errorMessage" :hide-error-panel="hideErrorMessage" />
    <div class="field columns">
      <div class="column"></div>
      <div class="column is-narrow">
        <ExportTSV
          :filename="`Enzymes for ${componentType} ${componentId}.tsv`"
          :format-function="formatToTSV"
          :disabled="showEnzymesLoader || null"
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
      :is-loading="showEnzymesLoader"
      :total-rows="totalRows"
      @page-change="onPageChange"
      @sort-change="onSortChange"
      @column-filter="onColumnFilter"
    >
      <template #emptystate>
        <div class="vgt-center-align vgt-text-disabled">No data found</div>
      </template>
      <template #loadingContent>
        <div>
          <loader /></div
      ></template>
      <template #table-row="props">
        <template v-if="linkableFields.includes(props.column.field)">
          <template v-if="props.column.field === 'ec_number'">
            <template v-for="(ec, index) in props.row[props.column.field].split(';')" :key="ec">
              <template v-if="index > 0">; </template>
              <router-link :to="`/gotenzymes/ec/${ec}`">
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
      <template #column-filter="props">
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
import 'vue-good-table-next/dist/vue-good-table-next.css';
import { VueGoodTable } from 'vue-good-table-next';
import Loader from '@/components/Loader.vue';
import ExportTSV from '@/components/shared/ExportTSV.vue';
import RangeFilter from '@/components/shared/RangeFilter.vue';
import ErrorPanel from '@/components/shared/ErrorPanel.vue';
import { default as messages } from '@/content/messages';

export default {
  name: 'EnzymesTable',
  components: {
    VueGoodTable,
    ExportTSV,
    RangeFilter,
    Loader,
    ErrorPanel,
  },
  props: {
    initialFilter: { type: Object, default: () => {} },
    componentId: { type: String },
    componentType: { type: String },
  },
  data() {
    return {
      errorMessage: '',
      linkableFields: ['compound', 'domain', 'ec_number', 'gene', 'organism', 'reaction_id'],
      showEnzymesLoader: true,
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
      this.showEnzymesLoader = true;
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        filters: {
          ...this.serverPaginationOptions.filters,
          ...this.initialFilter,
        },
      };

      try {
        await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
      } catch {
        this.errorMessage = messages.unknownError;
      }
      this.showEnzymesLoader = false;
    },
    async onPageChange({ currentPage }) {
      this.showEnzymesLoader = true;
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        pagination: {
          ...this.serverPaginationOptions.pagination,
          page: currentPage,
        },
      };

      try {
        await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
      } catch {
        this.errorMessage = messages.unknownError;
      }
      this.showEnzymesLoader = false;
    },
    async onSortChange([{ field, type }]) {
      this.showEnzymesLoader = true;
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        pagination: {
          ...this.serverPaginationOptions.pagination,
          column: field,
          isAscending: type === 'asc',
        },
      };

      try {
        await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
      } catch {
        this.errorMessage = messages.unknownError;
      }
      this.showEnzymesLoader = false;
    },
    async onColumnFilter({ columnFilters }) {
      this.showEnzymesLoader = true;
      this.serverPaginationOptions = {
        ...this.serverPaginationOptions,
        filters: {
          ...this.serverPaginationOptions.filters,
          ...columnFilters,
        },
      };

      try {
        await this.$store.dispatch('gotEnzymes/getEnzymes', this.serverPaginationOptions);
      } catch {
        this.errorMessage = messages.unknownError;
      }
      this.showEnzymesLoader = false;
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
    hideErrorMessage() {
      this.errorMessage = '';
    },
    async handleRangeFilterUpdate({ field, remove, ...payload }) {
      // payload can look like { min: 0, max: 1 }

      this.showEnzymesLoader = true;
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
      this.showEnzymesLoader = false;
    },
  },
};
</script>

<style lang="scss">
#enzymes-table .footer__navigation__page-info__current-entry {
  width: 50px;
}
</style>
