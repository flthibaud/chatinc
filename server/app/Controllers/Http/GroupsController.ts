import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateGroupValidator from 'App/Validators/Group/CreateGroupValidator'
import Group from 'App/Models/Group'
import GroupMember from 'App/Models/GroupMember'

export default class GroupController {
  public async index({ auth }: HttpContextContract) {
    const user = auth.user
    const groups = await Group.query().whereHas('members', (query) => {
      query.where('user_id', user?.id as number)
    })
    return groups
  }

  public async create({ request, auth, response }: HttpContextContract) {
    const validation = await request.validate(CreateGroupValidator)
    const user = auth.user
    const groupName = validation.name

    // Vérifier si un groupe avec le même nom existe déjà pour cet utilisateur
    const existingGroup = await Group.query()
      .where('name', groupName)
      .where('creator_id', user?.id as number)
      .first()
    if (existingGroup) {
      return response.badRequest('You have already created a group with this name.')
    }

    const group = new Group()
    group.name = groupName
    group.creatorId = user?.id as number

    await group.save()

    // Ajouter le créateur comme membre du groupe
    const groupMember = new GroupMember()
    groupMember.groupId = group.id
    groupMember.userId = user?.id as number

    await groupMember.save()

    return group
  }

  public async delete({ params, auth, response }: HttpContextContract) {
    const groupId = params.groupId
    const user = auth.user

    const group = await Group.findOrFail(groupId)

    // Vérifiez si l'utilisateur actuel est le créateur du groupe
    if (group.creatorId !== user?.id) {
      return response.forbidden('Only the group creator can delete the group.')
    }

    await GroupMember.query().where('group_id', groupId).delete()

    await group.delete()

    return { message: 'Group deleted successfully' }
  }
}
