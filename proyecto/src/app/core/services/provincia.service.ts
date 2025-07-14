import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Provincia } from '../interfaces/provincia';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
  private apiUrl = `${environment.apiUrl}/provincia`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.apiUrl);
  }

  getById(id: number): Observable<Provincia> {
    return this.http.get<Provincia>(`${this.apiUrl}/${id}`);
  }

  save(provincia: Provincia): Observable<Provincia> {
    return this.http.post<Provincia>(`${this.apiUrl}/save`, provincia);
  }

  update(provincia: Provincia): Observable<Provincia> {
    return this.http.put<Provincia>(`${this.apiUrl}/update`, provincia);
  }
}