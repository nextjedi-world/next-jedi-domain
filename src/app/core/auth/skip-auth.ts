import { HttpContextToken } from '@angular/common/http';

/** Set on a platform-api request that must go without the Bearer token (anonymous forms). */
export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);
