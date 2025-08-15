import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Determina a rota de redirecionamento baseada no email do usuário
 */
export function getUserRoute(email: string | null): string {
  if (!email) return "/home"
  
  const emailPrefix = email.split("@")[0].toLowerCase()
  
  switch (emailPrefix) {
    case "direcao":
      return "/direcao"
    case "medicina":
      return "/medicina"
    case "comercial":
      return "/comercial"
    default:
      return "/home"
  }
}
