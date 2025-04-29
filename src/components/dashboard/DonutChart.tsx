
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface DonutChartProps {
  data: {
    name: string;
    value: number;
    color: string;
    percentage: number;
  }[];
  title: string;
}

const DonutChart = ({ data, title }: DonutChartProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow h-full">
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">{item.name}</span>
              </div>
              <span className="text-xs text-gray-500">{item.percentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${item.percentage}%`,
                  backgroundColor: item.color 
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
