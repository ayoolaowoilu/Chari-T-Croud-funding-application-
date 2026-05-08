


const StatCard:React.FC< { title: string; value: string; trend: string }> =({ title, value, trend }) => {
  const isPositive = trend.startsWith("+");
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {trend}
        </span>
      </div>
    </div>
  );
}

export default StatCard;