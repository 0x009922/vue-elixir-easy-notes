<template>
  <div class="home-view card">
    <div class="pa-4 d-flex align-center">
      <div class="flex-grow-1 title">
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

    <div class="home-view__list">
      <div
        v-if="!notes.length"
        class="text--secondary pa-4"
      >
        Список заметок пуст.
      </div>

      <template v-else>
        <template v-for="(note, i) in notes">
          <app-note-preview
            :key="note.id"
            :title="note.title"
            :todos="note.todos"
            class="px-4 my-2"
          >
            <template #actions>
              <router-link :to="{ name: 'edit-note', params: { id: note.id } }">
                <app-button icon>
                  {{ mdiPencil }}
                </app-button>
              </router-link>

              <app-button
                class="ml-2"
                icon
                warning
                @click="removeId = note.id"
              >
                {{ mdiDelete }}
              </app-button>
            </template>
          </app-note-preview>

          <hr
            v-if="i < notes.length - 1"
            :key="`sep${i}`"
            class="ml-4 my-2"
          >
        </template>
      </template>
    </div>

    <app-dialog
      :value="!!removeId"
      @input="removeId = null"
    >
      <div class="pa-4 title d-flex">
        <div class="flex-grow-1">
          Подтверждение
        </div>
        <app-button
          class="ma-n2"
          icon
          @click="removeId = null"
        >
          {{ mdiClose }}
        </app-button>
      </div>

      <div class="px-4 text--secondary">
        Вы уверены, что хотите удалить заметку?
      </div>

      <div class="pa-4">
        <app-button
          warning
          :loading="isRemoving"
          @click="remove()"
        >
          Подтверждаю
        </app-button>
      </div>
    </app-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { mdiDelete, mdiPencil, mdiClose } from '@mdi/js';
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

    mdiDelete,
    mdiPencil,
    mdiClose,
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
  // border: 1px solid gray
  // padding: 16px
  width: 100%
  max-width: 450px
</style>
