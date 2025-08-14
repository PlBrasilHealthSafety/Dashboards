import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
  HTMLAttributes,
  isValidElement,
  cloneElement,
} from 'react'

type DropdownMenuContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null)

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger(
  props: { asChild?: boolean; children: ReactNode } & HTMLAttributes<HTMLButtonElement>
) {
  const ctx = useContext(DropdownMenuContext)
  if (!ctx) return null
  const { open, setOpen } = ctx
  const { asChild, children, className = '', ...rest } = props

  const onClick = (e: React.MouseEvent) => {
    rest.onClick?.(e)
    setOpen(!open)
  }

  if (asChild && isValidElement(children)) {
    return cloneElement(children as any, {
      onClick,
      'aria-haspopup': true,
      'aria-expanded': open,
      className,
    })
  }

  return (
    <button
      type="button"
      aria-haspopup
      aria-expanded={open}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </button>
  )
}

export function DropdownMenuContent({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ctx = useContext(DropdownMenuContext)
  const ref = useRef<HTMLDivElement | null>(null)
  if (!ctx) return null
  const { open, setOpen } = ctx

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      role="menu"
      className={
        'absolute right-0 mt-2 min-w-[12rem] origin-top-right rounded-md border bg-white p-1 shadow-lg focus:outline-none ' +
        className
      }
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) {
  const ctx = useContext(DropdownMenuContext)
  const handleClick = () => {
    onClick?.()
    ctx?.setOpen(false)
  }
  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={handleClick}
      className={
        'cursor-pointer select-none rounded-sm px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 ' +
        className
      }
    >
      {children}
    </div>
  )
}


