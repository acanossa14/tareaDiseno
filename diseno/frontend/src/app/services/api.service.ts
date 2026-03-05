import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Stats {
  original: string;
  code: string;
  createdAt: string;
  totalAccesses: number;
  countries: {[country:string]: number};
  byDay: {[day:string]: number};
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  getHello(): Observable<string> {
    return this.http.get<string>(`${this.baseUrl}/`);
  }

  createUrl(original: string): Observable<{ short: string; code: string }> {
    return this.http.post<{ short: string; code: string }>(`${this.baseUrl}/url`, { original });
  }

  getStats(code: string): Observable<Stats> {
    return this.http.get<Stats>(`${this.baseUrl}/url/${code}/stats`);
  }
}
