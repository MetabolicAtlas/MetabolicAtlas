<template>
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
            <a v-if="member.orcid" :href="member.orcid" target="_blank" rel="noopener noreferrer">
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
            <a v-if="member.github" :href="member.github" target="_blank" rel="noopener noreferrer">
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
</template>
<script>
export default {
  name: 'LargeCard',
  props: {
    member: {
      type: Object,
    },
  },
};
</script>
