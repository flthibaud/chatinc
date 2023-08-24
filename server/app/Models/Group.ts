// app/Models/Group.ts

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import GroupMessage from 'App/Models/GroupMessage'
import GroupMember from 'App/Models/GroupMember'

export default class Group extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public creatorId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => GroupMessage)
  public messages: HasMany<typeof GroupMessage>

  @hasMany(() => GroupMember)
  public members: HasMany<typeof GroupMember>
}
