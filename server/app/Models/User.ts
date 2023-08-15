import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column()
  public username: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public avatar: string

  @column({
    serializeAs: null,
  })
  public password?: string

  @column()
  public rememberMeToken?: string

  @column({
    serializeAs: null,
  })
  public providerId: string

  @column()
  public provider: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
