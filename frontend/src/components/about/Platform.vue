<template>
  <about-layout id="Platform" title="">
    <template v-slot:contents>
      <h3 id="introduction" class="title is-3 mt-0">Introduction</h3>

      <p>
        Metabolic Atlas is a web platform integrating open-source genome scale metabolic models
        (GEMs) for easy browsing and analysis. The goal is to collect curated GEMs, and to bring
        these models closer to
        <a href="https://en.wikipedia.org/wiki/FAIR_data" target="_new">FAIR principles</a>. The
        website provides visualisations and comparisons of the GEMs, and links to
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
        <a href="https://www.sysbio.se/labs/nielsen" target="_new">Professor Jens Nielsen</a>,
        <a href="https://www.sysbio.se">Division of Systems and Synthetic Biology</a>, Department of
        Biology and Biological Engineering at the
        <a href="https://www.chalmers.se" target="_new">Chalmers University of Technology</a>. The
        platform is developed by members of
        <a href="https://nbis.se" target="blank">National Bioinformatics Infrastructure Sweden</a>
        and
        <a href="https://www.chalmers.se/en/researchinfrastructure/csb/Pages/default.aspx">
          Computational Systems Biology Infrastructure
        </a>
        at Chalmers University of Technology. The research focus of the content of this website is
        <b>metabolism in a systems biology context</b>, starting with
        <a href="https://www.sysbio.se/labs/nielsen/#publications">
          the publications of the Nielsen lab</a
        >.
      </p>

      <h3 id="citation" class="title is-3 pt-6">Citation</h3>

      <h4 class="title is-4">Latest publication</h4>
      <p>
        If you use Metabolic Atlas in your work, or any of the animal models, please cite our latest
        publication. In addition, if you use Human-GEM, please also cite the corresponding
        publication.
      </p>

      <div class="columns is-mobile">
        <div class="column is-2">
          <a
            href="https://www.pnas.org/content/118/30#BiologicalSciences"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../../assets/journals/pnas-cover.jpg" />
          </a>
        </div>
        <div class="column is-mobile">
          <p>
            Wang H, Robinson JL, Kocabas P, Gustafsson J, Anton M, Cholley PE, Huang S, Gobom J,
            Svensson T, Uhlén M, Zetterberg H, Nielsen J.
          </p>
          <p>
            <b>
              Genome-scale metabolic network reconstruction of model animals as a platform for
              translational research.
            </b>
            <span class="is-block">
              <i>PNAS 118 (2021): e2102344118</i>
            </span>
          </p>
          <p>
            PubMed:
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/32209698/"
              target="_blank"
              rel="noopener noreferrer"
              >34282017</a
            >
            DOI:
            <a
              href="https://doi.org/10.1073/pnas.2102344118"
              target="_blank"
              rel="noopener noreferrer"
            >
              10.1073/pnas.2102344118
            </a>
          </p>
          <citation-widget doi="10.1073/pnas.2102344118" />
        </div>
      </div>

      <h4 class="title is-4">Previous publications</h4>
      <p>
        After its re-launch,
        <i>Metabolic Atlas</i>
        was first made publicly available in 2019. Its strong ties with
        <i>Human-GEM</i>
        constituted the basis for the associated publication in
        <i>Science Signaling</i>. If you use
        <i>Human-GEM</i>
        in your work, or have used
        <i>Metabolic Atlas</i>
        version 1.0 to 1.7, please cite:
      </p>
      <div class="columns is-mobile">
        <div class="column is-2">
          <a
            href="https://www.science.org/toc/signaling/13/624"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="../../assets/journals/scisig-cover.gif" />
          </a>
        </div>
        <div class="column">
          <p>
            Robinson JL, Kocabas P, Wang H, Cholley PE, Cook D, Nilsson A, Anton M, Ferreira R,
            Domenzain I, Billa V, Limeta A, Hedin A, Gustafsson J, Kerkhoven EJ, Svensson LT,
            Palsson BO, Mardinoglu A, Hansson L, Uhlén M, Nielsen J.
          </p>
          <p>
            <b>An atlas of human metabolism.</b>
            <span class="is-block"><i>Sci. Signal. 13.624 (2020): eaaz1482</i></span>
          </p>
          <p>
            PubMed:
            <a
              href="https://pubmed.ncbi.nlm.nih.gov/32209698/"
              target="_blank"
              rel="noopener noreferrer"
              >32209698</a
            >
            DOI:
            <a
              href="https://doi.org/10.1126/scisignal.aaz1482"
              target="_blank"
              rel="noopener noreferrer"
            >
              10.1126/scisignal.aaz1482
            </a>
          </p>
          <citation-widget doi="10.1126/scisignal.aaz1482" />
        </div>
      </div>
      <p>
        Initially called
        <i>Human Metabolic Atlas</i>, the first publication that was cited for this project dates
        from 2015:
        <a href="https://doi.org/10.1093/database/bav068" target="_blank" rel="noopener noreferrer">
          Pornputtapong, N., et al, 2015.
          <i>Human metabolic atlas: an online resource for human metabolism.</i>
          Database (Oxford). 2015:bav068.
        </a>
      </p>

      <h3 id="advisory-board" class="title is-3 pt-6">Advisory board</h3>

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
                  <p class="title is-4">{{ member.name }}</p>
                  <p class="subtitle is-6 pt-2">
                    <a
                      v-if="member.orcid"
                      :href="member.orcid"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        class="image is-16x16 is-inline"
                        alt="orcid"
                        src="../../assets/logos/orcid.gif"
                      />
                    </a>
                    <a
                      v-if="member.linkedin"
                      :href="member.linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="icon pl-3"><i class="fa fa-linkedin-square fa-lg"></i></span>
                    </a>
                    <a
                      v-if="member.github"
                      :href="member.github"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span class="icon pl-4 has-text-black-bis">
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

      <h3 id="development" class="title is-3 pt-6">Development team</h3>

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
                    <p class="title is-4">{{ member.name }}</p>
                    <p class="subtitle is-6 pt-2">
                      <a
                        v-if="member.orcid"
                        :href="member.orcid"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          class="image is-16x16 is-inline"
                          alt="orcid"
                          src="../../assets/logos/orcid.gif"
                        />
                      </a>
                      <a
                        v-if="member.linkedin"
                        :href="member.linkedin"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span class="icon pl-3"><i class="fa fa-linkedin-square fa-lg"></i></span>
                      </a>
                      <a
                        v-if="member.github"
                        :href="member.github"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span class="icon pl-4 has-text-black-bis">
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

      <h3 id="contact-us" class="title is-3 pt-6">Contact us</h3>

      <p>
        For any questions, comments or suggestions, or if you find any bugs or vulnerabilities
        regarding Metabolic Atlas, please email us at
        <a href="mailto:contact@metabolicatlas.org">contact [at] metabolicatlas [dot] org</a>.
      </p>
      <p>
        For any management related issues, such as collaborations or funding, please email us at
        <a href="mailto:management@metabolicatlas.org">management [at] metabolicatlas [dot] org</a>.
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout.vue';
import CitationWidget from '@/components/about/CitationWidget.vue';
import { getImageUrl } from '@/helpers/utils';

export default {
  name: 'Introduction',
  components: {
    AboutLayout,
    CitationWidget,
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
            href="https://www.sysbio.se/labs/nielsen/" target="_blank rel="noopener noreferrer">Prof. of Systems and Synthetic Biology at Chalmers University of Technology</a>`,
        },
        {
          name: 'Dr. Rui Benfeitas',
          img: getImageUrl('pics/rui'),
          orcid: 'https://orcid.org/0000-0001-7972-0083',
          linkedin: 'https://www.linkedin.com/in/ruibenfeitas/',
          github: 'https://github.com/Benfeitas',
          content:
            '<a href="https://www.benfeitas.net" target="_blank" rel="noopener noreferrer">Senior Bioinformatician at NBIS, SciLifeLab</a>',
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
          ],
        },
      ],
    };
  },
};
</script>
