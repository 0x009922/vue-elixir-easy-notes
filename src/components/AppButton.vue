<template>
  <button
    :disabled="loading || disabled"
    v-on="$listeners"
  >
    <template v-if="loading">
      loading...
    </template>
    <template v-else>
      <slot />
    </template>
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
  },
};
</script>
