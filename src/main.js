import Vue from 'vue'
import App from './App.vue'
import { router, authHeader } from './_helpers'
import store from './_store';

import VueHeadful from 'vue-headful';
import Loading from './components/lib/loading'

import './scss/app.scss';

const moment = require('moment');
require('moment/locale/es');

moment.locale('es');

import './js/tables';
import './js/sidebar';
import BootstrapVue from 'bootstrap-vue';
Vue.use(BootstrapVue);

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios); 

axios.defaults.baseURL = 'http://localhost:8000/api/v2';
axios.interceptors.request.use(function (config) {
  const token = authHeader();
  config.headers.Authorization =  token;

  return config;
});
axios.interceptors.request.use(function (config) {

  config.metadata = { startTime: new Date()};
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
 
  response.config.metadata.endTime = new Date()
  response.duration = response.config.metadata.endTime - response.config.metadata.startTime
  return response;
}, function (error) {
  error.config.metadata.endTime = new Date();
  error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {

  if (response.data) {
    let data = response.data;
    if (data.success) {
      return data.result;
    } else {
      return Promise.reject(data.message);
    }
  }
  return response;
});

Vue.config.productionTip = false


Vue.component('vue-headful', VueHeadful);
Vue.component("loading", Loading);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
