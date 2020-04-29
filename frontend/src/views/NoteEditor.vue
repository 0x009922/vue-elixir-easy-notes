<template>
  <div class="note-editor card">
    <div class="pa-3 d-flex align-center">
      <router-link
        :to="{ name: 'home' }"
        class="ml-n1"
      >
        <app-button icon>
          {{ mdiArrowLeft }}
        </app-button>
      </router-link>

      <div class="flex-grow-1 title ml-2">
        Редактирование заметки
      </div>

      <app-button
        :disabled="!isUndoAvailable"
        icon
        @click="undo()"
      >
        {{ mdiUndo }}
      </app-button>

      <app-button
        :disabled="!isRedoAvailable"
        icon
        class="ml-2"
        @click="redo()"
      >
        {{ mdiRedo }}
      </app-button>
    </div>

    <hr>

    <div class="subheader">
      Текст заметки
    </div>

    <app-input
      class="mx-4 mb-4"
      placeholder="Введите текст заметки"
      :value="note.title"
      @input="note.title = $event, pushSnapshot()"
    />

    <div class="subheader">
      Список TODO
    </div>

    <div class="px-4">
      <div
        v-for="(todo, i) in note.todos"
        :key="todo.id"
        :class="{ 'mb-4': i === note.todos.length - 1 }"
        class="d-flex"
      >
        <app-todo-input
          :value="todo"
          placeholder="Что нужно сделать?"
          class="flex-grow-1 mr-4"
          @update-title="todo.title = $event, pushSnapshot()"
          @update-done="todo.done = $event, pushSnapshot()"
        />
        <app-button
          icon
          warning
          @click="removeTodo(todo.id), pushSnapshot()"
        >
          {{ mdiDelete }}
        </app-button>
      </div>
    </div>

    <app-button
      class="mx-4 mb-4"
      @click="addTodo(), pushSnapshot()"
    >
      Добавить пункт TODO
    </app-button>

    <hr>

    <div class="pa-4 d-flex">
      <app-button
        class="mr-2"
        :disabled="isSaved"
        :loading="isSaving"
        @click="save()"
      >
        Сохранить
      </app-button>

      <app-button
        :disabled="isSaved"
        @click="confirmCancel = true"
      >
        Отменить изменения
      </app-button>

      <div class="flex-grow-1" />

      <app-button
        warning
        @click="confirmRemove = true"
      >
        Удалить
      </app-button>
    </div>

    <app-dialog
      v-model="confirmRemove"
    >
      <div class="pa-4 d-flex align-center">
        <div
          class="flex-grow-1 title"
        >
          Подтверждение
        </div>

        <app-button
          icon
          @click="confirmRemove = false"
        >
          {{ mdiClose }}
        </app-button>
      </div>

      <div class="px-4 text--secondary">
        Вы уверены, что хотите удалить заметку полностью?
      </div>

      <div class="pa-4 d-flex">
        <app-button
          class="mr-2"
          :loading="isRemoving"
          warning
          @click="remove()"
        >
          Подтверждаю
        </app-button>

        <app-button
          @click="confirmRemove = false"
        >
          Отмена
        </app-button>
      </div>
    </app-dialog>

    <app-dialog
      v-model="confirmCancel"
    >
      <div class="pa-4 d-flex align-center">
        <div
          class="flex-grow-1 title"
        >
          Подтверждение
        </div>

        <app-button
          icon
          @click="confirmCancel = false"
        >
          {{ mdiClose }}
        </app-button>
      </div>

      <div class="px-4 text--secondary">
        Вы уверены, что хотите отменить изменения?
      </div>

      <div class="pa-4 d-flex">
        <app-button
          class="mr-2"
          warning
          @click="forceLeave()"
        >
          Подтверждаю
        </app-button>

        <app-button
          @click="confirmCancel = false"
        >
          Отмена
        </app-button>
      </div>
    </app-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {
  mdiDelete,
  mdiRedo,
  mdiUndo,
  mdiArrowLeft,
  mdiClose,
} from '@mdi/js';
import AppTodoInput from '@/components/AppTodoInput.vue';
import AppDialog from '@/components/AppDialog.vue';

