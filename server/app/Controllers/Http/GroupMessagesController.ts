import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GroupMessage from 'App/Models/GroupMessage'

export default class GroupMessagesController {
  public async index({ params }: HttpContextContract) {
    const groupId = params.groupId
    const messages = await GroupMessage.query().where('group_id', groupId).preload('sender')
    return messages
  }

  public async create({ request, auth, params }: HttpContextContract) {
    const groupId = params.groupId
    const user = auth.user
    const messageData = request.only(['messageType', 'message', 'messageStatus'])

    const message = new GroupMessage()
    message.groupId = groupId
    message.senderId = user?.id as number
    message.messageType = messageData.messageType
    message.message = messageData.message
    message.messageStatus = messageData.messageStatus

    await message.save()

    return message
  }
}
