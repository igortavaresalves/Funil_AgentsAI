import React from 'react'

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...rest }) => {
  return <input className={`px-3 py-2 rounded-md ${className}`} {...rest} />
}

export default Input
