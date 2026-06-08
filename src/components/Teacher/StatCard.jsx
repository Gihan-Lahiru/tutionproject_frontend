import { cn } from "../../lib/utils";

export default function StatCard({ title, value, icon: Icon, trend, variant = "default" }) {
  const variants = {
    default: "bg-white",
    primary: "bg-white",
    accent: "bg-white",
    warning: "bg-white",
    success: "bg-white",
  };

  const iconVariants = {
    default: "bg-gray-100 text-primary",
    primary: "bg-gray-100 text-primary",
    accent: "bg-gray-100 text-primary",
    warning: "bg-gray-100 text-primary",
    success: "bg-gray-100 text-primary",
  };

  return (
    <div
      className={cn(
        "p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1",
        variants[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">
            {title}
          </p>
          <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-2 flex items-center gap-1",
              trend.value === 0 ? "text-gray-500" : (trend.isPositive ? "text-primary" : "text-gray-500")
            )}>
              {trend.value === 0 ? "→" : (trend.isPositive ? "↑" : "↓")} {Math.abs(trend.value)}%
              <span className="opacity-70">vs last month</span>
            </p>
          )}
        </div>
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", iconVariants[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
