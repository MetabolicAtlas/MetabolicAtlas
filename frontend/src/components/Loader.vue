<template>
    <div class="container is-fullhd is-centered has-text-centered">
        <a class="button is-primary is-inverted is-outlined is-large is-loading"></a>
        <p class="is-size-5">{{ message }}</p>
    </div>
</template>

<script>
export default {
    name: 'Loader',
    props: {
        message: { type: String, required: false },
    },
}
</script>

<style lang="scss" scoped>
p {
    line-height: 3em;
}
</style>
