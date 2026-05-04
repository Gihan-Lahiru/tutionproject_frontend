import { useState, useEffect, useRef } from 'react'

const Counter = ({ end, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const counterRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 }
    )

    if (counterRef.current) {
      observer.observe(counterRef.current)
    }

    return () => {
      if (counterRef.current) {
        observer.unobserve(counterRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!isVisible) {
      setCount(0)
      return
    }

    const endValue = typeof end === 'string' ? parseInt(end) : end
    const startTime = Date.now()
    const endTime = startTime + duration

    const timer = setInterval(() => {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)
      const currentCount = Math.floor(progress * endValue)
      
      setCount(currentCount)

      if (now >= endTime) {
        setCount(endValue)
        clearInterval(timer)
      }
    }, 16)

    return () => clearInterval(timer)
  }, [isVisible, end, duration])

  return <span ref={counterRef}>{count}{suffix}</span>
}

export default Counter
