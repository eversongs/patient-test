import { Typography } from '@material-ui/core';
import { height } from '@material-ui/system';
import React from 'react'
import { PieChart } from 'react-minimal-pie-chart';

interface Prop {
    title: string;
    data: ChartData[];
}

export interface ChartData {
    title: string;
    value: number;
    color: string;
}

export default function AppPieChart(prop: Prop) {

    return (
        <>
            <Typography>{prop.title}</Typography>
            <div style={{ height: '200px' }}>
                <PieChart
                    labelStyle={{ fontSize: 8 }}
                    data={prop.data}
                    label={({ dataEntry }) => `${dataEntry.title}  ${dataEntry.value}`}
                />
            </div>
        </>
    )
}
