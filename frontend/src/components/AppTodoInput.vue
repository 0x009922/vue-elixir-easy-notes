<template>
  <div class="d-flex align-center">
    <app-checkbox
      v-model="doneModel"
      class="mr-4"
    />

    <app-input
      v-model="titleModel"
      class="flex-grow-1"
      placeholder="Что нужно сделать?"
    />
  </div>
</template>

<script>
/**
 * Комплексный инпут для редактирования todo - текста и done/не done
 */
export default {
  name: 'AppTodoInput',
  props: {
    /**
     * Объект с данными todo
     * @type {{ title: string, done: boolean }}
     */
    value: {
      type: Object,
      required: true,
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
