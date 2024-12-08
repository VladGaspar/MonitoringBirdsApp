import React from 'react';
import {Bar} from 'react-chartjs-2';
import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

const ObservationsChart = ({observations, period, stepLabel, year, comparisonYear}) => {

    const processObservations = (observations, period) => {
        let labels = [];
        let step;
        switch (stepLabel) {
            case '3_DAYS':
                step = 3
                labels = generateDateLabels(3)
                break;
            case '1_WEEK':
                step = 7
                labels = generateDateLabels(7)
                break;
            case '2_WEEKS':
                step = 14
                labels = generateDateLabels(14)
                break;
            case '1_MONTH':
                step = 12
                labels = [...Array(12)].map((_, i) => new Date(0, i).toLocaleString('default', {month: 'long'}));
                break;
        }

        let dataForYear = new Array(labels.length).fill(0);
        let dataForComparisonYear = new Array(labels.length).fill(0);

        function daysInMonth(month, year) {
            return new Date(year, month, 0).getDate();
        }

        function generateDateLabels(stepDays) {
            const startDate = new Date(0, 0, 1);
            const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
            const endDate = new Date(startDate.getTime() + 365 * oneDayInMilliseconds);

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + stepDays)) {
                const label = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
                labels.push(label);
            }

            return labels;
        }

        if (period === 'YEAR') {
            observations.forEach(bird => {
                const date = new Date(bird.date);
                const month = date.getMonth();
                if (step === 12) {
                    dataForYear[month]++;
                } else {
                    let index = date.getDate();
                    for (let m = 0; m < month; m++) {
                        index += daysInMonth(month, 0)
                    }
                    index = index / step | 0
                    dataForYear[index]++;
                }
            });

        } else {

            observations.forEach(observation => {
                const date = new Date(observation.date);
                const month = date.getMonth();
                if (date.getFullYear() === Number(year) && step === 12) {
                    dataForYear[month]++;
                } else if (date.getFullYear() === Number(year)) {
                    let index = date.getDate();
                    for (let m = 0; m < month; m++) {
                        index += daysInMonth(month, 0)
                    }
                    index = index / step | 0
                    dataForYear[index]++;
                }

                if (date.getFullYear() === Number(comparisonYear) && step === 12) {
                    dataForComparisonYear[month]++;
                } else if (date.getFullYear() === Number(comparisonYear)) {
                    let index = date.getDate();
                    for (let m = 0; m < month; m++) {
                        index += daysInMonth(month, 0)
                    }
                    index = index / step | 0
                    dataForComparisonYear[index]++;
                }
            });
        }

        const dataset = [{
            label: `Observatii ${year}`,
            data: dataForYear,
            fill: false,
            borderColor: '#ff7e32',
            backgroundColor: '#ff7e32',
            tension: 0.1
        }];

        if (period === 'PERIOD') {
            dataset.push({
                label: `Observatii ${comparisonYear}`,
                data: dataForComparisonYear,
                fill: false,
                borderColor: '#02b83c',
                backgroundColor: '#02b83c',
                tension: 0.1
            })
        }
        return {
            labels,
            datasets: dataset
        };
    };

    const chartData = processObservations(observations, period);


    return <Bar data={chartData}
                width={100}
                options={{maintainAspectRatio: false}}/>
};

export default ObservationsChart
