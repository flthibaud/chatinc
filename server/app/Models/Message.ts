import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'

import User from './User'

export default class Message extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public senderId: number

  @column()
  public receiverId: number

  @column()
  public messageType: string

  @column()
  public message: string

  @column()
  public messageStatus: string

  @belongsTo(() => User, {
    foreignKey: 'senderId',
  })
  public sender: BelongsTo<typeof User>

  @belongsTo(() => User, {
    foreignKey: 'receiverId',
  })
  public receiver: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({ autoCreate: false })
  public deletedAt: DateTime
}
