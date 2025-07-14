import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Departamento } from '../interfaces/departamento';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoService {
private apiUrl = `${environment.apiUrl}/departamento`;
  constructor(private http: HttpClient) { }

  findAll(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.apiUrl);
  }

  findById(id: number): Observable<Departamento> {
    return this.http.get<Departamento>(`${this.apiUrl}/${id}`);
  }

  save(dept: Departamento): Observable<Departamento> {
    return this.http.post<Departamento>(`${this.apiUrl}/save`, dept);
  }

  update(dept: Departamento): Observable<Departamento> {
    return this.http.put<Departamento>(`${this.apiUrl}/update`, dept);
  }
}
