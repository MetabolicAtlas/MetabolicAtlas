import { getImageUrl } from '@/helpers/utils';

export default [
  {
    id: 'citation-v3',
    version: 'Version 3',
    text: 'The third major version of <i>Metabolic Atlas</i> introduces GotEnzymes, a database for predicted enzyme parameters. To cite this version, or the latest version of Metabolic Atlas, please use:',
    authors: 'Li F, Chen Y, Anton M, Nielsen J.',
    title: 'GotEnzymes: an extensive database of enzyme parameter predictions.',
    journal: 'NAR',
    year: '2022',
    journalId: 'gkac831',
    journalLink:
      'https://academic.oup.com/nar/search-results?f_TocHeadingTitle=Database+Issue&sort=Date+%e2%80%93+Newest+First',
    pmid: '36169223',
    doi: '10.1093/nar/gkac831',
    img: getImageUrl('journals/nar-cover', 'gif'),
  },
  {
    id: 'citation-v2',
    version: 'Version 2',
    text: 'Version 2.0 of the <i>Metabolic Atlas</i> was published in 2021 together with a PNAS publication. To cite this version, or any of the animal GEMs, please use the publication below:',
    authors:
      'Wang H, Robinson JL, Kocabas P, Gustafsson J, Anton M, Cholley PE, Huang S, Gobom J, Svensson T, Uhlén M, Zetterberg H, Nielsen J.',
    title:
      'Genome-scale metabolic network reconstruction of model animals as a platform for translational research.',
    journal: 'PNAS 118',
    year: '2021',
    journalId: 'e2102344118',
    journalLink: 'https://www.pnas.org/content/118/30#BiologicalSciences',
    pmid: '34282017',
    doi: '10.1073/pnas.2102344118',
    img: getImageUrl('journals/pnas-cover'),
  },
  {
    id: 'citation-v1',
    version: 'Version 1',
    text: 'After its re-launch, <i>Metabolic Atlas</i> was first made publicly available in 2019. Its strong ties with <i>Human-GEM</i> constituted the basis for the associated publication in <i>Science Signaling</i>. If you use <i>Human-GEM</i> in your work, or want to refer to <i>Metabolic Atlas</i> version 1, please cite:',
    authors:
      'Robinson JL, Kocabas P, Wang H, Cholley PE, Cook D, Nilsson A, Anton M, Ferreira R, Domenzain I, Billa V, Limeta A, Hedin A, Gustafsson J, Kerkhoven EJ, Svensson LT, Palsson BO, Mardinoglu A, Hansson L, Uhlén M, Nielsen J.',
    title: 'An atlas of human metabolism.',
    journal: 'Sci. Signal. 13.624',
    journalId: 'eaaz1482',
    year: '2020',
    journalLink: 'https://www.science.org/toc/signaling/13/624',
    pmid: '32209698',
    doi: '10.1126/scisignal.aaz1482',
    img: getImageUrl('journals/scisig-cover', 'gif'),
  },
  {
    id: 'citation-launch',
    version: 'First launch',
    text: 'Initially called <i>Human Metabolic Atlas</i>, the first publication that was cited for this project dates from 2015:',
    authors: 'Pornputtapong N, Nookaew I, Nielsen J.',
    title: 'Human metabolic atlas: an online resource for human metabolism.',
    journal: 'Database',
    journalId: 'bav068',
    year: '2015',
    journalLink: 'https://academic.oup.com/database/issue/volume/2015',
    pmid: '26209309',
    doi: '10.1093/database/bav068',
    img: getImageUrl('journals/database-cover', 'gif'),
  },
];
