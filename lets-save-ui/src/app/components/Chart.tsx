"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const data = [
  { day: "M", value: 20 },
  { day: "T", value: 40 },
  { day: "W", value: 10 },
  { day: "TH", value: 60 },
  { day: "F", value: 30 },
  { day: "S", value: 80 },
  { day: "SUN", value: 50 },
];

export default function Chart() {
  return (
    <BarChart width={500} height={250} data={data}>
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value" />
    </BarChart>
  );
}