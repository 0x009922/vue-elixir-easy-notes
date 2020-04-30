<template>
  <app-mdi-icon
    class="app-checkbox"
    size="24"
    @click="$emit('input', !value)"
  >
    checkbox-{{ value ? 'marked' : 'blank' }}-outline
  </app-mdi-icon>
</template>

<script>
/**
 * Чекбокс, вкл/выкл
 */
export default {
  name: 'AppCheckbox',
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style lang="sass">
@use '@/assets/sass/mixins'

.app-checkbox
  @include mixins.pressable
  cursor: pointer
</style>
