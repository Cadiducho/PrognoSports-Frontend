import Vue from 'vue'
import vueHeadful from 'vue-headful';
import App from './App.vue'
import { router } from './_helpers/router'
import { store } from './_store';

import './scss/app.scss';

const moment = require('moment');
require('moment/locale/es');

moment.locale('es');

import './js/tables';
import './js/sidebar';
import './js/notifications';

import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios); 

axios.defaults.baseURL = 'http://localhost:8000/api/v2';

axios.interceptors.request.use(function (config) {
 
  config.metadata = { startTime: new Date()}
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


Vue.component('vue-headful', vueHeadful);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
