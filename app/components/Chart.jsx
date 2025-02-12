// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   { name: 'Jan', uv: 4000 },
//   { name: 'Feb', uv: 3000 },
//   { name: 'Mar', uv: 2000 },
//   { name: 'Apr', uv: 2780 },
// ];

// export default function ChartComponent() {
//   return (
//     <ResponsiveContainer width='100%' height={300}> 
//       <LineChart data={data}>
//         <CartesianGrid strokeDasharray="3 3" />
//         <XAxis dataKey="name" />
//         <YAxis />
//         <Tooltip />
//         <Legend />
//         <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//       </LineChart>
//     </ResponsiveContainer>
//   );
// }

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   { name: 'Product A', value: 400 },
//   { name: 'Product B', value: 300 },
//   { name: 'Product C', value: 200 },
//   { name: 'Product D', value: 278 },
// ];

// export default function ChartComponent() {
//   return (
//     <div className="w-full h-80">
//       <ResponsiveContainer width="100%" height={300}>
//         <BarChart data={data} barSize={40}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="value" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }

