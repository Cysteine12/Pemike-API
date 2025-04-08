import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  transports: [],
})

logger.add(
  new transports.Console({
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level.toUpperCase()}]: ${message}`
      })
    ),
  })
)

export default logger
