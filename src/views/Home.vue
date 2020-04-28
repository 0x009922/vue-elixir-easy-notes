<template>
  <div class="home-view">
    <div class="pa-4 d-flex align-center">
      <div class="flex-grow-1">
        Заметки
      </div>

      <app-button
        :loading="isCreating"
        @click="create()"
      >
        Создать новую
      </app-button>
    </div>

    <hr>

    <div class="home-view__list px-4 pt-4">
      <div
        v-if="!notes.length"
        class="mb-4 text--secondary"
      >
        Список заметок пуст.
      </div>

      <template v-else>
        <app-note-preview
          v-for="note in notes"
          :key="note.id"
          :title="note.title"
          :todos="note.todos"
          class="mb-4"
        >
          <template #actions>
            <router-link :to="{ name: 'edit-note', params: { id: note.id } }">
              <app-button>
                редактировать
              </app-button>
            </router-link>

            <app-button
              @click="removeId = note.id"
            >
              удалить
            </app-button>
          </template>
        </app-note-preview>
      </template>
    </div>

    <app-dialog
      :value="!!removeId"
      @input="removeId = null"
    >
      <div class="pa-4 title">
        Remove {{ removeId }}
      </div>

      <div class="pa-4">
        <app-button
          :loading="isRemoving"
          @click="remove()"
        >
          remove
        </app-button>
      </div>
    </app-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AppNotePreview from '@/components/AppNotePreview.vue';
import AppDialog from '@/components/AppDialog.vue';
import db from '../db-emulator';

export default {
  name: 'Home',
  components: {
    AppNotePreview,
    AppDialog,
  },
  data: () => ({
    isCreating: false,

    removeId: null,
    isRemoving: false,
  }),
  computed: {
    ...mapState([
      'notes',
    ]),
  },
  methods: {
    async create() {
      try {
        this.isCreating = true;
        const { id } = await db.create();
        await this.$store.dispatch('fetch');
        this.$router.push({ name: 'edit-note', params: { id } });
      } finally {
        this.isCreating = false;
      }
    },
    async remove() {
      try {
        this.isRemoving = true;
        await db.remove(this.removeId);
        await this.$store.dispatch('fetch');
        this.removeId = null;
      } finally {
        this.isRemoving = false;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.home-view
  border: 1px solid gray
  // padding: 16px
  width: 100%
  max-width: 450px
</style>
