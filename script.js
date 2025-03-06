document.getElementById('procesar').addEventListener('click', () => {
    const a = parseFloat(document.getElementById('a').value);
    const b = parseFloat(document.getElementById('b').value);
    const c = parseFloat(document.getElementById('c').value);
    const d = parseFloat(document.getElementById('d').value);
    const e = parseFloat(document.getElementById('e').value);
    const minX = parseFloat(document.getElementById('minX').value);
    const maxX = parseFloat(document.getElementById('maxX').value);

    // Calcula Y basado en los valores de X
    let yValues = [];

    let tablaHTML = "";

    for (let x = minX; x <= maxX; x += 0.01) {
        // la idea es que Y = y\ =\ \frac{a\cdot\sin\left(X\right)+b\cdot\cos\left(X\right)}{C\cdot\sqrt{\operatorname{abs}\left(\sin\left(X\right)\right)+1}}+\frac{f\cdot\sin\left(2\cdot X\right)+\cos\left(2\cdot X\right)}{\sqrt{\operatorname{abs}\left(\cos\left(X\right)+1\right)}}+\frac{1}{x+1}
        let sinX = Math.sin(x);
        let cosX = Math.cos(x);
        let y = (a * sinX + b * cosX) / (c * Math.sqrt(Math.abs(sinX)) + 1) + (e * Math.sin(2 * x) + Math.cos(2 * x)) / (Math.sqrt(Math.abs(cosX)) + 1) + 1 / (d + 1);
        yValues.push({ "x": x, "y": y });

        // Agregar a la tabla
        tablaHTML += `<tr><td>${x.toFixed(2)}</td><td>${y.toFixed(4)}</td></tr>`;
    }

    let cortes = 0;
    for(let i = 0; i < yValues.length - 1; i++){
        if(yValues[i].y < 0 && yValues[i+1].y > 0 || yValues[i+1].y < 0 && yValues[i].y > 0){
            cortes++;
        }
    }

    // Min y Max Y
    let yMin = Math.min(...yValues.map(point => point.y));
    let yMax = Math.max(...yValues.map(point => point.y));

    document.getElementById('yMin').innerText = yMin.toFixed(2);
    document.getElementById('yMax').innerText = yMax.toFixed(2);

    // Almacena intersecciones
    document.getElementById('cortes').innerText = cortes;

    // Insertar la tabla en el HTML
    document.getElementById('tablaDatos').innerHTML = tablaHTML;

    // Draw chart using Google Charts
    drawChart(yValues);
});

function drawChart(data) {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(() => {
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn('number', 'X');
        dataTable.addColumn('number', 'Y');

        data.forEach(point => {
            dataTable.addRow([point.x, point.y]);
        });

        const options = {
            title: 'Gráfica de la Función',
            hAxis: { title: 'X' },
            vAxis: { title: 'Y' },
            legend: 'none'
        };

        const chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        chart.draw(dataTable, options);
    });
}