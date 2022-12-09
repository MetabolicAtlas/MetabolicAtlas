<template>
  <Head>
    <title>Metabolic Atlas</title>
    <link
      v-for="size in appleIconSizes"
      :key="size"
      rel="apple-touch-icon"
      :sizes="size"
      :href="`${baseUrl}apple-touch-icon-${size}.png`"
    />
    <link
      v-for="size in faviconSizes"
      :key="size"
      rel="icon"
      :sizes="size"
      :href="`${baseUrl}favicon-${size}.png`"
    />
    <meta name="application-name" content="Metabolic Atlas" />
    <meta name="msapplication-TileColor" content="#FFFFFF" />
    <meta name="msapplication-TileImage" content="mstile-144x144.png" />
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta v-if="devServer()" name="robots" content="noindex, noarchive, nosnippet, noimageindex" />
    <component :is="'script'" v-if="hotjarTag" type="text/javascript" v-html="hotjarTag" />
  </Head>
</template>

<script>
import { Head } from '@vueuse/head';

export default {
  name: 'AppHead',
  components: {
    Head,
  },
  data() {
    return {
      baseUrl: import.meta.env.BASE_URL,
      hotjarTag: import.meta.env.VITE_VUE_APP_HOTJAR,
      appleIconSizes: [57, 72, 114, 144, 152].map(s => `${s}x${s}`),
      faviconSizes: [16, 32].map(s => `${s}x${s}`),
    };
  },
  methods: {
    devServer() {
      return window.location.host.search(/dev/i) !== -1;
    },
  },
};
</script>
