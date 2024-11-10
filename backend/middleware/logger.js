import { createLogger, format as _format, transports as _transports } from 'winston';

const logger = () => {
    createLogger({
        level: 'info',
        format: _format.combine(
            _format.timestamp(),
            _format.printf(({ timestamp, level, message }) => {
                return `${timestamp} [${level.toUpperCase()}]: ${message}`;
            })
        ),
        transports: [
            new _transports.Console(),
            new _transports.File({ filename: 'error.log', level: 'error' }),
            new _transports.File({ filename: 'combined.log' }),
        ],
    });
}

export default logger;