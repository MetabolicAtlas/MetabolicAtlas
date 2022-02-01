<template>
  <div class="column is-narrow">
    <aside class="menu">
      <p class="menu-label">Table of Contents</p>
      <ul class="menu-list">
        <li v-for="l in links" :key="l.name">
          <router-link
            :to="l.routeName ? { name: l.routeName } : l.link"
            @click.native="isMobileMenu = false"
          >
            <span v-if="l.icon" class="icon pr-5 has-text-info">
              <i class="fa" :class="l.icon"></i>
            </span>
            <b>{{ l.name }}</b>
          </router-link>
          <ul class="menu-list">
            <li v-for="sub in l.subsections" :key="sub.name">
              <router-link
                :to="sub.routeName ? { name: sub.routeName } : sub.link"
                @click.native="isMobileMenu = false"
              >
                {{ sub.name }}
              </router-link>
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
