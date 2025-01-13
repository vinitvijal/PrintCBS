import { Printer } from 'lucide-react'

export function Logo() {
  return (
    <div className="flex items-center space-x-2">
      <Printer className="h-8 w-8 text-blue-600" />
      <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
        PrintCBS
      </span>
    </div>
  )
}
