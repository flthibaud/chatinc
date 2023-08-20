import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table
        .integer('sender_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('receiver_id')
        .notNullable()
        .unsigned()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')

      table.enum('message_type', ['text', 'image', 'video', 'audio']).defaultTo('text')
      table.text('message').notNullable()
      table.enum('message_status', ['sent', 'delivered', 'read']).defaultTo('sent')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }) // Soft deletes

      // Indexes for better performance on common queries
      table.index('sender_id')
      table.index('receiver_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
