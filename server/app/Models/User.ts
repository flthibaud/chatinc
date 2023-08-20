import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({
    serializeAs: null,
  })
  public password?: string

  @column()
  public avatar: string

  @column()
  public username: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public about: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public lastSeen: DateTime

  @column()
  public receiveNotifications: boolean

  @column()
  public rememberMeToken?: string

  @column()
  public provider: string

  @column({
    serializeAs: null,
  })
  public providerId: string

  @column.dateTime({ autoCreate: false })
  public deletedAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
