import debug from 'debug'

const getUUID = () => Math.floor((1 + Math.random()) * 0x10000).toString(16)

const worker = `${process.env.NODE_ENV}_${getUUID()}`

const logger = debug(worker)

logger.color = '#999'

debug.enable(worker)

export default logger

export const error = (message) => {
  logger(`%c${message}`, 'color: #ed3f14;')
}

export const info = (message) => {
  logger(`%c${message}`, 'color: #2d8cf0;')
}
