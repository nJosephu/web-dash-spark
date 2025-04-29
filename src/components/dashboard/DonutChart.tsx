
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
    <div className="p-1">
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2 h-48 md:h-auto flex items-center justify-center">
          <ResponsiveContainer width="100%" height={200}>
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
        
        <div className="md:w-1/2 space-y-5 py-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full">
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
    </div>
  );
};

export default DonutChart;
