<template>
  <div class="extended-section">
    <section class="hero is-primary is-bold py-6">
      <router-link :to="{ name: 'explorer', params: { model: 'Human-GEM' } }">
        <div class="hero-body has-text-centered">
          <p class="is-size-1 title">METABOLIC ATLAS</p>
          <p class="is-size-5">
            open source genome-scale metabolic models for easy browsing and analysis
          </p>
        </div>
      </router-link>
    </section>

    <section id="home">
      <div class="py-6">
        <div class="container px-6">
          <div
            class="columns is-multiline is-mobile is-variable is-8-tablet is-centered is-vcentered"
          >
            <div
              v-for="item in tools"
              :key="item.title"
              class="column is-3-desktop is-6-mobile is-size-5"
            >
              <router-link :to="item.route">
                <div class="card hoverable">
                  <div class="card-image">
                    <figure class="image is-4by3">
                      <img :src="item.img" :alt="item.title" />
                    </figure>
                  </div>
                  <footer class="card-footer has-text-centered">
                    <a class="card-footer-item has-text-weight-bold is-size-4 is-size-5-mobile">
                      {{ item.cardLink }}
                    </a>
                  </footer>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="has-background-white-ter py-6">
        <div class="container px-6">
          <p class="title is-size-4 has-text-centered pt-4">
            <router-link :to="news.route" class="has-text-primary">
              <span class="icon is-large fa-lg">
                <i :class="`fa fa-${news.icon}`"></i>
              </span>
              {{ news.title }}
            </router-link>
          </p>
          <div class="columns is-variable is-8 pt-3">
            <div class="column is-6 is-size-5">
              <p class="mb-5">
                The main versions of
                <b>Metabolic Atlas</b>
                are associated with scientific articles as follows.
              </p>
              <div v-for="c in citations" :key="c.version" class="box">
                <p>
                  From version {{ c.version }}:
                  <a :href="c.link" target="_blank" rel="noopener noreferrer">
                    {{ c.shortAuthor }}, et al, {{ c.year }}.
                    <i>{{ c.title }}</i>
                    {{ c.publication }}, {{ c.id }}
                  </a>

                  {{ c.linkText }}
                </p>
              </div>
            </div>
            <div class="column is-6 is-size-5">
              <p v-html="news.text"></p>
              <table>
                <template v-for="el in newsItems">
                  <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
                  <tr v-if="el.date">
                    <td class="has-nowrap">{{ el.date }}</td>
                    <td class="pl-3">
                      <router-link
                        :to="{ name: 'about-news', hash: `#${el.date}` }"
                        v-html="el.title"
                      />
                    </td>
                  </tr>
                  <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
                  <tr v-else>
                    <span v-html="el.text"></span>
                  </tr>
                </template>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="py-6">
        <div class="container px-6 pt-6">
          <!-- eslint-disable -->
          <div v-for="features in [features1, features2]" class="columns is-variable is-8">
            <div v-for="item in features" :key="item.title" class="column is-6 is-size-5">
              <p class="title is-size-4">
                <router-link :to="item.route" class="has-text-primary">
                  <span class="icon is-large fa-lg">
                    <i :class="`fa fa-${item.icon}`"></i>
                  </span>
                  {{ item.title }}
                </router-link>
              </p>
              <div class="columns pb-6">
                <div class="column is-7 px-3">
                  <div v-html="item.text" />
                </div>
                <div class="column is-offset-1-mobile is-10-mobile">
                  <router-link :to="item.route">
                    <div class="card hoverable">
                      <div class="card-image">
                        <figure class="image is-4by3">
                          <img class="hoverable" :src="item.img" :alt="item.title" />
                        </figure>
                      </div>
                    </div>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="has-background-white-ter py-6">
        <div class="container px-6">
          <div class="columns is-variable is-8 is-vcentered py-6">
            <div class="column is-offset-1 is-5 is-size-5">
              <p class="title is-size-4 has-text-centered">
                <router-link :to="repository.route" class="has-text-primary">
                  <span class="icon is-large fa-lg">
                    <i :class="`fa fa-${repository.icon}`"></i>
                  </span>
                  {{ repository.title }}
                </router-link>
              </p>
              <div v-html="repository.text" class="content" />
            </div>
            <div class="column is-5 is-offset-1-mobile is-10-mobile">
              <router-link :to="repository.route">
                <div class="card hoverable">
                  <div class="card-image">
                    <figure class="image is-4by3">
                      <img :src="repository.img" :alt="repository.title" />
                    </figure>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="py-6">
        <div class="container px-6">
          <div class="columns is-variable is-8">
            <div v-for="item in comRes" :key="item.title" class="column is-6 is-size-5 py-6">
              <p class="title is-size-4">
                <router-link :to="item.route" class="has-text-primary">
                  <span class="icon is-large fa-lg">
                    <i :class="`fa fa-${item.icon}`"></i>
                  </span>
                  {{ item.title }}
                </router-link>
              </p>
              <div v-html="item.text" class="content" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { default as citations } from '@/content/citations';
