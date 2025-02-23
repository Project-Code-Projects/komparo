import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export default function BarChartGraph({dataSet}) {
  // console.log(dataSet);
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
    <div style={{marginRight: '40px'}}>
        <ResponsiveContainer width="100%" height={300}>
    <BarChart data={dataSet} barSize={40}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="price" />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />
      {/* <Legend /> */}
      <Bar dataKey="nop" fill="#578E7E" />
    </BarChart>
  </ResponsiveContainer>
  <p style={{textAlign: 'center', color: 'gray'}}><i>Number of Products Sold (NOP) vs Price</i></p>
    </div>
  );
}