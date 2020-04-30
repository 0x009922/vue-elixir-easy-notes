import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../api';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    /**
     * Здесь хранятся заметки с сервера.
     * @typedef {{ id: number, title: string, done: boolean }} NoteTodo
     * @typedef {{ id: number, title: string, todos: NoteTodo[] }} Note
     * @type {Note[]}
     */
    notes: [],
  },
  getters: {
    /**
     * Заметки в виде карты.
     * Объект, в котором ключи -- id заметок, а значения -- сами заметки.
     */
    notesById: (state) => state.notes.reduce((prev, val) => {
      prev[val.id] = val;
      return prev;
    }, {}),
  },
  mutations: {
    /**
     * Установка данных.
     */
    setData(state, data) {
      state.notes = data;
    },
  },
  actions: {
    /**
     * Загрузка заметок с сервера.
     */
    async fetch({ commit }) {
      const { data } = await axios.get('/notes');
      commit('setData', data);
    },
    /**
     * Удаление заметки и обновление данных.
     */
    async remove({ dispatch }, { id }) {
      await axios.delete(`/notes/${id}`);
      await dispatch('fetch');
    },
    /**
     * Обновление заметки и обновление данных.
     *
     * Сервер принимает данные заметки сразу с её todo и удаляет/обновляет/создаёт новые
     * в замисимости от того, что находится в data.todos.
     */
    async update({ dispatch }, { id, data }) {
      await axios.patch(`/notes/${id}`, data);
      await dispatch('fetch');
    },
    /**
     * Создание заметки. Возвращается id новой заметки
     */
    async create({ dispatch }) {
      const { data: { id } } = await axios.post('/notes');
      await dispatch('fetch');
      return id;
    },
  },
});
