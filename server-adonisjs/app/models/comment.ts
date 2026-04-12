import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import { randomUUID } from 'node:crypto'
import Task from '#models/task'
import User from '#models/user'

export default class Comment extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare taskId: number

  @column()
  declare userId: number

  @column()
  declare body: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @beforeCreate()
  static assignUuid(comment: Comment) {
    if (!comment.id) {
      comment.id = randomUUID()
    }
  }

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
