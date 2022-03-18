<template>
  <about-layout title="Team" full-content-width>
    <template v-slot:contents>
      <div v-for="group in team" :key="group.name">
        <h3 class="title is-3">{{ group.name }}</h3>
        <div class="pb-6 columns is-multiline">
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
              name: 'Mihail Anton',
              img: require('../../assets/pics/mihail.jpg'),
              github: 'https://github.com/mihai-sysbio',
              linkedin: 'https://www.linkedin.com/in/mihail-anton/',
              content:
                '<a href="https://nbis.se/about/staff/mihail-anton/" target="_blank">NBIS expert and Project Manager for Metabolic Atlas</a>',
            },
            {
              name: 'Shan Huang',
              img: require('../../assets/pics/shan.jpg'),
              github: 'https://github.com/e0',
              linkedin: 'https://www.linkedin.com/in/shan-h-5b986383/',
              content:
                '<a href="https://www.linkedin.com/in/shan-h-5b986383/" target="_blank">Freelance Web Developer </a>',
            },
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
              name: 'Nanjiang Shu',
              img: require('../../assets/pics/nanjiang.jpg'),
              github: 'https://github.com/nanjiangshu',
              linkedin: 'https://www.linkedin.com/in/nanjiang-shu-95a49713/',
              content:
                '<a href="https://nbis.se/about/staff/nanjiang-shu/" target="_blank"> Deputy Head of System Development at NBIS </a>',
            },
          ],
        },
        {
          name: 'Previous Contributors',
          members: [
            {
              name: 'Sergiu Netotea',
              img: require('../../assets/pics/sergiu.jpg'),
              linkedin: 'https://se.linkedin.com/in/sergiu-netotea-753068182',
              content:
                '<a href="https://nbis.se/about/staff/sergiu-netotea/" target="_blank">Researcher at NBIS </a>',
            },
            {
              name: 'Martin Norling',
              img: require('../../assets/pics/martin.jpg'),
              github: 'https://github.com/norling',
              content:
                '<a href="https://nbis.se/about/staff/martin-norling/" target="_blank">System Developer at NBIS </a>',
            },
            {
              // below not ok:ed
              name: 'Virinchi Billa',
              img: require('../../assets/pics/virinchi.jpeg'),
              github: 'https://github.com/virinchi22',
              // linkedin: 'https://www.linkedin.com/in/nanjiang-shu-95a49713/',  virinchi@chalmers.se
              content:
                '<a href="https://www.chalmers.se/en/staff/Pages/virinchi.aspx" target="_blank">Research engineer at Chalmers? </a>',
            },
            {
              name: 'Jorrit Boekel',
              github: 'https://github.com/glorpmph',
              content:
                '<a href="https://staff.ki.se/people/jorrit-boekel" target="_blank">Developer at SciLifeLab</a>',
            },
            {
              name: 'Pierre-Etienne Cholley',
              img: require('../../assets/pics/pierre.jpeg'),
              github: 'https://github.com/pecholleyc',
              linkedin: 'https://nl.linkedin.com/in/pierre-etienne-cholley-337177127',
              content: '<a href="" target="_blank">Developer at X</a>', //  cholley@chalmers.se',
            },
            {
              name: 'Lena Hansson',
              // img: require('../../assets/pics/ingrid.jpg'),
              // github: 'https://github.com/inghylt',
              linkedin: 'https://se.linkedin.com/in/lena-hansson-0534ab14',
              content: '<a href="" target="_blank">X at x</a>',
            },
            {
              name: 'Natapol Pornputtapong',
              img: require('../../assets/pics/natapol.jpeg'),
              // github: 'https://github.com/inghylt',
              linkedin: 'https://th.linkedin.com/in/natapol-pornputtapong-316a9347',

              content: '<a href="" target="_blank">X at x </a>',
            },
            // {
            //   name: 'grokkaine?',
            //   // img: require('../../assets/pics/ingrid.jpg'),
            //   github: 'https://github.com/inghylt',
            //   linkedin: 'https://www.linkedin.com/in/nanjiang-shu-95a49713/',
            //   content:
            //     '<a href="https://nbis.se/about/staff/ingrid-hyltander/" target="_blank">Developer at NBIS </a>',
            // },
            {
              name: 'Hao Wang?',
              img: require('../../assets/pics/hao.jpg'),
              linkedin: 'https://www.linkedin.com/in/hao-wang-9a66ba30',
              github: 'https://github.com/Hao-Chalmers',
              content:
                '<a href="https://github.com/Hao-Chalmers" target="_blank">Researcher at Chalmers University of Technology</a>',
            },
          ],
        },
      ],
    };
  },
};
</script>
<style lang="scss"></style>
