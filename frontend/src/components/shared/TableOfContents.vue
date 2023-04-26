<template>
  <div id="table-of-contents" class="column is-narrow">
    <aside class="menu">
      <p class="menu-label">Table of Contents</p>
      <ul class="menu-list">
        <li v-for="l in links" :key="l.name">
          <router-link
            :to="l.link"
            :class="{
              'has-background-white-ter': hasActiveSubsection(l),
              'has-background-link-light': isActiveLink(l.link),
            }"
            @click="isMobileMenu = false"
          >
            <span class="icon pr-5 has-text-info">
              <i class="far" :class="l.icon || 'fa-caret-right'"></i>
            </span>
            <b>{{ l.name }}</b>
          </router-link>
          <ul class="menu-list">
            <li v-for="sub in l.subsections" :key="sub.name">
              <router-link
                :to="sub.routeName ? { name: sub.routeName } : sub.link"
                :class="{ 'has-background-link-light': isActiveLink(sub.link) }"
                @click="isMobileMenu = false"
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
  methods: {
    hasActiveSubsection({ subsections }) {
      const links = (subsections ?? []).map(s => s.link);
      return links.includes(this.$route.hash) || links.some(l => l.includes(this.$route.path));
    },
    isActiveLink(link) {
      return link === this.$route.path || this.$route.hash.replace('#', '') === link.split('#')[1];
    },
  },
};
</script>

<style lang="scss" scoped>
#table-of-contents {
  @media screen and (min-width: $tablet) {
    position: sticky;
    top: 0;
    align-self: flex-start;
    max-height: 100vh;
    overflow: auto;
  }

  .menu-list {
    ul {
      margin-top: 0;
    }
  }
}
</style>
