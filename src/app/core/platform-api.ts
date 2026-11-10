import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NJ_CONFIG } from './config';
import { SKIP_AUTH } from './auth/skip-auth';
import {
  CatalogProduct,
  CatalogResponse,
  EntitlementsResponse,
  MySubmissionsResponse,
  SubmissionRequest,
  SubmissionResponse,
} from './platform-api.models';

/** Typed client for platform-api. The Bearer token is added by authTokenInterceptor. */
@Injectable({ providedIn: 'root' })
export class PlatformApi {
  private http = inject(HttpClient);
  private config = inject(NJ_CONFIG);

  private url(path: string): string {
    return this.config.platformApiUrl.replace(/\/+$/, '') + path;
  }

  private get ws(): HttpParams {
    return new HttpParams().set('ws', this.config.workspace);
  }

  catalog(): Observable<CatalogResponse> {
    return this.http.get<CatalogResponse>(this.url('/v1/catalog'), { params: this.ws });
  }

  product(id: string): Observable<CatalogProduct> {
    return this.http.get<CatalogProduct>(this.url(`/v1/catalog/${encodeURIComponent(id)}`), {
      params: this.ws,
    });
  }

  /** `anonymous` sends it without the sign-in token, so it is not linked to the account. */
  submit(
    body: SubmissionRequest,
    options: { anonymous?: boolean } = {},
  ): Observable<SubmissionResponse> {
    return this.http.post<SubmissionResponse>(
      this.url('/v1/submissions'),
      { ws: this.config.workspace, ...body },
      { context: new HttpContext().set(SKIP_AUTH, !!options.anonymous) },
    );
  }

  mySubmissions(): Observable<MySubmissionsResponse> {
    return this.http.get<MySubmissionsResponse>(this.url('/v1/me/submissions'));
  }

  myEntitlements(product: string): Observable<EntitlementsResponse> {
    return this.http.get<EntitlementsResponse>(this.url('/v1/me/entitlements'), {
      params: new HttpParams().set('product', product),
    });
  }
}
