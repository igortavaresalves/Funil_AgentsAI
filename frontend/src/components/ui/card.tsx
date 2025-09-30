import React from 'react'

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...rest }) => {
  return (
  <div className={`rounded-lg ${className}`} {...rest}>
  {children}
  </div>
  )
}

export default Card
