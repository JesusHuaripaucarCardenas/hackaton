import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProgramasAcademico } from '../interfaces/programas-academico';

@Injectable({
  providedIn: 'root'
})
export class ProgramasAcademicoService {

  private apiUrl = `${environment.apiUrl}/programas_academico`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<ProgramasAcademico[]> {
    return this.http.get<ProgramasAcademico[]>(this.apiUrl);
  }

  getById(id: number): Observable<ProgramasAcademico> {
    return this.http.get<ProgramasAcademico>(`${this.apiUrl}/${id}`);
  }

  save(programa: ProgramasAcademico): Observable<ProgramasAcademico> {
    return this.http.post<ProgramasAcademico>(`${this.apiUrl}/save`, programa);
  }

  update(programa: ProgramasAcademico): Observable<ProgramasAcademico> {
    return this.http.put<ProgramasAcademico>(`${this.apiUrl}/update`, programa);
  }
}
