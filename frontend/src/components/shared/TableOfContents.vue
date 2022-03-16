<template>
  <div id="table-of-contents" class="column is-narrow">
    <aside class="menu">
      <p class="menu-label">Table of Contents</p>
      <ul class="menu-list">
        <li v-for="l in links" :key="l.name">
          <router-link
            :to="l.routeName ? { name: l.routeName } : l.link"
            active-class="has-background-white-ter"
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
                active-class="has-background-white-ter"
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
  name: 'TableOfContents',
  props: {
    links: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
@media screen and (min-width: $tablet) {
  #table-of-contents {
    position: sticky;
    top: 0;
    align-self: flex-start;
    max-height: 100vh;
    overflow: auto;
  }
}

.menu-list {
  ul {
    margin-top: 0;
  }
}
</style>
