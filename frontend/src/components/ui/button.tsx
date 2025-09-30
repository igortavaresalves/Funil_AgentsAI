import React from 'react'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default'|'outline' }

export const Button: React.FC<Props> = ({ children, className = '', variant = 'default', ...rest }) => {
  const base = 'inline-flex items-center justify-center rounded-md'
  const variantClass = variant === 'outline' ? 'bg-transparent border' : ''
  return (
    <button className={`${base} ${variantClass} ${className}`} {...rest}>{children}</button>
  )
}

export default Button
