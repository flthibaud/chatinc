import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email', 250).notNullable().unique()
      table.string('password').nullable() // Password can be nullable for OAuth users
      table.string('avatar').nullable()
      table.string('username', 250).nullable().unique()
      table.string('first_name').nullable()
      table.string('last_name').nullable()
      table.string('about', 255).nullable()
      table.enum('status', ['online', 'offline', 'away']).defaultTo('offline')
      table.timestamp('last_seen', { useTz: true }).nullable()
      table.boolean('receive_notifications').defaultTo(true)
      table.string('remember_me_token').nullable()
      table.string('provider').nullable() // For OAuth; e.g., 'google', 'facebook', null for local
      table.string('provider_id').nullable()

      // Soft deletes
      table.timestamp('deleted_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
