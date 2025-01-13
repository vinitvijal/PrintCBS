import { ReceiveCodeForm } from '@/components/receive'
import { Logo } from '@/components/ui/logo'

export default function ReceivePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Enter Receive Code
          </h1>
          <ReceiveCodeForm />
        </div>
      </main>
    </div>
  )
}
