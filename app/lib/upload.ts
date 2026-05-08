
'use server'

import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File
  
  if (!file) throw new Error('No file provided')
  
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  
  const result: any = await new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { 
        folder: 'cause_uploads',
        resource_type: 'auto',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result)
      }
    ).end(buffer)
  })
  
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
  }
}