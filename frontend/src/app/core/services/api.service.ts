import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/app.tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  get<T>(path: string, params?: Record<string, unknown>): Observable<T> {
    return this.http.get<T>(`${this.apiBaseUrl}/${path}`, {
      params: this.toHttpParams(params),
    });
  }

  post<TRequest, TResponse>(path: string, payload: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.apiBaseUrl}/${path}`, payload);
  }

  put<TRequest, TResponse>(path: string, payload: TRequest): Observable<TResponse> {
    return this.http.put<TResponse>(`${this.apiBaseUrl}/${path}`, payload);
  }

  patch<TRequest, TResponse>(path: string, payload: TRequest): Observable<TResponse> {
    return this.http.patch<TResponse>(`${this.apiBaseUrl}/${path}`, payload);
  }

  delete<TResponse>(path: string): Observable<TResponse> {
    return this.http.delete<TResponse>(`${this.apiBaseUrl}/${path}`);
  }

  private toHttpParams(params?: Record<string, unknown>): HttpParams {
    if (! params) {
      return new HttpParams();
    }

    return Object.entries(params).reduce((httpParams, [key, value]) => {
      if (value === undefined || value === null || value === '') {
        return httpParams;
      }

      return httpParams.set(key, String(value));
    }, new HttpParams());
  }
}
