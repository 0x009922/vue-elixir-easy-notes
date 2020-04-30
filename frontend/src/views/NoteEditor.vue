<template>
  <div class="note-editor card">
    <div class="pa-3 d-flex align-center">
      <router-link
        :to="{ name: 'home' }"
        class="ml-n1"
      >
        <app-button icon>
          arrow-left
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
        undo
      </app-button>

      <app-button
        :disabled="!isRedoAvailable"
        icon
        class="ml-2"
        @click="redo()"
      >
        redo
      </app-button>
    </div>

    <hr>

    <div class="subheader">
      Название заметки
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
          delete
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
          close
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
          close
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
import AppTodoInput from '@/components/AppTodoInput.vue';
import AppDialog from '@/components/AppDialog.vue';

/**
 * Компонент для редактирования заметки
 */
export default {
  name: 'NoteEditor',
  components: {
    AppTodoInput,
    AppDialog,
  },
  data: () => ({
    /**
     * Объект с данными заметки.
     * Является копией того, что находится в хранилище.
     */
    note: null,

    /**
     * Снимки note в виде массива JSON
     * @type {string[]}
     */
    noteSnapshots: [],

    /**
     * Индекс текущего снимка. Нужно для 'путешествия'
     * под снимкам при undo-redo
     */
    currentSnapshotIndex: -1,

    /**
     * Открыть ли модалку для подтверждения удаления
     */
    confirmRemove: false,

    /**
     * Открыть ли модалку для подтверждения отмены изменений
     */
    confirmCancel: false,

    /**
     * Если этот флаг true, то покидание страницы не будет предотвращено
     */
    leaveAnyway: false,

    /**
     * Маршрут, переход к которому был отменён в beforeRouteLeave
     */
    nextPreventedRoute: null,

    /**
     * Сохраняются ли новые данные
     */
    isSaving: false,

    /**
     * Удаляется ли заметка
     */
    isRemoving: false,
  }),
  computed: {
    ...mapGetters([
      'notesById',
    ]),
    /**
     * id заметки, из маршрута
     */
    noteId() {
      return +this.$route.params.id;
    },
    /**
     * JSON заметки, которая находится в хранилище,
     * т.е. снимок того, что сохранено на сервере
     */
    storedNoteJSON() {
      const note = this.notesById[this.noteId];
      if (note) {
        const { id, ...data } = note;
        return JSON.stringify(data);
      }
      return null;
    },
    /**
     * Снимок JSON текущих данных
     */
    noteJSON() {
      return JSON.stringify(this.note);
    },
    /**
     * Сохранена ли заметка
     */
    isSaved() {
      return this.storedNoteJSON === this.noteJSON;
    },
    /**
     * Доступна ли отмена одного действия
     */
    isUndoAvailable() {
      return this.currentSnapshotIndex > 0;
    },
    /**
     * Доступен ли повтор отменённого действия
     */
    isRedoAvailable() {
      return this.currentSnapshotIndex < this.noteSnapshots.length - 1;
    },
  },
  watch: {
    /**
     * При изменении снимка того, что находится в хранилище,
     * обновляю данные для редактирования и немного
     * поправляю снимки для undo-redo
     */
    storedNoteJSON: {
      immediate: true,
      handler(val) {
        if (val) {
          this.note = JSON.parse(val);

          // Если есть сохранённые снимки состояния, то заменяю последний из них
          if (this.noteSnapshots.length) {
            this.noteSnapshots.splice(-1, 1, this.noteJSON);
          } else {
            // Иначе просто добавляю снимок
            this.pushSnapshot();
          }
        }
      },
    },
  },
  methods: {
    /**
     * Добавление нового todo. Поскольку оно не создаётся сразу на сервере,
     * заранее знать, какой у него id невозможно. Поэтому в качестве id
     * будет специальное уникальное строковое значение.
     * При сохранении данных эти id вырежутся, они нужны только для корректной установки
     * ключей в v-for
     */
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
    /**
     * Удаление todo
     */
    removeTodo(id) {
      // Удаление фильтрацией
      this.note.todos = this.note.todos.filter((val) => val.id !== id);
    },
    /**
     * Отмена последнего действия
     */
    undo() {
      if (this.isUndoAvailable) {
        this.currentSnapshotIndex -= 1;
        this.restoreSnapshot();
      }
    },
    /**
     * Повтор отменённого действия
     */
    redo() {
      if (this.isRedoAvailable) {
        this.currentSnapshotIndex += 1;
        this.restoreSnapshot();
      }
    },
    /**
     * Восстановление данных note из снимка, на который указывает индекс снимка
     */
    restoreSnapshot() {
      this.note = JSON.parse(this.noteSnapshots[this.currentSnapshotIndex]);
    },
    /**
     * Добавление нового снимка.
     * Отрезает 'хвост' отменённых действий, если такой есть.
     */
    pushSnapshot() {
      this.noteSnapshots = this.noteSnapshots.slice(0, this.currentSnapshotIndex + 1);
      this.noteSnapshots.push(this.noteJSON);
      this.currentSnapshotIndex = this.noteSnapshots.length - 1;
    },
    /**
     * Покинуть страницу, ничего не сохраняя.
     * Используется из модалки про несохранённые изменения
     */
    forceLeave() {
      this.leaveAnyway = true;
      this.$router.push(this.nextPreventedRoute || { name: 'home' });
    },
    /**
     * Сохранение данных.
     *
     * Бэк обновляет сразу и данные заметки, и связанные с ней todo.
     * Обновляет существующие todo, если есть данные с их id в note.todos.
     * Удаляет существующие, если их id нет в note.todos.
     * Создаёт новые, если в note.todos есть элементы без id.
     */
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
    /**
     * Удаление заметки и возврат к списку заметок
     */
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
  /**
   * Предотвращение ухода с маршрута, если
   * остались несохранённые изменения
   */
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
