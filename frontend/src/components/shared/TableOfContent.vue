<template>
  <div class="column is-narrow">
    <aside class="menu">
      <p class="menu-label">Table of Contents</p>
      <ul class="menu-list">
        <li v-for="l in links" :key="l.name">
          <a :href="l.link">
            <span v-if="l.icon" class="icon pr-5 has-text-info"><i class="fa" :class="l.icon"></i></span>
            <b>{{ l.name }}</b>
          </a>
          <ul class="menu-list">
            <li v-for="sub in l.subsections" :key="sub.name">
              <a :href="sub.link">{{ sub.name }}</a>
            </li>
          </ul>
        </li>
      </ul>
    </aside>
  </div>
</template>
<script>
export default {
  name: 'TableOfContent',
  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-list {
  ul {
    margin-top: 0;
  }
}
</style>
