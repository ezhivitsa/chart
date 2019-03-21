import { throttle } from 'helpers/common';

import Toggle from './components/ui/toggle';
import Chart from './components/chart';

import './styles.pcss';

const element = document.querySelector('.chart');
const nightMode = document.querySelector('.night-mode-container');

const nightModeItem = 'night-mode';
const nightModeClass = 'night-mode';

const chartsWidth = 500;
const charts = [];

const initializeCharts = async () => {
  let chartsData;

  // eslint-disable-next-line
  if (process.env.NODE_ENV === 'development') {
    const response = await import('data/chart_data.json');
    chartsData = response.default;
  } else {
    const response = await fetch('/chart_data.json');
    chartsData = await response.json();
  }

  const width = Math.min(document.body.clientWidth - 20, chartsWidth);
  for (let i = 0; i < chartsData.length; i += 1) {
    const div = document.createElement('div');
    element.appendChild(div);

    const chart = new Chart(div, chartsData[i], 6, width);
    chart.render();

    charts.push(chart);
  }
};

const onToggleChange = (on) => {
  setTimeout(() => {
    if (on) {
      document.body.classList.add(nightModeClass);
    } else {
      document.body.classList.remove(nightModeClass);
    }
  }, 300);

  if (window.localStorage) {
    localStorage.setItem(nightModeItem, JSON.stringify(on));
  }
};

const initializeToggle = () => {
  let on = false;
  if (window.localStorage) {
    on = JSON.parse(localStorage.getItem(nightModeItem));
  }

  if (on) {
    document.body.classList.add(nightModeClass);
  }

  const toggle = new Toggle(
    nightMode,
    'Night Mode',
    on,
    onToggleChange,
  );
  toggle.render();
};

const initializeResize = () => {
  let width = document.body.clientWidth;

  window.addEventListener('resize', throttle(() => {
    if (width !== document.body.clientWidth) {
      width = Math.min(document.body.clientWidth - 20, chartsWidth);

      for (let i = 0; i < charts.length; i += 1) {
        charts[i].updateWidth(width);
      }
    }
  }, 100));
};

initializeResize();
initializeToggle();
initializeCharts();
