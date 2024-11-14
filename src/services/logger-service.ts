import { createLogger, transports, format, Logger } from 'winston';

class LoggerSingleton {
    private static instance: LoggerSingleton;
    private logger: Logger;

    private constructor() {
        this.logger = createLogger({
            level: 'info',
            format: format.combine(
                format.timestamp(),
                format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            ),
            transports: [
                new transports.Console({ level: 'info', format: format.simple() }),
                new transports.File({ filename: 'app.log', level: 'info' }),
            ],
        });
    }

    public static getInstance(): LoggerSingleton {
        if (!LoggerSingleton.instance) {
            LoggerSingleton.instance = new LoggerSingleton();
        }
        return LoggerSingleton.instance;
    }

    public info(message: string): void {
        this.logger.info(message);
    }

    public debug(message: string): void {
        this.logger.debug(message);
    }

    public warn(message: string): void {
        this.logger.warn(message);
    }

    public error(message: string): void {
        this.logger.error(message);
    }
}

export default LoggerSingleton;
