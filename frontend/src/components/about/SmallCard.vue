<template>
  <div class="card card-fullheight">
    <div class="card-content">
      <div class="media previous-contributors">
        <div class="media-left">
          <figure class="image is-64x64 m-0">
            <img :alt="member.name" :src="member.img" />
          </figure>
        </div>
        <div class="media-content previous-contributor">
          <p class="title is-size-5 is-size-6-tablet is-size-6-desktop is-size-6-widescreen">
            {{ member.name }}
          </p>
          <p class="subtitle is-7 links">
            <a v-if="member.orcid" :href="`https://orcid.org/${member.orcid}`" target="_blank" rel="noopener noreferrer">
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
  name: 'SmallCard',
  props: {
    member: {
      type: Object,
    },
  },
};
</script>
<style lang="scss" scoped>
.previous-contributors {
  flex-wrap: wrap;
  row-gap: 1rem;

  .previous-contributor {
    flex-basis: 60%;

    .links {
      display: flex;
      align-items: flex-end;
      padding-top: 0.5rem;
    }
  }
}
</style>
