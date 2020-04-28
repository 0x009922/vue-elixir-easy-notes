<template>
  <div class="app-note-preview">
    <div class="app-note-preview__title d-flex align-center mb-2">
      <div class="flex-grow-1">
        <template v-if="title">
          {{ title }}
        </template>
        <span
          v-else
          class="text--secondary"
        >
          Заметка без текста
        </span>
      </div>

      <slot name="actions" />
    </div>

    <div class="app-note-preview__todos">
      <app-todo-input
        v-for="todo in shownTodos"
        :key="todo.id"
        :value="todo"
        readonly
        class="app-note-preview__todo"
      />

      <div
        v-if="todos.length > todosLimit"
        class="app-note-preview__more"
      >
        Ещё пунктов: {{ todos.length - todosLimit }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppTodoInput from './AppTodoInput.vue';

export default {
  name: 'AppNotePreview',
  components: {
    AppTodoInput,
  },
  props: {
    title: {
      type: String,
      default: '',
    },
    todos: {
      type: Array,
      default: () => [],
    },
    todosLimit: {
      type: Number,
      default: 2,
    },
  },
  computed: {
    ...mapGetters([
      'notesById',
    ]),
    note() {
      return this.notesById[this.nodeId];
    },
    shownTodos() {
      return this.todos.slice(0, this.todosLimit);
    },
  },
};
</script>

<style lang="sass" scoped>
.app-note-preview
  &__title
    font-size: 16px
  // padding: 8px 16px
  &__todo + *
    margin-top: 8px
  &__more
    color: gray
    font-size: 0.9em
</style>
