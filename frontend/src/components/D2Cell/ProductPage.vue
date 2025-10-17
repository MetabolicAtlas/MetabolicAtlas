<template>
    <product-details-page
      component-type="product"
      :component-id="productName"
      :enzymes-table-initial-filter="enzymesTableInitialFilter"
    />
  </template>

  <script>
  import ProductDetailsPage from '@/components/D2Cell/ProductDetailsPage.vue';

  export default {
    name: 'ProductPage',
    components: {
      ProductDetailsPage
    },
    data() {
      return {
        productName: this.$route.params.name,
      };
    },
    computed: {
      enzymesTableInitialFilter() {
        return { product_name: this.productName };
      },
    },
  };
  </script>

  <style lang="scss">
  </style>