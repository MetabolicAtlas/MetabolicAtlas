<template>
  <!-- eslint-disable max-len -->
  <section class="section extended-section">
    <div class="container is-fullhd">
      <h3 class="title is-3">Metabolic Atlas</h3>
      <div class="columns is-variable is-8">
        <div class="column is-half has-text-justified">
          <div class="box is-hidden-tablet">
            <p class="subtitle has-text-weight-bold is-size-4 has-text-primary has-text-centered">Citing Metabolic Atlas</p>
            <p><a href="https://doi.org/10.1073/pnas.2102344118" target="_blank">
              Wang, H., et al, 2021. <i>Genome-scale metabolic network reconstruction of model animals as a platform for translational research</i>. PNAS 118, e2102344118
            </a></p>
            <p><a href="https://doi.org/10.1126/scisignal.aaz1482" target="_blank">
              Robinson, J., et al, 2020. <i>An atlas of human metabolism</i>. Sci. Signal. 13, eaaz1482
            </a></p>
          </div>
          The Metabolic Atlas project is headed by <a href="https://www.sysbio.se/labs/nielsen" target="_new">Professor Jens Nielsen</a>, <a href="https://www.sysbio.se">Division of Systems and Synthetic Biology</a>, Department of Biology and Biological Engineering at the <a href="https://www.chalmers.se" target="_new">Chalmers University of Technology</a>. The platform is developed by members of <a href="https://www.chalmers.se/en/researchinfrastructure/csb/Pages/default.aspx">Computational Systems Biology Infrastructure</a> at Chalmers University of Technology and <a href="https://nbis.se" target="blank">National Bioinformatics Infrastructure Sweden</a>.<br><br>

          Metabolic Atlas is a freely available resource containing detailed information about a set of open-source  Genome-Scale Metabolic Models (GEMs), specifically <router-link :to="{ name: 'explorer', params: {model: 'Human-GEM'} }">Human-GEM</router-link> and <router-link :to="{ name: 'explorer', params: {model: 'Yeast-GEM'} }">Yeast-GEM</router-link>. These are two reference models containing all possible reactions that could occur in human, and yeast, respectively.<br><br>

          The research focus of the content of this website is <b>metabolism in a systems biology context</b>. The goal is to collect many curated GEMs, and to bring these models closer to <a href="https://en.wikipedia.org/wiki/FAIR_data" target="_new">FAIR principles</a>. To this end, the website also provides visualisations and comparisons of the GEMs, and links to <a href="resources">resources</a>: algorithms, other databases, and more general software applications (like RAVEN and PIANO).<br><br>

          Metabolic Atlas is intended to be used for applications in metabolomics, clinical chemistry, biomarker discovery and general education. In short, the vision is to create a one-stop-shop for everything metabolism related, starting with <a href="https://www.sysbio.se/labs/nielsen/#publications">the publications of the Nielsen lab</a>.<br><br>

          The development of Metabolic Atlas is led by <a href="https://nbis.se/about/staff/mihail-anton" target="_blank">Mihail Anton</a>, with team members Pierre-Etienne Cholley and Shan Huang. Past and more detailed contributions are <a href="https://github.com/SysBioChalmers/MetabolicAtlas/graphs/contributors" target="_blank">shown on GitHub</a>. For versions and release notes of the software behind Metabolic Atlas, <a href="https://github.com/SysBioChalmers/MetabolicAtlas/releases" target="_blank">check the GitHub page</a> or <a href="https://zenodo.org/badge/latestdoi/53664497" target="_blank">Zenodo</a>. The integrated models are also available on GitHub, check our <router-link :to="{ name: 'gems' }">GEM Repository</router-link> for links to those.<br><br>

          <p>Metabolic Atlas would not be possible without the following excellent Elixir resources: <a href="https://proteinatlas.org" target="_blank">The Human Protein Atlas</a>, <a href="https://www.ensembl.org/" target="_blank">Ensembl</a>, <a href="https://www.uniprot.org" target="_blank">UniProt</a>, <a href="https://europepmc.org" target="_blank">Europe PMC</a>, <a href="https://identifiers.org" target="_blank">Identifiers.org</a>, <a href="https://www.ebi.ac.uk/chebi" target="_blank">ChEBi</a> and other essential sources of information: <a href="http://www.genome.jp/kegg/" target="_blank">KEGG: Kyoto Encyclopedia of Genes and Genomes</a>,  <a href="http://www.hmdb.ca/" target="_blank">The Human Metabolome Database</a>, <a href="https://www.metanetx.org" target="_blank">MetaNetX</a>, <a href="http://bigg.ucsd.edu" target="_blank">BiGG</a>, <a href="https://www.ncbi.nlm.nih.gov" target="_blank">NCBI</a>.
          </p>
        </div>
        <div class="column is-half has-text-justified content">
          <div class="box is-hidden-mobile">
            <p class="subtitle has-text-weight-bold is-size-4 has-text-primary has-text-centered">Citing Metabolic Atlas</p>
            <p><a href="https://doi.org/10.1073/pnas.2102344118" target="_blank">
              Wang, H., et al, 2021. <i>Genome-scale metabolic network reconstruction of model animals as a platform for translational research</i>. PNAS 118, e2102344118
            </a></p>
            <p><a href="https://doi.org/10.1126/scisignal.aaz1482" target="_blank">
              Robinson, J., et al, 2020. <i>An atlas of human metabolism</i>. Sci. Signal. 13, eaaz1482
            </a></p>
          </div>
          <img width="100%" alt="The SysBio group 2019" src="../assets/group_19.jpg">
          <center><a href="https://sysbio.se" target="_blank">The SysBio group 2019</a></center>
          <br><br>
          <h4 class="title is-4">Contact</h4>
          <p>For any questions, comments or suggestions please email us at <a href="mailto:">contact [at] metabolicatlas [dot] org</a>.</p>
        </div>
      </div>
      <br>
      <h3 class="title is-3">Scientific Advisors</h3>
      <div class="columns is-multiline">
        <div v-for="advisor in advisors" :key="advisor.name" class="column is-half-tablet is-one-third-desktop">
          <div class="card card-fullheight">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-64x64">
                    <img :alt="advisor.name" :src="advisor.img" />
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-4">{{ advisor.name }}</p>
                  <p class="subtitle is-6 pt-2">
                    <a :href="advisor.orcid" target="_blank">
                      <img class="image is-16x16 is-inline" alt="orcid" src="../assets/orcid.gif" />
                    </a>
                    <a :href="advisor.linkedin" target="_blank">
                      <span class="icon pl-3"><i class="fa fa-linkedin-square fa-lg"></i></span>
                    </a>
                  </p>
                </div>
              </div>
              <div class="content" v-html="advisor.content">
              </div>
            </div>
          </div>
        </div>
      </div>
      <br>
      <h3 id="News" class="title is-3">News</h3>
      <div class="timeline is-centered">
        <header class="timeline-header">
          <span class="tag is-large has-text-primary has-text-weight-bold">today</span>
        </header>
        <template v-for="year in Object.keys(news).reverse()">
          <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
          <template v-for="newsItem in news[year]">
            <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
            <div :id="newsItem.date.replace(/ /g,'-')" class="timeline-item is-danger">
              <div class="timeline-marker is-primary" :class="{ 'is-icon' : newsItem.icon }">
                <i v-if="newsItem.icon" :class="`fa fa-${newsItem.icon}`"></i>
              </div>
              <div class="timeline-content">
                <p class="heading">{{ newsItem.date }}</p>
                <p v-html="newsItem.text"></p>
              </div>
            </div>
          </template>
          <!-- eslint-disable-next-line vue/valid-v-for vue/require-v-for-key -->
          <header class="timeline-header">
            <span class="tag is-large has-text-primary has-text-weight-bold">{{ year }}</span>
          </header>
        </template>
      </div>
      <br><br>
      <div class="columns is-variable is-8">
        <div class="column has-text-justified content">
          <h3 id="privacy" class="title is-3">Privacy Notice</h3>
          <p>
            Metabolic Atlas gathers information about users solely to improve the usability and usefulness of the website. There are two types of cookies that are set by Metabolic Atlas: functionality cookies and tracking cookies.<br>
            Functionality cookies are used to personalize the appearence of the Metabolic Atlas.<br>
            Tracking cookies are used by our private analytics to track the users on our website. We use these to observe the anonymized behaviour on our website in order to improve it. We store partial IP, operating system, browser and browser language. This information is stored permanently for statistics and is not shared with any third party.<br>
            Additionally, we use the services of <a href="https://www.hotjar.com/" target="_blank">Hotjar</a>. This is an additional independent tracking service, which can produce a screen capture of the interactions on our website, including mouse movement. We use it for the purpose of figuring out how to improve our website, for example when the website interface is confusing. The data is stored for at most 3 months. Hotjar adheres to GDPR, <a href="https://www.hotjar.com/legal/compliance/gdpr-commitment" target="_blank">see more on their website</a>.<br>
            To opt out of any of these cookies, please set your browser to use the "DoNotTrack" header; doing this will disable the tracking. It is a good practice to enable this setting, here is how to do this for <a href="https://support.google.com/chrome/answer/2790761" target="_blank">Chrome</a> and <a href="https://support.mozilla.org/en-US/kb/how-do-i-turn-do-not-track-feature" target="_blank">Firefox</a> (in Safari this is enabled by default). Alternatively, see <a href="https://www.hotjar.com/legal/compliance/opt-out" target="_blank">Hotjar's instructions on their website</a>.<br>
            If you have any questions, please email us at <a href="mailto:">contact [at] metabolicatlas [dot] org</a>.
          </p>

          <h3 class="title is-3">Terms of Use</h3>
          <p>
            We do not guarantee the accuracy of any provided data, generated database, software or online service nor the suitability of databases, software and online services for any purpose.
            The content presented on Metabolic Atlas is contributed by members of the community who remain owners of said content.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { default as news } from '@/content/news';