import { default as messages } from '@/content/messages';
import { default as newsItems } from '@/content/news';
import { getImageUrl } from '@/helpers/utils';

export default {
  name: 'Home',
  data() {
    return {
      news: {
        title: "What's new",
        text: '',
        img: getImageUrl('gemBrowser'),
        route: { name: 'about-news', hash: '#News' },
        icon: 'newspaper-o',
      },
      citations: citations
        .filter(({ header }) => header.includes('Version'))
        .map(({ header, authors, title, journal, doi }) => {
          const version = header.match(/Version (\d+)/)[1];
          const shortAuthor = authors.match(/^(\w+ \w)\w?,/)[1];
          const [, publication, year, id] = journal.match(/^(.+) \((\d+)\):? (\w+)$/);
          const link = `https://doi.org/${doi}`;

          return {
            version,
            shortAuthor,
            year,
            title,
            publication,
            id,
            link,
          };
        }),
      tools: [
        {
          title: messages.gemBrowserName,
          text: '<p>The <b>GEM Browser</b> enables powerful query and exploration of model content in tabular format.</p><p>A wide range of attributes, including reaction equations, metabolite formulas, gene rules and subsystem contents, are presented as a detailed network of individual model components. They are highly interconnected and rationally associated to easily navigate and switch between them.</p><p>Visit the documentation to learn about the different functionalities provided by the GEM Browser.</p>',
          img: getImageUrl('gemBrowser'),
          cardLink: 'GEM Browser',
          route: { name: 'browser', params: { model: 'Human-GEM' } },
          icon: 'table',
        },
        {
          title: messages.mapViewerName,
          text: '<p>For easy visualization, <b>Metabolic Atlas</b> handles both 2D and 3D maps. For each of the integrated models, the website automatically generates 3D graphs at both compartment and subsystem level.</p><p>Both compartment and subsystem 2D maps of the Human-GEM have been created by Human-GEM contributors and are manually curated. On these maps, one can search for reactions, metabolites or genes. Moreover, RNA expression data from Human Protein Atlas can be overlaid.</p><p>By clicking on an element on the map, more information of that element will be shown on the left sidebar. From there, one can navigate back to the <b>GEM Browser</b> for detailed information.</p>',
          img: getImageUrl('mapViewer'),
          cardLink: 'Map Viewer',
          route: {
            name: 'viewer',
            params: { model: 'Human-GEM', type: 'compartment', map_id: 'golgi_apparatus' },
            query: { dim: '2d' },
          },
          icon: 'map-o',
        },
        {
          title: messages.interPartName,
          text: `<p>The <b>Interaction Partners</b> graph shows connectivity between metabolites and genes based on their associated reactions.</p><p>The graph is dynamically generated and is customizable. One can interact with a restricted part of the metabolic network, or further expand the interaction partners of any element already on the graph. Moreover, RNA expression data from the Human Protein Atlas can be overlaid onto the graph. </p><p>This feature is available only for metabolites and genes, and is accessible via the <b>${messages.gemBrowserName}</b>.</p>`,
          img: getImageUrl('interaction'),
          cardLink: 'Interaction Partners',
          route: { name: 'interaction', params: { model: 'Human-GEM' } },
          icon: 'connectdevelop',
        },
      ],
      features1: [
        {
          title: 'Search',
          text: 'The menu bar contains a shortcut to the <b>Global search</b> function, which enables users to easily search cellular components across all the integrated models available for further filtering.',
          img: getImageUrl('search'),
          route: { name: 'search', query: { term: '' } },
          icon: 'search',
        },
        {
          title: 'Analyze',
          text: 'Gene expression data from the Human Protein Atlas can be viewed in the 2D and 3D maps and Interaction Partners. User data can also be overlaid onto the maps, with the option of comparing datasets, for example against normal tissue. Additional types of omics integrations are under development.',
          img: getImageUrl('analyze'),
          route: {
            name: 'viewer',
            params: { model: 'Human-GEM', type: 'compartment', map_id: 'endoplasmic_reticulum' },
            query: { dim: '2d', panel: '1', coords: '-7222.7,-4501.6,0.97,0,0,0' },
          },
          icon: 'tasks',
        },
      ],
      features2: [
        {
          title: 'Export',
          text: 'Most of the data provided on the website is convenient to export, for example via <b>Export to TSV</b> buttons. For the extracting data in JSON format, we have documented our API.',
          img: getImageUrl('export'),
          route: { name: 'search', query: { term: 'glyoxalate' } },
          icon: 'download',
        },
        {
          title: 'Compare',
          text: 'The integrated models can be compared on-the-fly via the cross references to other models or databases they share. Moreover, a 3-way comparison can be performed as well.',
          img: getImageUrl('comparison'),
          route: { name: 'comparemodels' },
          icon: 'download',
        },
      ],
      repository: {
        title: 'GEM Repository',
        text: '<p>Over 350 GEMs can be downloaded from the <b>GEM Repository</b> or directly from the <b>Metabolic Atlas FTP server</b>. The tabular view enables customized selection.</p><p>Clicking on each of the models brings up more information about the model, including a text description and, if available, references. For support, the original authors should be contacted.</p>',
        img: getImageUrl('gems'),
        route: { name: 'gems' },
        icon: 'files-o',
      },
      comRes: [
        {
          title: 'Resources',
          text: '<p>Working with metabolic models requires a set of tools and external databases, which we have collected together for one-click access.</p><p>Additionally, Metabolic Atlas is open to further integrations.</p>',
          route: { name: 'about-resources', hash: '#Resources' },
          icon: 'gears',
        },
        {
          title: 'Community',
          text: '<p>We are grateful for the efforts of scientists all over the world in creating the knowledge required to assemble high quality genome scale metabolic models. We are passionate about continuing on this journey of open curation of models.</p><p>We invite you to explore the world of GEMs through Metabolic Atlas, and hope it will enhance your interest in this field. We wish to continuously improve Metabolic Atlas for the community. Email us with any feedback, suggestions, or requests at <a href="mailto:contact@metabolicatlas.org">contact [at] metabolicatlas [dot] org</a>.</p>',
          route: { name: 'about-platform', hash: '#introduction' },
          icon: 'users',
        },
      ],
      newsItems: Object.values(newsItems).reverse().flat(1).slice(0, 12),
    };
  },
};
</script>
<style lang="scss">
#home {
  .card {
    max-width: 500px;
  }
  .stripe:nth-child(2n) {
    background: whitesmoke;
    .columns {
      flex-direction: row-reverse;
    }
  }
}
</style>
