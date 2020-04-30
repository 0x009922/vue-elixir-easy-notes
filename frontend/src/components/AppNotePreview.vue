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
/**
 * Превью заметки. Текст, несколько пунктов todo
 * и опциональный слот для действий с заметкой.
 */
export default {
  name: 'AppNotePreview',
  props: {
    /**
     * Название заметки
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * Список todo заметки
     */
    todos: {
      type: Array,
      default: () => [],
    },
    /**
     * Максимальное количество todo, которое будет показано
     */
    todosLimit: {
      type: Number,
      default: 2,
    },
  },
  computed: {
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
  &__more
    font-size: 0.9em

  &__todo + .app-note-preview__todo
    margin-top: 8px
</style>
