<template>
  <div class="app-dialog__scrim">
    <div
      v-if="value"
      class="app-dialog__overlay"
      @click="$emit('input', false)"
    />

    <div class="app-dialog__card-container">
      <div
        v-if="value"
        class="app-dialog__card card"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppDialog',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="sass" scoped>
.app-dialog
  &__scrim
    position: fixed

  &__overlay
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: black
    opacity: 0.5

  &__card-container
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    display: flex
    align-items: center
    justify-content: center
    pointer-events: none
    & > *
      pointer-events: auto

  &__card
    width: 100%
    max-width: 400px
</style>
