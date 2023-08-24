// app/Models/GroupMember.ts

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Group from 'App/Models/Group'

export default class GroupMember extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public groupId: number

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public joinedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>
}
