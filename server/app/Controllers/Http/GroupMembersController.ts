import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GroupMember from 'App/Models/GroupMember'

export default class GroupMemberController {
  public async index({ params }: HttpContextContract) {
    const groupId = params.groupId
    const members = await GroupMember.query().where('group_id', groupId).preload('user')
    return members
  }

  public async create({ request, params, response }: HttpContextContract) {
    const groupId = params.groupId
    const userId = request.input('userId')

    const existingMember = await GroupMember.query()
      .where('group_id', groupId)
      .where('user_id', userId)
      .first()
    if (existingMember) {
      return response.badRequest('User is already a member of this group')
    }

    const member = new GroupMember()
    member.groupId = groupId
    member.userId = userId

    await member.save()

    return member
  }

  public async delete({ params }: HttpContextContract) {
    const memberId = params.id
    const member = await GroupMember.findOrFail(memberId)
    await member.delete()

    return { message: 'Member removed from group' }
  }
}
