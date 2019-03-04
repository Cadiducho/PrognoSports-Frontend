import 'bootstrap';
import 'choices.js'
import ApexCharts from 'apexcharts'

$(function () {
  $("button[data-toggle='popover']").popover({
    container: 'body'
  })
})

// feather icons
import feather from 'feather-icons';
feather.replace();

import './components/tables';
import './components/sidebar';
import './components/notifications';