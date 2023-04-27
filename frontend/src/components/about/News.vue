<template>
  <about-layout id="News" title="News" full-content-width>
    <template v-slot:contents>
      <div class="timeline">
        <header class="timeline-header">
          <span class="tag is-large has-text-primary has-text-weight-bold">today</span>
        </header>
        <template v-for="year in Object.keys(news).reverse()">
          <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
          <template v-for="newsItem in news[year]">
            <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
            <div :id="newsItem.date.replace(/ /g, '-')" class="timeline-item is-danger">
              <div class="timeline-marker is-primary" :class="{ 'is-icon': newsItem.icon }">
                <i v-if="newsItem.icon" :class="`${newsItem.icon}`"></i>
              </div>
              <div class="timeline-content">
                <p class="heading">{{ newsItem.date }}</p>
                <p v-html="newsItem.text"></p>
                <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
                <div v-for="link in newsItem.links">
                  <div class="is-inline" v-html="link.intro"></div>
                  <router-link :to="link.link">{{ link.text }}</router-link>
                </div>
              </div>
            </div>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
          <header class="timeline-header">
            <span class="tag is-large has-text-primary has-text-weight-bold">{{ year }}</span>
          </header>
        </template>
      </div>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout.vue';
import { default as news } from '@/content/news';

export default {
  name: 'News',
  components: {
    AboutLayout,
  },
  data() {
    return {
      news,
    };
  },
};
</script>
