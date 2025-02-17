import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan 17', price: 1200 },
  { date: 'Jan 24', price: 2200 },
  { date: 'Feb 4', price: 2700 },
  { date: 'Feb 11', price: 1500 },
  { date: 'Feb 17', price: 1700 },
  { date: 'Feb 24', price: 1700 },
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
        {/* <Legend /> */}
        <Line type="monotone" dataKey="price" stroke="#578E7E" />
      </LineChart>
    </ResponsiveContainer>
    <p style={{textAlign: 'center', color: 'gray'}}><i>Price Over Time (Week)</i></p>
    </>
  );
}