import $ from 'jquery';
import 'bootstrap';
import ApexCharts from 'apexcharts/dist/apexcharts.common.js'

import '../scss/app.scss';

$(function () {
  $("button[data-toggle='popover']").popover({
    container: 'body'
  })
});

$.fn.getFormObject = function() {
	return $(this).serializeArray().reduce(function (obj, item) {
		let name = item.name.replace("[]", "");
        if (typeof obj[name] !== "undefined") {
			if (!Array.isArray(obj[name])) {
				obj[name] = [obj[name], item.value];
			} else {
				obj[name].push(item.value);
			}
		} else {
			obj[name] = item.value;
		}
        return obj;
	}, {});
};

// feather icons
import feather from 'feather-icons';
feather.replace();

// moment.js
const moment = require('moment');
require('moment/locale/es');

moment.locale('es');

import './components/tables';
import './components/sidebar';
import './components/notifications';

require("expose-loader?$!jquery");
require("expose-loader?ApexCharts!apexcharts/dist/apexcharts.common.js");
require("expose-loader?moment!moment");