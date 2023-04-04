<template>
  <about-layout id="Platform" title="">
    <template v-slot:contents>
      <h3 id="introduction" class="title is-3 mt-0">Introduction</h3>

      <p>
        Metabolic Atlas is a web platform integrating open-source genome scale metabolic models
        (GEMs) for easy browsing and analysis. The goal is to collect curated GEMs, and to bring
        these models closer to
        <a href="https://en.wikipedia.org/wiki/FAIR_data" target="_blank" rel="noopener noreferrer"
          >FAIR principles</a
        >. The website provides visualisations and comparisons of the GEMs, and links to
        <router-link :to="{ name: 'about-resources', hash: '#Resources' }">resources</router-link>,
        algorithms, other databases, and more general software applications. Metabolic Atlas is
        intended to be used for applications in metabolomics, clinical chemistry, biomarker
        discovery and general education. In short, the vision is to create a one-stop-shop for
        everything metabolism related.
      </p>

      <p>
        Metabolic Atlas is freely available and the detailed information about the GEMs is
        open-source. Specifically, the two reference models
        <router-link :to="{ name: 'explorer', params: { model: 'Human-GEM' } }">
          Human-GEM
        </router-link>
        and
        <router-link :to="{ name: 'explorer', params: { model: 'Yeast-GEM' } }">
          Yeast-GEM
        </router-link>
        contain all possible reactions that could occur in human, and yeast, respectively.
      </p>

      <p>
        The Metabolic Atlas project is headed by
        <a href="https://www.sysbio.se/labs/nielsen" target="_blank" rel="noopener noreferrer"
          >Professor Jens Nielsen</a
        >,
        <a href="https://www.sysbio.se" target="_blank" rel="noopener noreferrer"
          >Division of Systems and Synthetic Biology</a
        >, Department of Biology and Biological Engineering at the
        <a href="https://www.chalmers.se" target="_blank" rel="noopener noreferrer"
          >Chalmers University of Technology</a
        >. The platform is developed by members of
        <a href="https://nbis.se" target="_blank" rel="noopener noreferrer"
          >National Bioinformatics Infrastructure Sweden</a
        >
        and
        <a
          href="https://www.chalmers.se/en/researchinfrastructure/csb/Pages/default.aspx"
          target="_blank"
          rel="noopener noreferrer"
        >
          Computational Systems Biology Infrastructure
        </a>
        at Chalmers University of Technology. The research focus of the content of this website is
        <b>metabolism in a systems biology context</b>, starting with
        <a
          href="https://www.sysbio.se/labs/nielsen/#publications"
          target="_blank"
          rel="noopener noreferrer"
        >
          the publications of the Nielsen lab</a
        >.
      </p>

      <h3 id="citation" class="title is-3 mt-6">Citation</h3>
      <p>
        If you use Metabolic Atlas in your work, please cite our latest publication. In addition, if
        you use any of the GEMs, please also cite the corresponding publication.
      </p>

      <template v-for="citation in updatedCitations" :key="citation.id">
        <citation :entry="citation" />
      </template>

      <h4 class="title is-4 mt-6">Research-driven features</h4>
      <p>
        In 2022, reaction presence data was added to <i>Metabolic Atlas</i> and can be used as data
        overlay in the <i>Map Viewer</i>. The work is based on this publication:
      </p>

      <p>
        Gustafsson J, Robinson JL, Roshanzamir F, Jörnsten R, Kerkhoven EJ, Nielsen J.
        <b>
          Generation and analysis of context-specific genome-scale metabolic models derived from
          single-cell RNA-Seq data.
        </b>
        <i>bioRxiv (2022)</i>
        DOI:
        <a
          href="https://doi.org/10.1101/2022.04.25.489379"
          target="_blank"
          rel="noopener noreferrer"
          >10.1101/2022.04.25.489379</a
        >
      </p>

      <p>
        The custom maps feature was inspired by the work of Rasool Saghaleyni. If you have used the
        <i>Protein secretion pathway</i> in your work, please cite this work:
      </p>

      <p>
        Saghaleyni, R.
        <b>
          Systems Biology of Protein Secretion in Human Cells: Multi-omics Analysis and Modeling of
          the Protein Secretion Process in Human Cells and its Application.
        </b>
        <a
          href="https://research.chalmers.se/en/publication/?id=524959"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i>Doctoral Thesis at Chalmers University of Technology (2021)</i>
        </a>
      </p>

      <h3 id="advisory-board" class="title is-3 mt-6">Advisory board</h3>

      <div class="columns is-multiline has-text-left">
        <div
          v-for="member in members"
          :key="member.name"
          class="column is-full is-half-desktop is-one-third-widescreen"
        >
          <div class="card card-fullheight">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <figure class="image is-96x96 m-0">
                    <img :alt="member.name" :src="member.img" />
                  </figure>
                </div>
                <div class="media-content">
                  <p class="title is-5">{{ member.name }}</p>
                  <p class="subtitle is-6 pt-2">
                    <a
                      v-if="member.orcid"
                      :href="member.orcid"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="image is-16x16 is-inline mr-2"
                        alt="orcid"
                        src="/assets/logos/orcid.gif"
                      />
                    </a>
                    <a
                      v-if="member.linkedin"
                      :href="member.linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="icon mr-2"><i class="fa fa-linkedin-square fa-lg"></i></span>
                    </a>
                    <a
                      v-if="member.github"
                      :href="member.github"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="icon has-text-black-bis">
                        <i class="fa fa-lg fa-github"></i>
                      </span>
                    </a>
                  </p>
                </div>
              </div>
              <div class="content" v-html="member.content"></div>
            </div>
          </div>
        </div>
      </div>

      <h3 id="development" class="title is-3 mt-6">Development team</h3>

      <div v-for="group in team" :key="group.name">
        <h3 class="title is-4">{{ group.name }}</h3>
        <div class="pb-6 columns is-multiline has-text-left">
          <div
            v-for="member in group.members"
            :key="member.name"
            class="column is-full is-half-desktop is-one-third-widescreen"
          >
            <div class="card card-fullheight">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <figure class="image is-96x96 m-0">
                      <img :alt="member.name" :src="member.img" />
                    </figure>
                  </div>
                  <div class="media-content">
                    <p class="title is-5">{{ member.name }}</p>
                    <p class="subtitle is-6 pt-2">
                      <a
                        v-if="member.orcid"
                        :href="member.orcid"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          class="image is-16x16 is-inline mr-2"
                          alt="orcid"
                          src="/assets/logos/orcid.gif"
                        />
                      </a>
                      <a
                        v-if="member.linkedin"
                        :href="member.linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span class="icon mr-2"><i class="fa fa-linkedin-square fa-lg"></i></span>
                      </a>
                      <a
                        v-if="member.github"
                        :href="member.github"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span class="icon has-text-black-bis">
                          <i class="fa fa-lg fa-github"></i>
                        </span>
                      </a>
                    </p>
                  </div>
                </div>
                <div class="content" v-html="member.content"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p>
        For more detailed information about the contributions to Metabolic Atlas, please see our
        <a
          href="https://github.com/MetabolicAtlas/MetabolicAtlas/graphs/contributors"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub page</a
        >.
      </p>

      <h3 id="contact-us" class="title is-3 mt-6">Contact us</h3>
      <p>
        For any questions, comments or suggestions, or if you find any bugs or vulnerabilities
        regarding Metabolic Atlas, please email us at
        <a href="mailto:contact@metabolicatlas.org" target="_blank" rel="noopener noreferrer"
        >contact [at] metabolicatlas [dot] org</a>, or use the contact form below.
      </p>

      <iframe
        title="Contact Form"
        src="https://docs.google.com/forms/d/e/1FAIpQLScnVFKd5OK9zIM9jR4qnnOr0QsZKZnhFql6saZuJaQYYsMs5g/viewform?embedded=true"
        width="640" height="750" frameborder="0" marginheight="0" marginwidth="0">Loading…
      </iframe>
      <p>
        For any management related issues, such as collaborations or funding, please email us at
        <a href="mailto:management@metabolicatlas.org" target="_blank" rel="noopener noreferrer"
          >management [at] metabolicatlas [dot] org</a
        >.
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout.vue';
import Citation from '@/components/about/Citation.vue';
import { getImageUrl } from '@/helpers/utils';
import { default as citations } from '@/content/citations';

