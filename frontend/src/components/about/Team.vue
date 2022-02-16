<template>
  <about-layout title="Team" full-content-width>
    <template v-slot:contents>
      <div v-for="group in team" :key="group.name">
        <h3 class="title is-3">{{ group.name }}</h3>
        <div class="columns is-multiline">
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
          name: '',
          members: [
            {
              name: 'Ingrid Hyltander',
              img: require('../../assets/pics/ingrid.jpg'),
              github: 'https://github.com/inghylt',
              linkedin: 'https://www.linkedin.com/in/ingrid-hyltander-82128213a/',
              content:
                '<a href="https://nbis.se/about/staff/ingrid-hyltander/" target="_blank">System Developer at NBIS</a>',
            },
            {
              name: 'Malin Klang',
              img: require('../../assets/pics/malin.jpg'),
              github: 'https://github.com/MalinAhlberg',
              linkedin: 'https://www.linkedin.com/in/malin-klang-7105562a/',
              content:
                '<a href="https://nbis.se/about/staff/malin-klang/" target="_blank">System Developer at NBIS</a>',
            },
            {
              name: 'Mihail Anton',
              img: require('../../assets/pics/mihail.jpg'),
              github: 'https://github.com/mihai-sysbio',
              linkedin: 'https://www.linkedin.com/in/mihail-anton/',
              content:
                '<a href="https://nbis.se/about/staff/mihail-anton/" target="_blank">NBIS expert and Project Manager for Metabolic Atlas</a>',
            },
            {
              name: 'Nanjiang Shu',
              img: require('../../assets/pics/nanjiang.jpg'),
              github: 'https://github.com/nanjiangshu',
              linkedin: 'https://www.linkedin.com/in/nanjiang-shu-95a49713/',
              content:
                '<a href="https://nbis.se/about/staff/nanjiang-shu/" target="_blank"> Deputy Head of System Development at NBIS </a>',
            },
            {
              name: 'Shan Huang',
              img: require('../../assets/pics/shan.jpg'),
              github: 'https://github.com/e0',
              linkedin: 'https://www.linkedin.com/in/shan-h-5b986383/',
              content:
                '<a href="https://www.linkedin.com/in/shan-h-5b986383/" target="_blank">Freelance Web Developer </a>',
            },
          ],
        },
        /* {
          name: 'Previous Contributers',
          team: [
            {
              name: 'Ingrid Hyltander',
              img: require('../../assets/pics/ingrid.jpg'),
              github: 'https://github.com/inghylt',
              content:
                '<a href="https://nbis.se/about/staff/ingrid-hyltander/" target="_blank">Developer at NBIS </a>',
            },
          ],
        }, */
      ],
    };
  },
};
</script>
<style lang="scss"></style>
