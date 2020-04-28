<template>
  <div class="app-todo-input d-flex align-center">
    <app-checkbox
      v-model="doneModel"
      :readonly="readonly"
      class="mr-4"
    />

    <app-input
      v-model="titleModel"
      class="flex-grow-1"
      placeholder="Что нужно сделать?"
      :readonly="readonly"
    />
  </div>
</template>

<script>
export default {
  name: 'AppTodoInput',
  props: {
    value: {
      type: Object,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    doneModel: {
      get() { return this.value.done; },
      set(val) {
        this.$emit('update-done', val);
      },
    },
    titleModel: {
      get() { return this.value.title; },
      set(val) {
        this.$emit('update-title', val);
      },
    },
  },
};
</script>

<style lang="sass" scoped>
.app-todo-input
</style>
