// charts.js

fetch('/assets/chart_sample.csv')
  .then(res => res.text())
  .then(text => {
    const rows = text.trim().split('\n').slice(1); // skip header
    const dates = [];
    const strategy = [];
    const btc = [];

    for (const row of rows) {
      const [date, val1, val2] = row.split(',');
      dates.push(date);
      strategy.push(parseFloat(val1));
      btc.push(parseFloat(val2));
    }

    const trace1 = {
      x: dates,
      y: strategy,
      mode: 'lines',
      name: 'Strategy',
      line: { color: '#FFD700', width: 3 }
    };

    const trace2 = {
      x: dates,
      y: btc,
      mode: 'lines',
      name: 'BTC',
      line: { color: '#888', dash: 'dot' }
    };

    const layout = {
      plot_bgcolor: '#111',
      paper_bgcolor: '#111',
      font: { color: '#EEE' },
      legend: { orientation: 'h' },
      margin: { t: 40, r: 30, l: 40, b: 50 },
      xaxis: { title: 'Date' },
      yaxis: { title: 'Value' }
    };

    Plotly.newPlot('strategyChart', [trace1, trace2], layout, { responsive: true });
  });
