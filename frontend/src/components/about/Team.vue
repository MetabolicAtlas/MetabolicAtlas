<template>
  <about-layout title="Team" full-content-width>
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
                    <figure class="image is-64x64">
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
                          src="../../assets/orcid.gif"
                        />
                      </a>
                      <a v-if="member.orcid" :href="member.linkedin" target="_blank">
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
          name: 'Developers',
          members: [
            {
              name: 'Ingrid Hyltander',
              img: require('../../assets/pic-ingrid.jpg'),
              github: 'https://github.com/inghylt',
              content:
                '<a href="https://nbis.se/about/staff/ingrid-hyltander/" target="_blank">Developer at NBIS </a>',
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
<style lang="scss"></style>
