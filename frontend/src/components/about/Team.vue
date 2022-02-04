<template>
  <about-layout title="Team">
    <template v-slot:contents>
      <div v-for="group in team" :key="group.name">
        <h3 class="title is-3">{{ group.name }}</h3>
        <div class="columns is-multiline">
          <div
            v-for="member in group.members"
            :key="member.name"
            class="column is-half-tablet is-one-third-desktop"
          >
            <div class="card card-fullheight">
              <div class="card-content">
                <div class="media">
                  <div class="media-left">
                    <img class="square" :src="member.img" />
                  </div>
                  <div class="media-content">
                    <p class="title is-4">{{ member.name }}</p>
                    <p class="subtitle is-6 pt-2">
                      <a v-if="member.orcid" :href="member.orcid" target="_blank">
                        <img
                          class="image is-16x16 is-inline"
                          alt="orcid"
                          src="../../assets/orcid.gif"
                        />
                      </a>
                      <a v-if="member.linkedin" :href="member.linkedin" target="_blank">
                        <span class="icon pl-3"><i class="fa fa-linkedin-square fa-lg"></i></span>
                      </a>
                      <a v-if="member.github" :href="member.github" target="_blank">
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
    </template>
  </about-layout>
</template>
<script>
import AboutLayout from '@/layouts/AboutLayout';

export default {
  name: 'Team',
  components: {
    AboutLayout,
  },
  data() {
    return {
      /* eslint-disable global-require */
      team: [
        {
          name: 'Scientific Advisors',
          members: [
            {
              name: 'Prof. Jens Nielsen',
              img: require('../../assets/pic-jens.jpg'),
              orcid: 'https://orcid.org/0000-0002-9955-6003',
              linkedin: 'https://www.linkedin.com/in/jens-nielsen-57a207181/',
              content:
                '<a href="https://bii.dk/team/jens-nielsen" target="_blank">CEO at BioInnovation Institute</a> and <a href="https://www.sysbio.se/labs/nielsen/" target="_blank">Prof. of Systems and Synthetic Biology at Chalmers University of Technology</a>',
            },
            {
              name: 'Dr. Jonathan Robinson',
              img: require('../../assets/pic-jon.jpg'),
              orcid: 'https://orcid.org/0000-0001-8567-5960',
              linkedin: 'https://www.linkedin.com/in/jonathanrob',
              github: 'https://github.com/JonathanRob',
              content:
                '<a href="https://bii.dk/team/jonathan-robinson" target="_blank">Scientific Data Developer at BioInnovation Institute</a>',
            },
            {
              name: 'Dr. Hao Wang',
              img: require('../../assets/pic-hao.jpg'),
              orcid: 'https://orcid.org/0000-0001-7475-0136',
              linkedin: 'https://www.linkedin.com/in/hao-wang-9a66ba30',
              github: 'https://github.com/Hao-Chalmers',
              content:
                '<a href="https://github.com/Hao-Chalmers" target="_blank">Researcher at Chalmers University of Technology</a>',
            },
            {
              name: 'Dr. Rui Benfeitas',
              img: require('../../assets/pic-rui.jpg'),
              orcid: 'https://orcid.org/0000-0001-7972-0083',
              linkedin: 'https://www.linkedin.com/in/ruibenfeitas/',
              github: 'https://github.com/Benfeitas',
              content:
                '<a href="https://www.benfeitas.net" target="_blank">Senior Bioinformatician at NBIS, SciLifeLab</a>',
            },
          ],
        },
        {
          name: 'Developers',
          members: [
            {
              name: 'Ingrid Hyltander',
              img: require('../../assets/pic-ingrid.jpg'),
              github: 'https://github.com/inghylt',
              linkedin: 'https://www.linkedin.com/in/ingrid-hyltander-82128213a/',
              content:
                '<a href="https://nbis.se/about/staff/ingrid-hyltander/" target="_blank">System Developer at NBIS</a>',
            },
            {
              name: 'Malin Klang',
              img: require('../../assets/pic-malin.jpg'),
              github: 'https://github.com/MalinAhlberg',
              linkedin: 'https://www.linkedin.com/in/malin-klang-7105562a/',
              content:
                '<a href="https://nbis.se/about/staff/malin-klang/" target="_blank">System Developer at NBIS</a>',
            },
            {
              name: 'Mihail Anton',
              img: require('../../assets/pic-mihail.jpg'),
              github: 'https://github.com/mihai-sysbio',
              linkedin: 'https://www.linkedin.com/in/mihail-anton/',
              content:
                '<a href="https://nbis.se/about/staff/mihail-anton/" target="_blank">NBIS expert and Project Manager for Metabolic Atlas</a>',
            },
            {
              name: 'Nanjiang Shu',
              img: require('../../assets/pic-nanjiang.jpg'),
              github: 'https://github.com/nanjiangshu',
              linkedin: 'https://www.linkedin.com/in/nanjiang-shu-95a49713/',
              content:
                '<a href="https://nbis.se/about/staff/nanjiang-shu/" target="_blank"> Deputy Head of System Development at NBIS </a>',
            },
            {
              name: 'Shang Huang',
              img: require('../../assets/pic-shan.jpg'),
              github: 'https://github.com/e0',
              linkedin: 'https://www.linkedin.com/in/shan-h-5b986383/',
              content:
                '<a href="https://www.linkedin.com/in/shan-h-5b986383/" target="_blank">Freelance Web Developer </a>',
            },
          ],
        },
        {
          name: 'Previous Contributers',
          team: [
            {
              name: 'Ingrid Hyltander',
              img: require('../../assets/pic-ingrid.jpg'),
              github: 'https://github.com/inghylt',
              content:
                '<a href="https://nbis.se/about/staff/ingrid-hyltander/" target="_blank">Developer at NBIS </a>',
            },
          ],
        },
      ],
    };
  },
};
</script>
<style lang="scss">
img.square {
  width: 75px;
  height: 75px;
  object-fit: cover;
}
</style>
