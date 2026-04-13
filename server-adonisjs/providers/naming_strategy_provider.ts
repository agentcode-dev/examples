import type { ApplicationService } from '@adonisjs/core/types'

export default class NamingStrategyProvider {
  constructor(protected app: ApplicationService) {}

  async boot() {
    const { BaseModel } = await import('@adonisjs/lucid/orm')
    const { SnakeCaseNamingStrategy } = await import('@adonisjs/lucid/orm')
    BaseModel.namingStrategy = new SnakeCaseNamingStrategy()
  }
}
