'use client'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Send, Download, FileText, Lock, Zap } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { useEffect, useState } from 'react'

export default function Home() {
  const [fileCount, setFileCount] = useState(0)
  const [targetCount, setTargetCount] = useState(0)
    
  useEffect(() => {
    async function fetchCount() {
      const response = await fetch('/api/stats', { next: { revalidate: 3600}})
      const data = await response.json()
      console.log(data)
      setTargetCount(data.res._sum.fileNumber)
    }
    fetchCount() 
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFileCount(prevCount => {
        const nextCount = prevCount + Math.floor(Math.random() * 10) + 1
        return nextCount >= targetCount ? targetCount : nextCount
      })
    }, 50)

    return () => clearInterval(interval)
  }, [targetCount])


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto">
          <Logo />
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Seamless File Sharing
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-gray-600">
            Share files instantly without login or authentication. Fast, secure, and simple.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/send">
                <Send className="mr-2 h-5 w-5" /> Send Files
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-purple-600 text-purple-600 hover:bg-purple-50">
              <Link href="/receive">
                <Download className="mr-2 h-5 w-5" /> Receive Files
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <FeatureCard
            icon={<FileText className="h-10 w-10 text-blue-600" />}
            title="Any File Type"
            description="Share documents, images, videos, and more with ease."
          />
          <FeatureCard
            icon={<Lock className="h-10 w-10 text-purple-600" />}
            title="Secure Sharing"
            description="Your files are encrypted and protected during transfer."
          />
          <FeatureCard
            icon={<Zap className="h-10 w-10 text-yellow-500" />}
            title="Lightning Fast"
            description="Upload and download files at blazing speeds."
          />
        </div>
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Trusted by Users Worldwide
          </h2>
          <div className="bg-white rounded-lg shadow-lg p-8 inline-block">
            <p className="text-gray-600 mb-2">Total Files Shared</p>
            <div
              className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
            >
              {fileCount.toLocaleString()}
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto text-center text-gray-600">
          &copy; 2025 PrintCBS. All rights reserved. Made with ❤️ by Vinu.
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center flex-col flex items-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
