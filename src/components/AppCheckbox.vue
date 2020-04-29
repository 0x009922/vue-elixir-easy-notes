<template>
  <div
    class="app-checkbox"
    :class="{
      'app-checkbox--readonly': readonly,
    }"
    @click="$emit('input', !value)"
  >
    <app-icon v-if="value">
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

.app-checkbox
  border: 1px solid colors.$primary
  border-radius: 2px
  width: 20px
  height: 20px
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  user-select: none

  @include mixins.pressable

  &:hover
    background: transparentize(colors.$primary, 0.9)

  &--readonly
    pointer-events: none
</style>
