/**
 * Default logger for entire project
 * SEE: https://github.com/winstonjs/winston
 *
 * EXAMPLES:
 * logger.log('silly', "127.0.0.1 - there's no place like home");
 * logger.log('debug', "127.0.0.1 - there's no place like home");
 * logger.log('verbose', "127.0.0.1 - there's no place like home");
 * logger.log('info', "127.0.0.1 - there's no place like home");
 * logger.log('warn', "127.0.0.1 - there's no place like home");
 * logger.log('error', "127.0.0.1 - there's no place like home");
 * logger.info("127.0.0.1 - there's no place like home");
 * logger.warn("127.0.0.1 - there's no place like home");
 * logger.error("127.0.0.1 - there's no place like home");
 */

import * as logger from 'winston';

logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    timestamp: true,
    level: 'silly',
    colorize: true
});

export default logger;
