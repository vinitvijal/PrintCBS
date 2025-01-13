'use server'
import { PrismaClient } from '@prisma/client'
import { ClientUploadedFileData } from 'uploadthing/types'

const prisma = new PrismaClient()


export async function uploadFiles(res: ClientUploadedFileData<null>[], bucketCode: string) {
  const room = await prisma.room.findFirst({
    where: {
      roomCode: bucketCode
    }
  })
  
  if(room) {
    await prisma.room.update({
        where: {
            id: room.id
        },
        data: {
            fileNumber: room.fileNumber + res.length
        }
    })
  }else{ 
      await prisma.room.create({
          data: {
              roomCode: bucketCode,
              fileNumber: res.length,
            }
        })
    }

  const files = res.map((file) => {
    return {
      key: file.key, 
      roomCode: bucketCode,
      fileHash: file.fileHash,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: file.url,
    }
  })

    await prisma.files.createMany({
        data: files
    })

    return bucketCode
}


export async function getFiles(code: string) {
  const files = await prisma.files.findMany({
    where: {
      roomCode: code
    }
  })

  return files
}

export async function deleteFile(fileId: string) {
  await prisma.files.delete({
    where: {
      key: fileId
    }
  })
}