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
    <template v-if="hotjarTag">
      {{ hotjarTag }}
    </template>
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
      hotjarTag: import.meta.env.VITE_VUE_APP_HOTJAR, // TODO: this needs .env* files
      appleIconSizes: [57, 72, 114, 144, 152].map(s => `${s}x${s}`),
      faviconSizes: [16, 32].map(s => `${s}x${s}`),
    };
  },
};
</script>
