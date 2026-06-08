import { FiUsers, FiBookOpen, FiStar, FiBook } from 'react-icons/fi'
import Counter from './Counter'

const StatsSection = () => {
  const stats = [
    { icon: FiUsers, value: 500, suffix: '+', label: 'Students' },
    { icon: FiBookOpen, value: 10, suffix: '+', label: 'Years Experience' },
    { icon: FiStar, value: 95, suffix: '%', label: 'Success Rate' },
    { icon: FiBook, value: 100, suffix: '+', label: 'Top Grades' },
  ]

  return (
    <section className="w-full bg-white pt-12 md:pt-16 pb-8 md:pb-12 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="p-4 md:p-6 rounded-2xl bg-gray-50 shadow border border-gray-100 flex flex-col items-center hover:shadow-lg transition-all">
              <stat.icon className="w-7 h-7 text-orange-500 mb-2" />
              <div className="text-2xl md:text-3xl font-bold text-gray-900">
                <Counter end={stat.value} suffix={stat.suffix} duration={2500} />
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
