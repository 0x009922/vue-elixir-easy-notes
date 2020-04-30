<template>
  <div class="app-dialog__scrim">
    <transition name="app-dialog__overlay-transition">
      <div
        v-if="value"
        class="app-dialog__overlay"
        @click="$emit('input', false)"
      />
    </transition>

    <div class="app-dialog__card-container">
      <transition name="app-dialog__card-transition">
        <div
          v-if="value"
          class="app-dialog__card card"
        >
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
/**
 * Диалоговое окно
 */
export default {
  name: 'AppDialog',
  props: {
    /**
     * Открыть ли диалог
     */
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="sass" scoped>
@use '@/assets/sass/easings'

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

  &__overlay-transition
    &-enter-active
      transition: all .4s easings.$in-out-quart
    &-leave-active
      transition: all .25s easings.$in-out-quart
    &-enter, &-leave-to
      opacity: 0

  &__card-transition
    &-enter-active
      transition: all .4s .1s easings.$out-back
    &-leave-active
      transition: all .15s easings.$in-quart
    &-enter, &-leave-to
      opacity: 0
      transform: scale(0.9)
</style>
