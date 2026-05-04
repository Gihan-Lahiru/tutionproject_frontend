const SubjectTicker = () => {
  const text = 'O/L Science * A/L Biology * A/L Chemistry * Theory * Revision * Paper Classes * '
  
  return (
    <div
      className="w-full py-12 bg-gradient-to-r from-green-500 to-green-600 overflow-hidden my-0"
      style={{ position: 'relative', zIndex: 9999, minHeight: '120px' }}
      aria-label="Subjects ticker"
    >
      <div 
        className="flex whitespace-nowrap"
        style={{ 
          animation: 'scrollLeft 25s linear infinite',
          minWidth: 'max-content'
        }}
      >
        {[...Array(10)].map((_, i) => (
          <span 
            key={i} 
            className="text-white font-extrabold text-3xl mx-12"
            aria-hidden={i > 0}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SubjectTicker
