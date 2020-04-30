import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import AppButton from './components/AppButton.vue';
import AppInput from './components/AppInput.vue';
import AppCheckbox from './components/AppCheckbox.vue';
import AppLoading from './components/AppLoading.vue';
import AppMdiIcon from './components/AppMdiIcon.vue';
import './assets/sass/styles.sass';

Vue.component('AppButton', AppButton);
Vue.component('AppInput', AppInput);
Vue.component('AppCheckbox', AppCheckbox);
Vue.component('AppLoading', AppLoading);
Vue.component('AppMdiIcon', AppMdiIcon);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render(h) { return h(App); },
}).$mount('#app');
