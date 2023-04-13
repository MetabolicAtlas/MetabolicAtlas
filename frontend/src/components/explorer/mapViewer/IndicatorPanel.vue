<template>
  <div v-if="groupsWithItems.length > 0" class="indicator-panel overlay p-2">
    <div v-for="group in groupsWithItems" :key="group.id" class="indicator-group">
      <span class="indicator-group-name">{{ group.name }}</span>
      <ul class="indicator-list p-0 m-0">
        <li v-for="item in group.items" :key="item.id" class="indicator">
          <span class="indicator-id">{{ item.id }}</span>
          <span v-if="item.status !== undefined" class="indicator-separator">:&nbsp;</span>
          <span v-if="item.status !== undefined" class="indicator-status">{{ item.status }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IndicatorPanel',
  props: {
    indicators: {
      type: Array,
      required: true,
    },
    groups: {
      type: Array,
      required: false,
    },
    showEmptyGroups: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    groupsWithItems() {
      const groupedItems = this.indicators.reduce((acc, indicator) => {
        const { groupId } = indicator;
        const items = acc[groupId] || [];
        items.push(indicator);
        acc[groupId] = items;
        return acc;
      }, {});

      const groups = this.groups
        ? this.groups.filter(group => group.id in groupedItems)
        : Object.keys(groupedItems).map(id => ({ id, name: id }));

      return groups.map(group => ({
        ...group,
        items: groupedItems[group.id],
      }));
    },
  },
};
</script>

<style lang="scss">
.indicator-panel {
  color: #fff;
}

.indicator-group-name {
  font-weight: bold;
}

.indicator {
  padding: 0 0.5rem;
}

.indicator > .indicator-id {
  text-transform: capitalize;
}

.indicator > .indicator-status {
  text-transform: capitalize;
}
</style>
