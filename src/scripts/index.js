import Toggle from './components/ui/toggle';
import Chart from './components/chart';

import './styles.pcss';

const element = document.querySelector('.chart');
const nightMode = document.querySelector('.night-mode-container');

const nightModeItem = 'night-mode';
const nightModeClass = 'night-mode';

const initializeCharts = async () => {
  const { default: chartsData } = await import('data/chart_data.json');

  for (let i = 0; i < chartsData.length; i += 1) {
    const div = document.createElement('div');
    element.appendChild(div);

    const chart = new Chart(div, chartsData[i], 6);
    chart.render();
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

initializeToggle();
initializeCharts();
