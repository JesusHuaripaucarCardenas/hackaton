import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Estudiante } from '../interfaces/estudiante';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private apiUrl = `${environment.apiUrl}/estudiante`;

  constructor(private http: HttpClient) { }

  save(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.post<Estudiante>(`${this.apiUrl}/save`, estudiante);
  }

  update(estudiante: Estudiante): Observable<Estudiante> {
    return this.http.put<Estudiante>(`${this.apiUrl}/update`, estudiante);
  }

  findAll(): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(this.apiUrl);
  }

  findByEstado(estado: string): Observable<Estudiante[]> {
    return this.http.get<Estudiante[]>(`${this.apiUrl}/estado/${estado}`);
  }

  findById(id: number): Observable<Estudiante> {
    return this.http.get<Estudiante>(`${this.apiUrl}/${id}`);
  }

  delete(id: number): Observable<Estudiante> {
    return this.http.patch<Estudiante>(`${this.apiUrl}/delete/${id}`, {});
  }

  restore(id: number): Observable<Estudiante> {
    return this.http.patch<Estudiante>(`${this.apiUrl}/restore/${id}`, {});
  }

reportPdf(id: number) {
    return this.http.get(`${this.apiUrl}/pdf/${id}`, { responseType: 'blob' });
}


}