export default {
  name: 'Introduction',
  components: {
    AboutLayout,
    Citation,
  },
  beforeCreate() {
    const addScript = (type, src) => {
      const script = document.createElement('script');
      script.type = type;
      script.src = src;
      document.body.appendChild(script);
    };
    addScript('text/javascript', '//cdn.plu.mx/widget-popup.js');
    addScript('text/javascript', 'https://d1bxh8uas1mnw7.cloudfront.net/assets/embed.js');
    addScript('application/javascript', 'https://cdn.scite.ai/badge/scite-badge-latest.min.js');
    addScript('application/javascript', 'https://badge.dimensions.ai/badge.js');
  },
  data() {
    return {
      members: [
        {
          name: 'Prof. Jens Nielsen',
          img: getImageUrl('pics/jens'),
          orcid: 'https://orcid.org/0000-0002-9955-6003',
          linkedin: 'https://www.linkedin.com/in/jens-nielsen-57a207181/',
          content: `<a href="https://bii.dk/team/jens-nielsen" target="_blank" rel="noopener
            noreferrer">CEO at BioInnovation Institute</a> and <a
            href="https://www.sysbio.se/labs/nielsen/" target="_blank" rel="noopener noreferrer">Prof. of Systems and Synthetic Biology at Chalmers University of Technology</a>`,
        },
        {
          name: 'Dr. Rui Benfeitas',
          img: getImageUrl('pics/rui'),
          orcid: 'https://orcid.org/0000-0001-7972-0083',
          linkedin: 'https://www.linkedin.com/in/ruibenfeitas/',
          github: 'https://github.com/Benfeitas',
          content:
            '<a href="https://www.benfeitas.net" target="_blank" rel="noopener noreferrer">Translational & Precision Medicine Lead, Chiesi Pharma</a>',
        },
        {
          name: 'Dr. Jonathan Robinson',
          img: getImageUrl('pics/jon'),
          orcid: 'https://orcid.org/0000-0001-8567-5960',
          linkedin: 'https://www.linkedin.com/in/jonathanrob',
          github: 'https://github.com/JonathanRob',
          content:
            '<a href="https://bii.dk/team/jonathan-robinson" target="_blank" rel="noopener noreferrer">Scientific Data Developer at BioInnovation Institute</a>',
        },
        {
          name: 'Dr. Hao Wang',
          img: getImageUrl('pics/hao'),
          orcid: 'https://orcid.org/0000-0001-7475-0136',
          linkedin: 'https://www.linkedin.com/in/hao-wang-9a66ba30',
          github: 'https://github.com/Hao-Chalmers',
          content:
            '<a href="https://github.com/Hao-Chalmers" target="_blank" rel="noopener noreferrer">Researcher at Chalmers University of Technology</a>',
        },
      ],
      team: [
        {
          name: '',
          members: [
            {
              name: 'Mihail Anton',
              img: getImageUrl('pics/mihail'),
              github: 'https://github.com/mihai-sysbio',
              linkedin: 'https://www.linkedin.com/in/mihail-anton/',
              content:
                '<a href="https://nbis.se/about/staff/mihail-anton/" target="_blank" rel="noopener noreferrer">NBIS expert and Project Manager for Metabolic Atlas</a>',
            },
            {
              name: 'Shan Huang',
              img: getImageUrl('pics/shan'),
              github: 'https://github.com/e0',
              linkedin: 'https://www.linkedin.com/in/shan-h-5b986383/',
              content:
                '<a href="https://www.linkedin.com/in/shan-h-5b986383/" target="_blank" rel="noopener noreferrer">Freelance Web Developer </a>',
            },
            {
              name: 'Ingrid Hyltander',
              img: getImageUrl('pics/ingrid'),
              github: 'https://github.com/inghylt',
              linkedin: 'https://www.linkedin.com/in/ingrid-hyltander-82128213a/',
              content:
                '<a href="https://nbis.se/about/staff/ingrid-hyltander/" target="_blank" rel="noopener noreferrer">System Developer at NBIS</a>',
            },
            {
              name: 'Malin Klang',
              img: getImageUrl('pics/malin'),
              github: 'https://github.com/MalinAhlberg',
              linkedin: 'https://www.linkedin.com/in/malin-klang-7105562a/',
              content:
                '<a href="https://nbis.se/about/staff/malin-klang/" target="_blank" rel="noopener noreferrer">System Developer at NBIS</a>',
            },
            {
              name: 'Nanjiang Shu',
              img: getImageUrl('pics/nanjiang'),
              github: 'https://github.com/nanjiangshu',
              linkedin: 'https://www.linkedin.com/in/nanjiang-shu-95a49713/',
              content:
                '<a href="https://nbis.se/about/staff/nanjiang-shu/" target="_blank" rel="noopener noreferrer"> Deputy Head of System Development at NBIS </a>',
            },
          ],
        },
        {
          name: 'Previous Contributors',
          members: [
            {
              name: 'Per Johnsson',
              img: getImageUrl('pics/per'),
              github: 'https://github.com/perjo',
              content:
                '<a href="https://nbis.se/about/staff/per-johnsson/" target="_blank" rel="noopener noreferrer">System Developer at NBIS </a>',
            },
            {
              name: 'Sergiu Netotea',
              img: getImageUrl('pics/sergiu'),
              linkedin: 'https://se.linkedin.com/in/sergiu-netotea-753068182',
              content:
                '<a href="https://nbis.se/about/staff/sergiu-netotea/" target="_blank" rel="noopener noreferrer">Researcher at NBIS </a>',
            },
            {
              name: 'Martin Norling',
              img: getImageUrl('pics/martin'),
              github: 'https://github.com/norling',
              content:
                '<a href="https://nbis.se/about/staff/martin-norling/" target="_blank" rel="noopener noreferrer">System Developer at NBIS </a>',
            },
            {
              name: 'Natapol Pornputtapong',
              img: getImageUrl('pics/natapol', 'jpeg'),
              github: 'https://github.com/natapol',
              linkedin: 'https://www.linkedin.com/in/natapol-pornputtapong-316a9347/',
              orcid: 'https://orcid.org/0000-0002-3833-0537',
              content:
                '<a href="https://www.linkedin.com/in/natapol-pornputtapong-316a9347/" target="_blank" rel="noopener noreferrer">Head of Biochemistry and Microbiology Department, Chulalongkorn University </a>',
            },
            {
              name: 'Pierre-Etienne C.',
              img: getImageUrl('pics/placeholder', 'png'),
            },
            {
              name: 'Jorrit B.',
              img: getImageUrl('pics/placeholder', 'png'),
            },
            {
              name: 'Lena H.',
              img: getImageUrl('pics/placeholder', 'png'),
            },
          ],
        },
      ],
      citations,
    };
  },
  computed: {
    updatedCitations() {
      return this.citations.length > 0
        ? [
            {
              ...this.citations[0],
              intro: 'Please cite: ',
            },
            ...this.citations.slice(1),
          ]
        : [];
    },
  },
};
</script>
