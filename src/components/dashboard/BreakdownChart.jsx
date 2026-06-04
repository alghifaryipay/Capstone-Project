import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const data = [
  { name: "AC", value: 40 },
  { name: "TV", value: 20 },
  { name: "Lamp", value: 15 },
  { name: "Kitchen", value: 25 },
];

const COLORS = [
  "#2563eb",
  "#60a5fa",
  "#93c5fd",
  "#bfdbfe",
];

function BreakdownChart() {
  return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">
        Device Breakdown
      </h2>

      <ResponsiveContainer
        width="100%"
        height={250}
      >
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={60}
            outerRadius={90}
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BreakdownChart;