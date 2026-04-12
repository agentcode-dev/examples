import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Organization from '#models/organization'
import Task from '#models/task'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare organizationId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare status: string

  @column()
  declare budget: number | null

  @column()
  declare internalNotes: string | null

  @column()
  declare startsAt: string | null

  @column()
  declare endsAt: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @column.dateTime()
  declare deletedAt: DateTime | null

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>

  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>
}
