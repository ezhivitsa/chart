import Toggle from './components/ui/toggle';
import Chart from './components/chart';

import chartsData from './data/chart_data.json';

import './styles.pcss';

const element = document.querySelector('.chart');
const nightMode = document.querySelector('.night-mode');

const initializeCharts = () => {
  for (let i = 0; i < chartsData.length; i += 1) {
    const div = document.createElement('div');
    element.appendChild(div);

    const chart = new Chart(div, chartsData[i], 6);
    chart.render();
  }
};

const onToggleChange = (on) => {

};

const initializeToggle = () => {
  const toggle = new Toggle(
    nightMode,
    'Night Mode',
    false,
    onToggleChange,
  );
  toggle.render();
};

initializeToggle();
initializeCharts();
