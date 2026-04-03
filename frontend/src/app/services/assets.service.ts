import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap } from 'rxjs';

export interface AssetsResponse {
  years: string[];
  fields: string[];
  data: Record<string, Record<string, number>>;
  totals: Record<string, number>;
}

@Injectable({ providedIn: 'root' })
export class AssetsService {
  private baseUrl = 'http://localhost:3000/assets';

  // Cached once — all subscribers share the same HTTP call
  private cache$: Observable<AssetsResponse> | null = null;

  constructor(private http: HttpClient) {}

  getAssets(): Observable<AssetsResponse> {
    if (!this.cache$) {
      this.cache$ = this.http.get<AssetsResponse>(this.baseUrl).pipe(
        shareReplay(1)
      );
    }
    return this.cache$;
  }

  updateAsset(payload: { key: string; year: string; value: number }): Observable<any> {
    return this.http.patch(this.baseUrl, payload).pipe(
      tap(() => {
        // Invalidate cache so next getAssets() fetches fresh data
        this.cache$ = null;
      })
    );
  }

  invalidateCache() {
    this.cache$ = null;
  }
}