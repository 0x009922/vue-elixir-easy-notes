<template>
  <div
    id="app"
    class="d-flex align-center justify-center"
  >
    <transition
      name="app__content-transition"
      mode="out-in"
    >
      <app-loading
        :value="isFetching"
        size="40"
        color="white"
      >
        <router-view />
      </app-loading>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    // Флаг того, что происходит первоначальная загрузка данных
    isFetching: false,
  }),
  async created() {
    try {
      this.isFetching = true;

      // Загрузка данных с сервера через хранилище
      await this.$store.dispatch('fetch');
    } finally {
      this.isFetching = false;
    }
  },
};
</script>

<style lang="sass">
@use './assets/sass/colors'
@use './assets/sass/easings'

#app
  height: 100vh
  background: colors.$background

.app__content-transition
  &-enter-active
    transition: all .35s easings.$out-quart
  &-leave-active
    transition: all .15s easings.$in-quart
  &-enter
    transform: translateY(20px)
    opacity: 0
  &-leave-to
    opacity: 0
    transform: scale(0.95)
</style>
