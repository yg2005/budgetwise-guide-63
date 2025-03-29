
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ExpenseCategory {
  name: string;
  value: number;
  color: string;
}

interface ExpenseBreakdownCardProps {
  data: ExpenseCategory[];
}

export function ExpenseBreakdownCard({ data }: ExpenseBreakdownCardProps) {
  const total = data.reduce((sum, category) => sum + category.value, 0);

  return (
    <Card className="animate-fade-in card-hover h-full">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [`$${value}`, undefined]}
                labelFormatter={() => ""}
              />
              <Legend
                formatter={(value) => {
                  const item = data.find(d => d.name === value);
                  return `${value} (${((item?.value || 0) / total * 100).toFixed(0)}%)`;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