export default {
  name: 'About',
  data() {
    return {
      /* eslint-disable global-require */
      advisors: [
        {
          name: 'Prof. Jens Nielsen',
          img: require('../assets/pic-jens.jpg'),
          orcid: 'https://orcid.org/0000-0002-9955-6003',
          linkedin: 'https://www.linkedin.com/in/jens-nielsen-57a207181/',
          content: '<a href="https://bii.dk/team/jens-nielsen" target="_blank">CEO at BioInnovation Institute</a> and <a href="https://www.sysbio.se/labs/nielsen/" target="_blank">Prof. of Systems and Synthetic Biology at Chalmers University of Technology</a>',
        }, {
          name: 'Dr. Jonathan Robinson',
          img: require('../assets/pic-jon.jpg'),
          orcid: 'https://orcid.org/0000-0001-8567-5960',
          linkedin: 'https://www.linkedin.com/in/jonathanrob/',
          content: '<a href="https://jonathanrob.github.io/" target="_blank">Scientific Data Developer at BioInnovation Institute</a>',
        }, {
          name: 'Dr. Hao Wang',
          img: require('../assets/pic-hao.jpg'),
          orcid: 'https://orcid.org/0000-0001-7475-0136',
          linkedin: 'https://www.linkedin.com/in/hao-wang-9a66ba30/',
          content: 'Researcher at Chalmers University of Technology',
        }, {
          name: 'Dr. Rui Benfeitas',
          img: require('../assets/pic-rui.jpg'),
          orcid: 'https://orcid.org/0000-0001-7972-0083',
          linkedin: 'https://www.linkedin.com/in/ruibenfeitas/',
          content: '<a href="https://www.benfeitas.net" target="_blank">Senior Bioinformatician at NBIS, SciLifeLab</a>',
        },
      ],
      news,
    };
  },
};
</script>

<style lang="scss"></style>
