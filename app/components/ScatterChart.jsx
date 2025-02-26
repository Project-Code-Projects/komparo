import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { x: 100, y: 200, z: 200 },
  { x: 120, y: 100, z: 200 },
  { x: 170, y: 300, z: 200 },
  { x: 140, y: 250, z: 200 },
  { x: 150, y: 400, z: 200 },
  { x: 110, y: 280, z: 800 },
];

const data_2 = [
  { x: 100, y: 400, z: 200 },
];

const ScatterChartGraph = ({ graphData }) => {
  const newGraphData = [];
  graphData.forEach(x => {
    const arr = new Date(x.dataDate).toString().split(' ');
    newGraphData.push({ dataDate: arr[1] + ' ' + arr[2] + ' ' + arr[4], dataPrice: x.dataPrice, dataNOP: x.dataNOP});
  });
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart
        margin={{
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        }}
      >
        <CartesianGrid />
        <XAxis dataKey="x" name="stature" />
        <YAxis type="number" dataKey="y" name="weight" />
        <ZAxis dataKey="z" type="number" range={[10, 500]} name="score" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Scatter name="A school" data={data} fill="#8884d8" />
        <Scatter name="B school" data={data_2} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterChartGraph;
