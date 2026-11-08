import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const themeVariants = {
  primary: {
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
    accentBorder: 'hover:border-blue-400',
  },
  success: {
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
    accentBorder: 'hover:border-emerald-400',
  },
  accent: {
    iconBg: 'bg-indigo-50 text-indigo-600 border border-indigo-100',
    accentBorder: 'hover:border-indigo-400',
  },
  warning: {
    iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
    accentBorder: 'hover:border-amber-400',
  },
  default: {
    iconBg: 'bg-slate-100 text-slate-600 border border-slate-200',
    accentBorder: 'hover:border-slate-400',
  },
}

export default function StatCard({ title, value, icon: Icon, trend, variant = 'default' }) {
  const t = themeVariants[variant] || themeVariants.default

  const TrendIcon = !trend
    ? null
    : trend.value === 0
    ? Minus
    : trend.isPositive
    ? TrendingUp
    : TrendingDown

  return (
    <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-md ${t.accentBorder} transition-all duration-200 flex flex-col justify-between`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            {value}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${t.iconBg} shadow-xs`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {trend && TrendIcon ? (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
              trend.isPositive
                ? 'bg-emerald-50 text-emerald-700'
                : trend.value === 0
                ? 'bg-slate-100 text-slate-600'
                : 'bg-rose-50 text-rose-700'
            }`}
          >
            <TrendIcon className="w-3 h-3" />
            {Math.abs(trend.value)}%
          </span>
          <span className="text-slate-400 font-medium">vs last month</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Updated live</span>
        </div>
      )}
    </div>
  )
}
