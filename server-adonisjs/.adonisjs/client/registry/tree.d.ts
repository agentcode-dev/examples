/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  accessToken: {
    store: typeof routes['access_token.store']
    destroy: typeof routes['access_token.destroy']
  }
  resources: {
    trashed: typeof routes['resources.trashed']
    restore: typeof routes['resources.restore']
    forceDelete: typeof routes['resources.force_delete']
    index: typeof routes['resources.index']
    store: typeof routes['resources.store']
    show: typeof routes['resources.show']
    update: typeof routes['resources.update']
    destroy: typeof routes['resources.destroy']
  }
}
