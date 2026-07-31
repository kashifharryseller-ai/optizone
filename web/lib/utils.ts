import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// cn() — merge Tailwind classes with conditional logic (Inspira UI / shadcn-vue
// convention). Used by every ported UI component.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
