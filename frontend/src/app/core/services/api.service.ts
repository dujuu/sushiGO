import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../config/app.tokens';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(
    private readonly http: HttpClient,
    @Inject(API_BASE_URL) private readonly apiBaseUrl: string,
  ) {}

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiBaseUrl}/${path}`);
  }

  post<TRequest, TResponse>(path: string, payload: TRequest): Observable<TResponse> {
    return this.http.post<TResponse>(`${this.apiBaseUrl}/${path}`, payload);
  }
}
