export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '',
  ...props 
}) {
  const baseClasses = 'rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600',
    secondary: 'bg-secondary text-white hover:bg-purple-600',
    success: 'bg-success text-white hover:bg-green-600',
    danger: 'bg-danger text-white hover:bg-red-600',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  }

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
