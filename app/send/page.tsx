'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Logo } from '@/components/ui/logo'
import { UploadDropzone } from '@/utils/uploadthing'
import { ClientUploadedFileData } from 'uploadthing/types'
import { uploadFiles } from '@/server/action'

export default function SendPage() {
  const [files, setFiles] = useState<ClientUploadedFileData<null>[]>([])
  const [bucketCode, setBucketCode] = useState('')


  const handleUpload = async (res: ClientUploadedFileData<null>[]) => {
     const response = await uploadFiles(res, bucketCode)
      console.log(response)
  }

  useEffect(() => {
    const newBucketCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    setBucketCode(newBucketCode)
  }, [])

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
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                true ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
              }`}
            >
              <UploadDropzone
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  // Do something with the response
                  setFiles((prev) => [...prev, ...res]);
                  handleUpload(res)
                  alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                  // Do something with the error.
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
            {files.length > 0 && (
              <ul className="mt-6 space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-white p-3 rounded-lg shadow">
                    <span className="font-medium text-gray-700">{file.name}</span>
                  </li>
                ))}
              </ul>
            )}
            
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

