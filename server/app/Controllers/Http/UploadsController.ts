// app/Controllers/Http/UploadsController.ts
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

export default class UploadsController {
  public async getImage({ params, response }: HttpContextContract) {
    const filePath = Application.tmpPath('uploads/images', params.filename)
    return response.download(filePath)
  }

  public async getAudio({ params, response }: HttpContextContract) {
    const filePath = Application.tmpPath('uploads/audios', params.filename)
    return response.download(filePath)
  }
}
