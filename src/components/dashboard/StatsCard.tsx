// src/components/dashboard/StatsCard.tsx
interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
  }
  
  const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
    return (
      <div className="bg-white shadow rounded-xl p-6 w-full sm:w-64">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-gray-600 text-sm font-medium">{title}</h4>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
          </div>
          {icon && <div className="text-blue-500">{icon}</div>}
        </div>
      </div>
    );
  };
  
  export default StatsCard;
  