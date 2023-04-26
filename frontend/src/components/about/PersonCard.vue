<template>
  <div class="card card-fullheight">
    <div class="card-content">
      <div class="media" :class="{ smallContainer: isSmall }" >
        <div class="media-left">
          <figure class="image m-0" :class="iconSize">
            <img :alt="member.name" :src="member.img" />
          </figure>
        </div>
        <div class="media-content" :class="{ smallContent: isSmall }">
          <p class="title" :class="[ isSmall ? 'is-size-5 is-size-6-tablet is-size-6-desktop is-size-6-widescreen' : 'is-5' ]">{{ member.name }}</p>
          <p class="subtitle" :class="[ isSmall ? 'is-7 links' : 'is-6 pt-2']">
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
  name: 'PersonCard',
  props: {
    member: {
      type: Object,
    },
    size: {
      type: String
    }
  },
  computed: {
    isSmall() {
      return this.size === 'small';
    },
    iconSize() {
      return this.isSmall ? "is-64x64" : "is-96x96";
    }
  }
};
</script>
<style lang="scss" scoped>
.small-c {
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
<style lang="scss" scoped>
.smallContainer {
  flex-wrap: wrap;
  row-gap: 1rem;

  .smallContent {
    flex-basis: 60%;

    .links {
      display: flex;
      align-items: flex-end;
      padding-top: 0.5rem;
    }
  }
}
</style>
