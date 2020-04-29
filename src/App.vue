<template>
  <div
    id="app"
    class="d-flex align-center justify-center"
  >
    <transition :name="transitionName">
      <app-loading
        :value="isFetching"
        size="40"
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
    isFetching: false,
    transitionName: 'app-route-appear-transition',
  }),
  watch: {
    $route(val) {
      if (val.name === 'edit-note') {
        this.transitionName = 'home-editor-transition';
      } else {
        this.transitionName = 'editor-home-transition';
      }
    },
  },
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
@use './assets/sass/colors'
@use './assets/sass/easings'

#app
  height: 100vh
  background: colors.$background
  perspective: 1000px

.app-route-appear-transition
  &-enter-active
    transition: all .3s easings.$out-quart
  &-leave-active
    // transition: all .4s ease
    position: absolute
  &-enter
    // box-shadow: none
    transform: translateZ(-50px)
    opacity: 0
  &-leave-to
    opacity: 0
    transform: translateX(100px)

.home-editor-transition
  &-enter-active
    transition: all .3s easings.$out-back
  &-leave-active
    transition: all .3s easings.$out-quart
    position: absolute
  &-enter
    opacity: 0
    transform: translateZ(-100px)
  &-leave-to
    transform: translateZ(100px)
    opacity: 0

.editor-home-transition
  &-enter-active
    transition: all .3s easings.$out-back
  &-leave-active
    transition: all .3s easings.$out-quart
    position: absolute
  &-leave-to
    opacity: 0
    transform: translateZ(-100px)
  &-enter
    transform: translateZ(100px)
    opacity: 0
</style>
