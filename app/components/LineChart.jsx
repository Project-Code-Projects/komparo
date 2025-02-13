import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Feb 1', price: 4000 },
  { date: 'Feb 2', price: 3000 },
  { date: 'Feb 3', price: 2000 },
  { date: 'Feb 4', price: 2780 },
];

export default function LineChartGraph() {
  
  function CustomTooltip({ payload, label, active }) {
    
    if (active) {
      return (
        <p style={{backgroundColor: 'white', padding: '8px'}}>
          <span>{`Date: ${label}`}</span><br /><span>{`Price: ${payload[0].value}`}</span>
        </p>
      );
    }
  
    return null;
  }
  return (
    <>
        <ResponsiveContainer width='100%' height={300}> 
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="price" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
    <p style={{textAlign: 'center'}}>Graph : Representation of price fluctuation over time.</p>
    </>
  );
}