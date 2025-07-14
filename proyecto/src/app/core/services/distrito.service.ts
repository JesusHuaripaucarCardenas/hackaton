import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Distrito } from '../interfaces/distrito';

@Injectable({
  providedIn: 'root'
})
export class DistritoService {
  private apiUrl = `${environment.apiUrl}/distrito`;

  constructor(private http: HttpClient) {}

  findAll(): Observable<Distrito[]> {
    return this.http.get<Distrito[]>(this.apiUrl);
  }

  save(distrito: Distrito): Observable<Distrito> {
    return this.http.post<Distrito>(`${this.apiUrl}/save`, distrito);
  }

  update(distrito: Distrito): Observable<Distrito> {
    return this.http.put<Distrito>(`${this.apiUrl}/update`, distrito);
  }

  findById(id: number): Observable<Distrito> {
    return this.http.get<Distrito>(`${this.apiUrl}/${id}`);
  }
}
