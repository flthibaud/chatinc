// app/Controllers/Http/ImageController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class ImageController {
  public async show({ params, response }: HttpContextContract) {
    const filePath = Application.tmpPath('uploads/images', params.filename)
    return response.download(filePath)
  }
}
