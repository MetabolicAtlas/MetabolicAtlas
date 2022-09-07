<template>
  <transition name="slide-fade">
    <article v-if="message" id="errorPanel" class="message is-danger">
      <div class="message-header">
        <b>{{ title }}</b>
        <button
          v-if="hideErrorPanel"
          type="button"
          class="delete"
          aria-label="delete"
          @click="hideErrorPanel"
        />
      </div>
      <div class="message-body has-text-centered">
        <p class="title is-6" v-html="message" />
      </div>
    </article>
  </transition>
</template>

<script>
/**
 * The ErrorPanel component is controlled by providing a `message`, and
 * an optional `title`.
 *
 * The `hideErrorPanel` prop could be used to reset
 * the `message` by clicking the "x" button.
 *
 * Example usage for the ErrorPanel component:
 * <ErrorPanel :message="mess" :hide-error-panel="mess=''" />
 */
export default {
  name: 'ErrorPanel',
  props: {
    title: {
      type: String,
      default: 'Oops!..',
    },
    message: {
      type: String,
    },
    hideErrorPanel: {
      type: [Function, String],
    },
  },
};
</script>

<style>
#errorPanel {
  z-index: 11;
  position: fixed;
  width: 350px;
  left: calc(50% - 175px);
  bottom: 80px;
  border: 1px solid gray;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(200px);
  opacity: 0;
}
.slide-fade-leave-from,
.slide-fade-enter-to {
  transition: all 0.3s ease;
}
</style>
