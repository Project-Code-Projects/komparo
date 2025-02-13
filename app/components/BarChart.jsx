import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { price: 10, nop: 400 },
  { price: 20, nop: 300 },
  { price: 30, nop: 200 },
  { price: 40, nop: 278 },
];

export default function BarChartGraph() {
  
  function CustomTooltip({ payload, label, active }) {
    if (active) {
      return (
        <p style={{backgroundColor: 'white', padding: '8px'}}>
          <span>{`Price: ${label}`}</span><br /><span>{`NOP: ${payload[0].value}`}</span>
        </p>
      );
    }
  
    return null;
  }
  return (
    <>
        <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} barSize={40}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="price" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="nop" fill="#8884d8" />
    </BarChart>
  </ResponsiveContainer>
  <p style={{textAlign: 'center'}}>Graph : Representation of price vs number of sold products(NOP).</p>
    </>
  );
}