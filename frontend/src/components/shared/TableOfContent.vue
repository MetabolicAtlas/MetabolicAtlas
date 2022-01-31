<template>
  <div class="column is-narrow">
    <aside class="menu">
      <p class="menu-label">Table of Contents</p>
      <ul class="menu-list">
        <li v-for="l in links" :key="l.name">
          <a :href="l.link">
            <span class="icon pr-5 has-text-info"><i class="fa" :class="l.icon"></i></span>
            <b>{{ l.name }}</b>
          </a>
          <ul class="menu-list">
            <li v-for="sub in l.subsections" :key="sub.name">
              <a :href="sub.link">{{ sub.name }}</a>
            </li>
          </ul>
        </li>
        <!--
              <li>
                <a href="#GEM-Browser">
                  <span class="icon pr-5 has-text-info"><i class="fa fa-table"></i></span>
                  <b>GEM Browser</b>
                </a>
                <ul class="menu-list">
                  <li><a href="#reaction-page">Reaction page</a></li>
                  <li><a href="#GEM-Browser-Metabolite">Metabolite page</a></li>
                  <li><a href="#gene-page">Gene page</a></li>
                  <li><a href="#subsystem-page">Subsystem page</a></li>
                  <li><a href="#compartment-page">Compartment page</a></li>
                </ul>
                <a href="#Map-Viewer">
                  <span class="icon pr-5 has-text-info"><i class="fa fa-map-o"></i></span>
                  <b>Map Viewer</b>
                </a>
                <ul class="menu-list">
                  <li><a href="#2D-Viewer">2D Viewer</a></li>
                  <li><a href="#3D-Viewer">3D Viewer</a></li>
                  <li><a href="#Data-overlay">Data Overlay</a></li>
                </ul>
                <a href="#Interaction-Partners">
                  <span class="icon pr-5 has-text-info"><i class="fa fa-connectdevelop"></i></span>
                  <b>Interaction Partners</b>
                </a>
                <ul class="menu-list">
                  <li><a href="#Interaction-Partners-Export">Export graph</a></li>
                  <li><a href="#Interaction-Partners-Highlights">Highlights</a></li>
                  <li><a href="#Interaction-Partners-Reactions">Reactions table</a></li>
                </ul>
                <a href="#Search">
                  <span class="icon pr-5 has-text-info"><i class="fa fa-search"></i></span>
                  <b>Search</b>
                </a>
                <ul class="menu-list">
                  <li><a href="#Quick-search">Quick search</a></li>
                  <li><a href="#Global-search">Global search</a></li>
                </ul>
                <a href="#GEM">
                  <span class="icon pr-5 has-text-info"><i class="fa fa-files-o"></i></span>
                  <b>GEM</b>
                </a>
                <ul class="menu-list">
                  <li><a href="#Integrated-models">Integrated models</a></li>
                  <li><a href="#Repository">Repository</a></li>
                  <li><a href="#Comparison">Comparison</a></li>
                  <li><a href="#FTP-access">FTP access</a></li>
                </ul>
              </li>
              <li>
                <a href="#Resources">
                  <span class="icon pr-5 has-text-info"><i class="fa fa-cogs"></i></span>
                  <b>Resources</b>
                </a>
                <ul class="menu-list">
                  <li><a href="#API">API</a></li>
                </ul>
              </li>
              -->
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
