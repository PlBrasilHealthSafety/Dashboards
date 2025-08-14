import React, { ImgHTMLAttributes, HTMLAttributes, ReactNode } from 'react'

export function Avatar({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={"relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-gray-200 " + className}>
      {children}
    </div>
  )
}

export function AvatarImage(props: ImgHTMLAttributes<HTMLImageElement>) {
  const { className = '', alt = 'Avatar', ...rest } = props
  return <img className={"h-full w-full object-cover " + className} alt={alt} {...rest} />
}

export function AvatarFallback({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={"absolute inset-0 flex items-center justify-center text-gray-600 " + className}>
      {children}
    </div>
  )
}


