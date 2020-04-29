import Vue from 'vue';
import Vuex from 'vuex';
import axios from '../api';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    notes: [],
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
      const { data } = await axios.get('/notes');
      commit('setData', data);
    },
    async remove({ dispatch }, { id }) {
      await axios.delete(`/notes/${id}`);
      await dispatch('fetch');
    },
    async update({ dispatch }, { id, data }) {
      await axios.patch(`/notes/${id}`, data);
      await dispatch('fetch');
    },
    async create({ dispatch }) {
      const { data: { id } } = await axios.post('/notes');
      await dispatch('fetch');
      return id;
    },
  },
});
