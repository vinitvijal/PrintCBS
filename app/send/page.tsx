'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { X, Upload, File } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export default function SendPage() {
  const [files, setFiles] = useState<File[]>([])
  const [bucketCode, setBucketCode] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prev => [...prev, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const removeFile = (file: File) => {
    setFiles(prev => prev.filter(f => f !== file))
  }

  const handleUpload = async () => {
    setIsUploading(true)
    setUploadProgress(0)
    // Simulating upload process
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    // Generate a random bucket code
    const newBucketCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setBucketCode(newBucketCode)
    setIsUploading(false)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-white to-purple-100">
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          {bucketCode && (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
              Bucket Code: {bucketCode}
            </div>
          )}
        </div>
      </header>
      <main className="flex-grow container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              Send Files
            </h2>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <input {...getInputProps()} />
              <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              {isDragActive ? (
                <p className="text-blue-500">Drop the files here ...</p>
              ) : (
                <p className="text-gray-500">Drag 'n' drop some files here, or click to select files</p>
              )}
            </div>
            {files.length > 0 && (
              <ul className="mt-6 space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                    <span className="font-medium text-gray-700">{file.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(file)}>
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
            <Button
              className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={handleUpload}
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Files'}
              {!isUploading && <Upload className="ml-2 h-4 w-4" />}
            </Button>
            {isUploading && (
              <Progress value={uploadProgress} className="mt-4" />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

