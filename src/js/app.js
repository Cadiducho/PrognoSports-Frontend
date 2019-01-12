import 'bootstrap';
import 'choices.js'

$(function () {
  $("button[data-toggle='popover']").popover({
    container: 'body'
  })
})

// feather icons
import feather from 'feather-icons';
feather.replace();

import './util/polyfills';
import './components/tables';
import './components/sidebar';
import './components/notifications';