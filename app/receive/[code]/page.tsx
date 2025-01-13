'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, Trash2, Search, Loader } from 'lucide-react'
import { Logo } from '@/components/ui/logo'
import { Files } from '@prisma/client'
import { deleteFile, getFiles } from '@/server/action'
import { toast } from 'sonner'


export default function ReceiveFilesPage() {
  const params = useParams()
  const code = params.code as string
  const router = useRouter();

  const [files, setFiles] = useState<Files[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState("")

  useEffect(() => {
    const fetchFiles = async () => {
      setIsLoading(true)
      const response = await getFiles(code)
      if(!response){
        router.replace('/receive')
        return
      }
      setFiles(response)
      setIsLoading(false)
    }

    fetchFiles()
  }, [code])

  const handleDownload = (key: string) => {
    setIsDownloading(key)

    setTimeout(() => {
      setIsDownloading("")
    }, 2000)

    setIsDownloading("")
    // fetchFile(key)
    console.log(`Downloading file with id: ${key}`)
  }

  const handleDelete = async (fileId: string) => {
    setFiles(prev => prev.filter(file => file.key !== fileId))
    await deleteFile(fileId)
    toast.success('File deleted successfully')
  }

  const filteredFiles = files.filter(file =>
    file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold">
            Code: {code}
          </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Received Files
            </h2>
            {isLoading ? (
              <div className="text-center text-gray-500">Loading files...</div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search files..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {filteredFiles.length === 0 ? (
                  <p className="text-center text-gray-500">No files available</p>
                ) : (
                  <ul className="space-y-4">
                    {filteredFiles.map(file => (
                      <li key={file.key} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                        <div>
                          <p className="font-medium text-gray-800">{file.fileName}</p>
                          <p className="text-sm text-gray-500">{file.fileSize} • {file.fileType}</p>
                        </div>
                        <div className="flex space-x-2">
                          <a href={file.fileUrl} download>
                            <Button size="sm" onClick={() => handleDownload(file.key)} className="bg-blue-600 hover:bg-blue-700">
                              {file.key === isDownloading ? <Loader className=' animate-spin' /> : <Download className="mr-2 h-4 w-4" />} Download
                            </Button>
                          </a>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(file.key)} className="border-red-500 text-red-500 hover:bg-red-50">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

