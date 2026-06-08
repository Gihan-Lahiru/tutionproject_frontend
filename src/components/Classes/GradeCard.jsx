import { FiBookOpen, FiArrowRight, FiStar } from 'react-icons/fi';

const GradeCard = ({
  grade,
  description,
  topicCount,
  topics,
  index,
  onClick,
  isHighlighted = false
}) => {
  return (
    <div
      className={`group w-full rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer ${
        isHighlighted
          ? 'bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-400 shadow-lg hover:shadow-2xl hover:border-purple-500'
          : 'bg-white border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-300'
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
      onClick={onClick}
    >
      {isHighlighted && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 flex items-center justify-center gap-2">
          <FiStar className="w-4 h-4 text-white fill-white" />
          <span className="text-white text-xs font-bold uppercase tracking-wide">Featured</span>
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${
                  isHighlighted
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500'
                    : 'bg-gradient-to-br from-blue-600 to-cyan-500'
                }`}
              >
                <FiBookOpen className="w-5 h-5 text-white" />
              </div>
              <h3
                className={`text-xl font-bold transition-colors ${
                  isHighlighted
                    ? 'text-purple-900 group-hover:text-purple-700'
                    : 'text-gray-900 group-hover:text-blue-600'
                }`}
              >
                {grade}
              </h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              {description}
            </p>
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-colors ${
                isHighlighted
                  ? 'bg-purple-100 text-purple-700 group-hover:bg-purple-200'
                  : 'bg-blue-50 text-blue-700 group-hover:bg-blue-100'
              }`}
            >
              {topicCount > 0 ? `${topicCount} Topics` : 'Coming Soon'}
              <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCard;


