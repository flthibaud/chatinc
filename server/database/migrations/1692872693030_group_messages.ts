import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'group_messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('group_id').unsigned().references('id').inTable('groups').onDelete('CASCADE')
      table.integer('sender_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.enum('message_type', ['text', 'image', 'video', 'audio']).defaultTo('text')
      table.text('message').notNullable()
      table.enum('message_status', ['sent', 'delivered', 'read']).defaultTo('sent')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true }) // Soft deletes

      // Indexes for better performance on common queries
      table.index('group_id')
      table.index('sender_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
