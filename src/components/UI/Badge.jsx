export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-500 text-white',
    warning: 'bg-yellow-500 text-white',
    destructive: 'bg-red-500 text-white',
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
