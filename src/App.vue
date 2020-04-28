<template>
  <div
    id="app"
    class="d-flex align-center justify-center fill"
  >
    <router-view v-if="!isFetching" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    isFetching: false,
  }),
  async created() {
    try {
      this.isFetching = true;
      await this.$store.dispatch('fetch');
    } finally {
      this.isFetching = false;
    }
  },
};
</script>

<style lang="sass">
#app
  height: 100vh
</style>
