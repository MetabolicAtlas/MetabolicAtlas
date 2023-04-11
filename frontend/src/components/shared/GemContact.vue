<template>
  <div class="mt-5">
    <article class="message">
      <!-- <div class="message-header"> -->
      <a class="button is-grey is-fullwidth" @click="isExpanded = !isExpanded">
        <span class="icon"><i class="fa fa-question fa-lg"></i></span>
        &nbsp;
        <span>Report an issue</span>
      </a>
      <!-- </div> -->
      <div v-if="isExpanded" class="message-body has-text-left content">
        Get in touch with the authors of {{ model.short_name }} to tell them what is wrong with this
        {{ type }}
        <div class="contact mt-3">
          <a :href="createMailLink(model.email, type, id)">
            <i class="fa fa-envelope-o fa-lg" />
          </a>
          <a
            v-if="model.chat_link"
            :href="model.chat_link"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i class="fa fa-comment-o fa-lg" />
          </a>
          <a :href="model.link" target="_blank" rel="noopener noreferrer">
            <i class="fa fa-github fa-lg" />
          </a>
        </div>
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'GemContact',
  methods: {
    getPageURL() {
      return `${window.location?.href}`;
    },
    createMailLink(email, type, id) {
      const body = `I have spotted an issue on the following page: ${this.getPageURL()}`;
      return `mailto:${email}?subject=Issue on ${type} ${id}&body=${body}`;
    },
  },
  props: {
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isExpanded: false,
    };
  },
  computed: {
    ...mapState({
      model: state => state.models.model,
    }),
  },
};
</script>

<style lang="scss">
.contact {
  display: flex;
  justify-content: space-evenly;
}
</style>
