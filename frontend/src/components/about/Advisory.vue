<template>
  <about-layout title="Scientific Advisors" full-content-width>
    <template v-slot:contents>
      <div class="columns is-multiline">
        <div
          v-for="member in members"
          :key="member.name"
          class="column is-full is-half-desktop is-one-third-widescreen"
        >
          <div class="card card-fullheight">
            <div class="card-content">
              <div class="media">
                <div class="media-left">
                  <img class="square" :alt="member.name" :src="member.img" />
                </div>
                <div class="media-content">
                  <p class="title is-4">{{ member.name }}</p>
                  <p class="subtitle is-6 pt-2">
                    <a v-if="member.orcid" :href="member.orcid" target="_blank">
                      <img
                        class="image is-16x16 is-inline"
                        alt="orcid"
                        src="../../assets/logos/orcid.gif"
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
      members: [
        {
          name: 'Prof. Jens Nielsen',
          img: require('../../assets/pics/jens.jpg'),
          orcid: 'https://orcid.org/0000-0002-9955-6003',
          linkedin: 'https://www.linkedin.com/in/jens-nielsen-57a207181/',
          content:
            '<a href="https://bii.dk/team/jens-nielsen" target="_blank">CEO at BioInnovation Institute</a> and <a href="https://www.sysbio.se/labs/nielsen/" target="_blank">Prof. of Systems and Synthetic Biology at Chalmers University of Technology</a>',
        },
        {
          name: 'Dr. Jonathan Robinson',
          img: require('../../assets/pics/jon.jpg'),
          orcid: 'https://orcid.org/0000-0001-8567-5960',
          linkedin: 'https://www.linkedin.com/in/jonathanrob',
          github: 'https://github.com/JonathanRob',
          content:
            '<a href="https://bii.dk/team/jonathan-robinson" target="_blank">Scientific Data Developer at BioInnovation Institute</a>',
        },
        {
          name: 'Dr. Hao Wang',
          img: require('../../assets/pics/hao.jpg'),
          orcid: 'https://orcid.org/0000-0001-7475-0136',
          linkedin: 'https://www.linkedin.com/in/hao-wang-9a66ba30',
          github: 'https://github.com/Hao-Chalmers',
          content:
            '<a href="https://github.com/Hao-Chalmers" target="_blank">Researcher at Chalmers University of Technology</a>',
        },
        {
          name: 'Dr. Rui Benfeitas',
          img: require('../../assets/pics/rui.jpg'),
          orcid: 'https://orcid.org/0000-0001-7972-0083',
          linkedin: 'https://www.linkedin.com/in/ruibenfeitas/',
          github: 'https://github.com/Benfeitas',
          content:
            '<a href="https://www.benfeitas.net" target="_blank">Senior Bioinformatician at NBIS, SciLifeLab</a>',
        },
      ],
    };
  },
};
</script>
<style lang="scss"></style>
