'use server'
import { PrismaClient } from '@prisma/client'
import { ClientUploadedFileData } from 'uploadthing/types'
import { UTApi } from "uploadthing/server";


const utapi = new UTApi();
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

  try {
    await utapi.deleteFiles([fileId]);
    console.log("UTAPI: Files deleted successfully");
  } catch (error) {
    console.error("UTAPI: Error deleting files", error);
  }
}

export async function olderFilesDelete(){
    const files = await prisma.files.findMany({
        where: {
            createdAt: {
                lte: new Date(new Date().getTime() - 60 * 60 * 1000) // 1 hour ago
            }
        }, 
        select: {
            key: true
        }
    })
    try {
        await utapi.deleteFiles(files.map(file => file.key));
        console.log(`Files deleted successfully for ${new Date().getTime() - 60 * 60 * 1000}`);
      } catch (error) {
        console.error("UTAPI: Error deleting files", error);
      }
    console.log(files)
    return files
}

