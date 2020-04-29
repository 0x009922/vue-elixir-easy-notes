<template>
  <div
    class="app-checkbox"
    :class="{
      'app-checkbox--readonly': readonly,
    }"
    @click="$emit('input', !value)"
  >
    <app-icon v-if="value" :color="readonly ? 'disabled' : 'primary'">
      {{ mdiCheck }}
    </app-icon>
  </div>
</template>

<script>
import { mdiCheck } from '@mdi/js';

export default {
  name: 'AppCheckbox',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    mdiCheck,
  }),
};
</script>

<style lang="sass" scoped>
@use '@/assets/sass/colors'
@use '@/assets/sass/mixins'

@mixin colorize($color)
  border-color: $color
  &:hover
    background: transparentize(colors.$primary, 0.9)

.app-checkbox
  @include mixins.pressable
  @include colorize(colors.$primary)

  border-width: 1px
  border-style: solid
  border-radius: 2px
  width: 20px
  height: 20px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  user-select: none

  &--readonly
    pointer-events: none
    @include colorize(colors.$disabled)
    // border-radius: 50X
</style>
