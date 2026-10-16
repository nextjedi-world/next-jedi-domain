/** Structured logging: one JSON-able record per call, so logs can be searched by field. */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogRecord {
  level: LogLevel;
  msg: string;
  ts: string;
  product: string;
  [key: string]: unknown;
}

export const PRODUCT_ID = 'next-jedi-domain';

export function buildRecord(
  level: LogLevel,
  msg: string,
  fields: Record<string, unknown> = {},
  now: Date = new Date(),
): LogRecord {
  return { ...fields, level, msg, ts: now.toISOString(), product: PRODUCT_ID };
}

function emit(level: LogLevel, msg: string, fields?: Record<string, unknown>): void {
  const record = buildRecord(level, msg, fields);
  console[level](JSON.stringify(record));
}

export const log = {
  debug: (msg: string, fields?: Record<string, unknown>) => emit('debug', msg, fields),
  info: (msg: string, fields?: Record<string, unknown>) => emit('info', msg, fields),
  warn: (msg: string, fields?: Record<string, unknown>) => emit('warn', msg, fields),
  error: (msg: string, fields?: Record<string, unknown>) => emit('error', msg, fields),
};
