<template>
  <button
    :disabled="loading || disabled"
    v-on="$listeners"
  >
    <app-loading :value="loading">
      <slot />
    </app-loading>
  </button>
</template>

<script>
export default {
  name: 'AppButton',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
