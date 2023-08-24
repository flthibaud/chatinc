// app/Middleware/IsGroupMember.ts

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'
import GroupMember from 'App/Models/GroupMember'

export default class IsGroupMember {
  public async handle({ auth, params, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user
    const groupId = params.groupId

    const isMember = await GroupMember.query()
      .where('group_id', groupId)
      .where('user_id', user?.id as number)
      .first()
    const isCreator = await Group.query()
      .where('id', groupId)
      .where('creator_id', user?.id as number)
      .first()

    if (!isMember && !isCreator) {
      return response.forbidden('You are not a member of this group or the group creator.')
    }

    await next()
  }
}
