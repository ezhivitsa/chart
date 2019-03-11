import chartsData from './data/chart_data.json';

import Chart from './chart';

const element = document.querySelector('.chart');

for (let i = 0; i < chartsData.length; i += 1) {
  const div = document.createElement();
  element.appendChild(div);

  const chart = new Chart(div, 5);
  chart.render(chartsData[i]);
}
