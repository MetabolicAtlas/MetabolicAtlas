<template>
  <about-layout title="Citation">
    <template v-slot:contents>
      <h4 class="title is-4">Latest publication</h4>
      <p>
        If you use Metabolic Atlas in your work, or any of the animal models, please cite our latest
        publication. In addition, if you use Human-GEM, please also cite the corresponding
        publication.
      </p>

      <div class="columns is-mobile">
        <div class="column is-2">
          <a href="https://www.pnas.org/content/118/30#BiologicalSciences" target="_blank">
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
            <br />
            <i>PNAS 118 (2021): e2102344118</i>
          </p>
          <p>
            PubMed:
            <a href="https://pubmed.ncbi.nlm.nih.gov/32209698/" target="_blank">34282017</a>
            DOI:
            <a href="https://doi.org/10.1073/pnas.2102344118" target="_blank">
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
        <i>Science Signaling</i>
        . If you use
        <i>Human-GEM</i>
        in your work, or have used
        <i>Metabolic Atlas</i>
        version 1.0 to 1.7, please cite:
      </p>
      <div class="columns is-mobile">
        <div class="column is-2">
          <a href="https://www.science.org/toc/signaling/13/624" target="_blank">
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
            <br />
            <i>Sci. Signal. 13.624 (2020): eaaz1482</i>
          </p>
          <p>
            PubMed:
            <a href="https://pubmed.ncbi.nlm.nih.gov/32209698/" target="_blank">32209698</a>
            DOI:
            <a href="https://doi.org/10.1126/scisignal.aaz1482" target="_blank">
              10.1126/scisignal.aaz1482
            </a>
          </p>
          <citation-widget doi="10.1126/scisignal.aaz1482" />
        </div>
      </div>
      <p>
        Initially called
        <i>Human Metabolic Atlas</i>
        , the first publication that was cited for this project dates from 2015:
        <a href="https://doi.org/10.1093/database/bav068" target="_blank">
          Pornputtapong, N., et al, 2015.
          <i>Human metabolic atlas: an online resource for human metabolism.</i>
          Database (Oxford). 2015:bav068.
        </a>
      </p>
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';
import CitationWidget from '@/components/about/CitationWidget';

export default {
  name: 'Citation',
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
};
</script>
