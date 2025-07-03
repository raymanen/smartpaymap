type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;
  
  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDevelopment) {
      // In production, only log warnings and errors
      return level === 'warn' || level === 'error';
    }
    return true;
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog('debug')) {
      const entry = this.formatMessage('debug', message, data);
      console.debug(`[${entry.timestamp}] DEBUG: ${entry.message}`, entry.data || '');
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog('info')) {
      const entry = this.formatMessage('info', message, data);
      console.info(`[${entry.timestamp}] INFO: ${entry.message}`, entry.data || '');
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog('warn')) {
      const entry = this.formatMessage('warn', message, data);
      console.warn(`[${entry.timestamp}] WARN: ${entry.message}`, entry.data || '');
    }
  }

  error(message: string, error?: any): void {
    if (this.shouldLog('error')) {
      const entry = this.formatMessage('error', message, error);
      console.error(`[${entry.timestamp}] ERROR: ${entry.message}`, entry.data || '');
      
      // In production, you might want to send errors to a logging service
      if (!this.isDevelopment && error) {
        this.reportError(message, error);
      }
    }
  }

  private reportError(message: string, error: any): void {
    // This would integrate with error reporting services like Sentry, LogRocket, etc.
    // For now, we'll just ensure the error is properly structured
    const errorData = {
      message,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : error,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    // TODO: Send to error reporting service
    console.error('Error to be reported:', errorData);
  }
}

export const logger = new Logger();
export default logger; 