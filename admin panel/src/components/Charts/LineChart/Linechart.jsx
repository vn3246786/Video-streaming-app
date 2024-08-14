import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import "./linechart.scss"






const Linechart = ({data}) => {
 
  return (
    <ResponsiveContainer  className="ResponsiveContainer"  width="90%" height={300}>
    <LineChart 
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid  strokeDasharray="3 3" />
      <XAxis dataKey="Month"  />
      <YAxis  />
      <Tooltip />
      <Legend />
      <Line type="monotone"  dataKey="Total" stroke="#8884d8" activeDot={{ r: 8 }} />
    </LineChart>
  </ResponsiveContainer>
  )
}

export default Linechart
