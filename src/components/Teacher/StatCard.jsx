import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const palette = {
  primary: {
    bg: 'linear-gradient(135deg,rgba(59,130,246,0.12),rgba(99,102,241,0.06))',
    border: 'rgba(59,130,246,0.2)',
    icon: 'linear-gradient(135deg,#3b82f6,#6366f1)',
    value: '#1e3a5f',
  },
  success: {
    bg: 'linear-gradient(135deg,rgba(16,185,129,0.12),rgba(5,150,105,0.06))',
    border: 'rgba(16,185,129,0.2)',
    icon: 'linear-gradient(135deg,#10b981,#059669)',
    value: '#064e3b',
  },
  accent: {
    bg: 'linear-gradient(135deg,rgba(139,92,246,0.12),rgba(168,85,247,0.06))',
    border: 'rgba(139,92,246,0.2)',
    icon: 'linear-gradient(135deg,#8b5cf6,#a855f7)',
    value: '#3b0764',
  },
  warning: {
    bg: 'linear-gradient(135deg,rgba(245,158,11,0.12),rgba(234,179,8,0.06))',
    border: 'rgba(245,158,11,0.2)',
    icon: 'linear-gradient(135deg,#f59e0b,#eab308)',
    value: '#451a03',
  },
  default: {
    bg: 'linear-gradient(135deg,rgba(100,116,139,0.10),rgba(148,163,184,0.06))',
    border: 'rgba(100,116,139,0.2)',
    icon: 'linear-gradient(135deg,#64748b,#94a3b8)',
    value: '#1e293b',
  },
}

export default function StatCard({ title, value, icon: Icon, trend, variant = 'default' }) {
  const p = palette[variant] || palette.default

  const TrendIcon = !trend
    ? null
    : trend.value === 0
    ? Minus
    : trend.isPositive
    ? TrendingUp
    : TrendingDown

  const trendColor = !trend
    ? ''
    : trend.value === 0
    ? '#64748b'
    : trend.isPositive
    ? '#10b981'
    : '#ef4444'

  return (
    <div
      className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: p.bg,
        border: `1.5px solid ${p.border}`,
        boxShadow: '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
        backdropFilter: 'blur(8px)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)'
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold tracking-wide uppercase" style={{ color: '#64748b', letterSpacing: '0.05em' }}>
            {title}
          </p>
          <p className="text-3xl font-bold mt-2 tracking-tight" style={{ color: p.value }}>
            {value}
          </p>
          {trend && TrendIcon && (
            <div className="flex items-center gap-1.5 mt-3">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold"
                style={{
                  background: trend.isPositive
                    ? 'rgba(16,185,129,0.1)'
                    : trend.value === 0
                    ? 'rgba(100,116,139,0.1)'
                    : 'rgba(239,68,68,0.1)',
                  color: trendColor,
                }}
              >
                <TrendIcon className="w-3 h-3" />
                {Math.abs(trend.value)}%
              </div>
              <span className="text-xs" style={{ color: '#94a3b8' }}>vs last month</span>
            </div>
          )}
        </div>
        <div
          className="w-13 h-13 rounded-2xl flex items-center justify-center shrink-0 ml-4"
          style={{ background: p.icon, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', width: '52px', height: '52px' }}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )
}
