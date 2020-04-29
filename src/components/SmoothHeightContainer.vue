<template>
  <div
    class="smooth-height-container"
    :style="{ height }"
  >
    <div ref="inner">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SmoothHeightContainer',
  data: () => ({
    height: 'auto',
  }),
  updated() {
    this.updateHeight();
  },
  mounted() {
    this.updateHeight();
  },
  methods: {
    updateHeight() {
      const { height } = getComputedStyle(this.$refs.inner);
      this.height = height;
    },
  },
};
</script>

<style lang="sass" scoped>
.smooth-height-container
  transition: height .3s ease
  will-change: height
  overflow: hidden
</style>
