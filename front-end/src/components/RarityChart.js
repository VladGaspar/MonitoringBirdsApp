import React from "react";
import {Pie} from "react-chartjs-2";
import {ArcElement, Chart as ChartJS, Legend, Tooltip} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RarityChart({content}) {
    const data = {
        labels: ['Foarte Comun', 'Comun', 'Rar'],
        datasets: [
            {
                backgroundColor: [
                    "#43ce11",
                    "#329cf6",
                    "#a4008b",
                ],
                borderColor: "rgb(68,68,68)",
                data: content,
            },
        ]
    }

    return <Pie data={data}/>
}