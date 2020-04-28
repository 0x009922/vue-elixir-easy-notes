<template>
  <div
    id="app"
    class="d-flex align-center justify-center"
  >
    <app-loading
      :value="isFetching"
      size="40"
    >
      <router-view />
    </app-loading>
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
@use './assets/colors'

#app
  height: 100vh
  background: colors.$background
</style>
