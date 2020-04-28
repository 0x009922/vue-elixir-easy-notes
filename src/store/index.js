import Vue from 'vue';
import Vuex from 'vuex';
// import editor from './editor';
import dbEmulator from '../db-emulator';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  // modules: { editor },
  state: {
    notes: [],
    // notes: [
    //   {
    //     id: 1,
    //     title: 'Первая заметка',
    //     todos: [
    //       { title: 'Запустить приложение', done: true },
    //     ],
    //   },
    //   {
    //     id: 2,
    //     title: 'Вторая заметка',
    //     todos: [
    //       { title: 'Добавить редактирование', done: false },
    //       { title: 'Добавить создание', done: false },
    //       { title: 'Скрытый пунктик', done: false },
    //     ],
    //   },
    // ],
  },
  getters: {
    notesById: (state) => state.notes.reduce((prev, val) => {
      prev[val.id] = val;
      return prev;
    }, {}),
  },
  mutations: {
    setData(state, data) {
      state.notes = data;
    },
  },
  actions: {
    async fetch({ commit }) {
      const data = await dbEmulator.get();
      commit('setData', data);
    },
  },
});
