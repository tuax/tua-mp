import { logger } from './utils/index'
import { version } from '../package.json'

logger.log(`Version ${version}`)

export * from './TuaComp'
export * from './TuaPage'
