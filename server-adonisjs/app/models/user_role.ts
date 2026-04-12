import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Role from '#models/role'
import Organization from '#models/organization'

export default class UserRole extends BaseModel {
  static table = 'user_roles'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare roleId: number

  @column()
  declare organizationId: number

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
    consume: (value: string) => {
      if (typeof value === 'string') {
        return JSON.parse(value)
      }
      return value
    },
  })
  declare permissions: string[]

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Role)
  declare role: BelongsTo<typeof Role>

  @belongsTo(() => Organization)
  declare organization: BelongsTo<typeof Organization>
}
