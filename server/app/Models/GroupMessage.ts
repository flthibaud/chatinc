// app/Models/GroupMessage.ts

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import Group from 'App/Models/Group'

export default class GroupMessage extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public groupId: number

  @column()
  public senderId: number

  @column()
  public messageType: 'text' | 'image' | 'video' | 'audio'

  @column()
  public message: string

  @column()
  public messageStatus: 'sent' | 'delivered' | 'read'

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public sender: BelongsTo<typeof User>

  @belongsTo(() => Group)
  public group: BelongsTo<typeof Group>
}
