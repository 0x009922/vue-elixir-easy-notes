<template>
  <div class="app-note-preview">
    <div class="app-note-preview__title d-flex align-center">
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
      <template v-for="todo in shownTodos">
        <div
          :key="todo.id"
          class="app-note-preview__todo d-flex align-center"
        >
          <app-mdi-icon color="disabled">
            checkbox-{{ todo.done ? 'marked' : 'blank' }}-outline
          </app-mdi-icon>

          <div
            :class="{ 'text--secondary': !todo.title }"
            class="ml-2"
          >
            {{ todo.title || 'Пусто' }}
          </div>
        </div>
      </template>

      <!-- <app-todo-input
        v-for="todo in shownTodos"
        :key="todo.id"
        :value="todo"
        readonly
        class="app-note-preview__todo"
      /> -->

      <div
        v-if="todos.length > todosLimit"
        class="app-note-preview__more text--secondary mt-2 pb-2"
      >
        Ещё пунктов: {{ todos.length - todosLimit }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AppNotePreview',
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
  &__more
    font-size: 0.9em

  &__todo + .app-note-preview__todo
    margin-top: 8px
</style>
