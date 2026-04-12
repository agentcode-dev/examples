import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'task_labels'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('task_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('tasks')
        .onDelete('CASCADE')
      table
        .integer('label_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('labels')
        .onDelete('CASCADE')
      table.timestamp('created_at').nullable()

      table.primary(['task_id', 'label_id'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
