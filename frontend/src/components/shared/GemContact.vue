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
      <div v-if="isExpanded" class="message-body has-text-justified">
        Get in touch with the authors of {{ model.short_name }} to tell them what is wrong with this
        {{ type }}
        <a :href="`mailto:${model.email}?subject=Issue on ${type} ${id}`">via email</a>
        <template v-if="model.chat_link">
          or
          <a :href="model.chat_link" target="_blank" rel="noopener noreferrer"
            >via public chat (faster)</a
          >
        </template>
        .
      </div>
    </article>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'GemContact',
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

<style lang="scss"></style>