export default {
  name: 'NoteEditor',
  components: {
    AppTodoInput,
    AppDialog,
  },
  data: () => ({
    note: null,
    noteSnapshots: [],
    currentSnapshotIndex: -1,

    confirmRemove: false,
    confirmCancel: false,

    leaveAnyway: false,
    nextPreventedRoute: null,

    isSaving: false,
    isRemoving: false,

    mdiDelete,
    mdiRedo,
    mdiUndo,
    mdiArrowLeft,
    mdiClose,
  }),
  computed: {
    ...mapGetters([
      'notesById',
    ]),
    noteId() {
      return +this.$route.params.id;
    },
    storedNoteJSON() {
      const note = this.notesById[this.noteId];
      if (note) {
        const { id, ...data } = note;
        return JSON.stringify(data);
      }
      return null;
    },
    noteJSON() {
      return JSON.stringify(this.note);
    },
    isSaved() {
      return this.storedNoteJSON === this.noteJSON;
    },
    isUndoAvailable() {
      return this.currentSnapshotIndex > 0;
    },
    isRedoAvailable() {
      return this.currentSnapshotIndex < this.noteSnapshots.length - 1;
    },
  },
  watch: {
    storedNoteJSON: {
      immediate: true,
      handler(val) {
        if (val) {
          this.note = JSON.parse(val);

          // Если есть сохранённые снимки состояния, то заменяю последний из них
          if (this.noteSnapshots.length) {
            this.noteSnapshots.splice(-1, 1, this.noteJSON);
          }
        }
      },
    },
  },
  methods: {
    addTodo() {
      // Создаю новый todo со специальным id = "new-{timestamp}"
      // Не uuid, конечно, но сойдёт
      const newId = `new-${new Date().getTime()}`;
      this.note.todos.push({
        id: newId,
        title: '',
        done: false,
      });
    },
    removeTodo(id) {
      // Удаление фильтрацией
      this.note.todos = this.note.todos.filter((val) => val.id !== id);
    },
    undo() {
      if (this.isUndoAvailable) {
        this.currentSnapshotIndex -= 1;
        this.restoreSnapshot();
      }
    },
    redo() {
      if (this.isRedoAvailable) {
        this.currentSnapshotIndex += 1;
        this.restoreSnapshot();
      }
    },
    restoreSnapshot() {
      this.note = JSON.parse(this.noteSnapshots[this.currentSnapshotIndex]);
    },
    pushSnapshot() {
      this.noteSnapshots = this.noteSnapshots.slice(0, this.currentSnapshotIndex + 1);
      this.noteSnapshots.push(this.noteJSON);
      this.currentSnapshotIndex = this.noteSnapshots.length - 1;
    },
    forceLeave() {
      this.leaveAnyway = true;
      this.$router.push(this.nextPreventedRoute || { name: 'home' });
    },
    async save() {
      try {
        this.isSaving = true;

        // Собираю новые данные
        // Все todo с id в формате 'new-{time}' - новые, из них удаляю поле id
        const reg = /^new-\d+$/.compile();
        const data = {
          title: this.note.title,
          todos: this.note.todos.map(
            ({ id, title, done }) => {
              if (typeof id === 'string' && reg.test(id)) {
                return { title, done };
              }
              return { id, title, done };
            },
          ),
        };

        // Обновляю данные
        await this.$store.dispatch('update', { id: this.noteId, data });
      } finally {
        this.isSaving = false;
      }
    },
    async remove() {
      try {
        this.isRemoving = true;

        await this.$store.dispatch('remove', { id: this.noteId });

        this.leaveAnyway = true;
        this.$router.replace({ name: 'home' });
      } finally {
        this.isRemoving = false;
      }
    },
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSaved || this.leaveAnyway) {
      next();
    } else {
      this.confirmCancel = true;
      this.nextPreventedRoute = to;
      next(false);
    }
  },
};
</script>

<style lang="sass" scoped>
.note-editor
  width: 100%
  max-width: 450px
  &__todos-transition
    &-enter-active, &-leave-active
      transition: all .3s ease
    &-leave-active
      position: absolute
      width: 100%
    &-move
      transition: all .5s ease
    &-enter, &-leave-to
      transform: scale(0.9)
      opacity: 0
</style>
