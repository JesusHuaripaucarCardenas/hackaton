// Angular component unificado para la gestión de estudiantes

import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  Renderer2,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { of, map, switchMap } from 'rxjs';

import { Estudiante } from '../../../core/interfaces/estudiante';
import { Departamento } from '../../../core/interfaces/departamento';
import { Provincia } from '../../../core/interfaces/provincia';
import { Distrito } from '../../../core/interfaces/distrito';
import { ProgramasAcademico } from '../../../core/interfaces/programas-academico';

import { EstudianteService } from '../../../core/services/estudiante.service';
import { DepartamentoService } from '../../../core/services/departamento.service';
import { ProvinciaService } from '../../../core/services/provincia.service';
import { DistritoService } from '../../../core/services/distrito.service';
import { ProgramasAcademicoService } from '../../../core/services/programas-academico.service';

@Component({
  standalone: true,
  selector: 'app-estudiante-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './estudiante-list.component.html',
  styleUrls: ['./estudiante-list.component.scss'],
})
export class EstudianteListComponent implements OnInit, OnDestroy {
 estudiantes: Estudiante[] = [];
  distritos: Distrito[] = [];
  programas: ProgramasAcademico[] = [];
  departamentos: Departamento[] = [];
  provincias: Provincia[] = [];

  cargando = false;

  // Modal visibility flags
  modalRegistroVisible = false;
  modalEditarVisible = false;

  filterVisible = false;
  filterStatus: 'A' | 'I' = 'A';
  sortOrder: 'asc' | 'desc' = 'asc';
  textoFiltro = '';

  estudianteSeleccionado: Estudiante | null = null;

  nuevoDept: Departamento = { nombre: '' };
  nuevoProvincia: Provincia = { nombre: '', idDepartamento: 0 };
  nuevoDistrito: Distrito = { nombre: '', idProvincia: 0 };
  nuevoPrograma: ProgramasAcademico = { nombre: '' };

  selectedDepartamentoId?: number;
  selectedProvinciaId?: number;
  selectedDistritoId?: number;
  selectedProgramaId?: number;

  estudiante: Estudiante & { estado?: 'A' | 'I' } = {
    numeroDocumento: 0,
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    email: '',
    telefono: 0,
    direccion: '',
    idDistrito: 0,
    idPrograma: 0,
    fechaInscripcion: '',
    estado: 'A',
  };

  private removeDocumentClickListener?: () => void;

  constructor(
    private deptService: DepartamentoService,
    private provinciaService: ProvinciaService,
    private distritoService: DistritoService,
    private programasService: ProgramasAcademicoService,
    private estudianteService: EstudianteService,
    private renderer: Renderer2,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.cargando = true;
    this.cargarDatosMaestros();
    this.cargarEstudiantes();

    if (isPlatformBrowser(this.platformId)) {
      this.removeDocumentClickListener = this.renderer.listen(
        'document',
        'click',
        this.onDocumentClick.bind(this)
      );
    }
  }

  ngOnDestroy(): void {
    if (this.removeDocumentClickListener) this.removeDocumentClickListener();
  }
 
  cargarDatosMaestros(): void {
    this.deptService.findAll().subscribe(d => (this.departamentos = d));
    this.provinciaService.getAll().subscribe(p => (this.provincias = p));
    this.distritoService.findAll().subscribe(d => (this.distritos = d));
    this.programasService.getAll().subscribe(p => (this.programas = p));
  }

  cargarEstudiantes(): void {
    this.estudianteService.findAll().subscribe(estudiantes => {
      this.estudiantes = estudiantes;
      this.ordenarEstudiantes();
      this.cargando = false;
    });
  }

  abrirModalRegistro(): void {
    this.modalRegistroVisible = true;
    this.modalEditarVisible = false;
    this.resetForm();
  }

  cerrarModalRegistro(): void {
    this.modalRegistroVisible = false;
    this.resetForm();
  }

  abrirModalEditar(estudiante: Estudiante): void {
    this.estudianteSeleccionado = { ...estudiante };
    this.modalEditarVisible = true;
    this.modalRegistroVisible = false;
  }

  cerrarModalEditar(): void {
    this.modalEditarVisible = false;
    this.estudianteSeleccionado = null;
  }

  cerrarDesdeFondoRegistro(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cerrarModalRegistro();
    }
  }

  cerrarDesdeFondoEditar(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.cerrarModalEditar();
    }
  }

  registrar(): void {
    const dept$ = this.nuevoDept.nombre
      ? this.deptService.save(this.nuevoDept)
      : of({ id: 0, nombre: '' });

    dept$
      .pipe(
        switchMap(dept => {
          this.nuevoProvincia.idDepartamento = dept.id!;
          return this.nuevoProvincia.nombre
            ? this.provinciaService.save(this.nuevoProvincia)
            : of({ id: 0, idDepartamento: dept.id!, nombre: '' });
        }),
        switchMap(prov => {
          this.nuevoDistrito.idProvincia = prov.id!;
          return this.nuevoDistrito.nombre
            ? this.distritoService.save(this.nuevoDistrito)
            : of({ id: 0, idProvincia: prov.id!, nombre: '' });
        }),
        switchMap(dist => {
          this.estudiante.idDistrito = dist.id!;
          return this.nuevoPrograma.nombre
            ? this.programasService.save(this.nuevoPrograma)
            : of({ id: 0, nombre: '' });
        }),
        switchMap(prg => {
          this.estudiante.idPrograma = prg.id!;
          return this.estudianteService.save(this.estudiante);
        })
      )
      .subscribe({
        next: () => {
          alert('Registro completo exitosamente');
          this.resetForm();
          this.cerrarModalRegistro();
          this.cargarEstudiantes();
        },
        error: err => {
          console.error('Error en el registro:', err);
          alert('Hubo un error al registrar. Revisa consola.');
        }
      });
  }

  guardarCambios(): void {
    if (!this.estudianteSeleccionado) return;
    this.estudianteService.update(this.estudianteSeleccionado).subscribe(() => {
      const idx = this.estudiantes.findIndex(e => e.id === this.estudianteSeleccionado!.id);
      if (idx !== -1) this.estudiantes[idx] = { ...this.estudianteSeleccionado! };
      this.ordenarEstudiantes();
      this.cerrarModalEditar();
    });
  }

  desactivarEstudiante(id: number): void {
    const estudiante = this.estudiantes.find(e => e.id === id);
    if (!estudiante) return;
    if (confirm('¿Está seguro que desea desactivar este estudiante?')) {
      const updated = { ...estudiante, estado: 'I' };
      this.estudianteService.update(updated).subscribe(() => {
        estudiante.estado = 'I';
        this.ordenarEstudiantes();
      });
    }
  }

  restaurarEstudiante(id: number): void {
    const estudiante = this.estudiantes.find(e => e.id === id);
    if (!estudiante) return;
    if (confirm('¿Está seguro que desea restaurar este estudiante?')) {
      this.estudianteService.restore(id).subscribe(() => {
        estudiante.estado = 'A';
        this.ordenarEstudiantes();
      });
    }
  }

  reportPdf(id: number | undefined): void {
    if (!id) return;
    this.estudianteService.reportPdf(id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte_estudiante_${id}.pdf`;
      link.click();
    });
  }

  resetForm(): void {
    this.nuevoDept = { nombre: '' };
    this.nuevoProvincia = { nombre: '', idDepartamento: 0 };
    this.nuevoDistrito = { nombre: '', idProvincia: 0 };
    this.nuevoPrograma = { nombre: '' };
    this.estudiante = {
      numeroDocumento: 0, nombre: '', apellido: '', fechaNacimiento: '',
      email: '', telefono: 0, direccion: '', idDistrito: 0, idPrograma: 0,
      fechaInscripcion: '', estado: 'A'
    };
    this.textoFiltro = '';
  }

  ordenarEstudiantes(): void {
    this.estudiantes.sort((a, b) => {
      const ea = a.estado || 'A';
      const eb = b.estado || 'A';
      if (ea === eb) return (a.id! - b.id!);
      return ea === 'A' ? -1 : 1;
    });
  }

  toggleFilter(): void {
    this.filterVisible = !this.filterVisible;
  }

  applyFilter(): void {
    this.estudianteService.findAll()
      .pipe(
        map(list =>
          list
            .filter(e => e.estado === this.filterStatus)
            .filter(e => this.filtraPorTextoInterno(e))
            .sort((a, b) => {
              const nameA = a.nombre.toLowerCase();
              const nameB = b.nombre.toLowerCase();
              return this.sortOrder === 'asc'
                ? nameA.localeCompare(nameB)
                : nameB.localeCompare(nameA);
            })
        )
      )
      .subscribe(filtered => {
        this.estudiantes = filtered;
        this.filterVisible = false;
      });
  }

  filtrarPorTexto(): void {
    this.textoFiltro = this.textoFiltro.trim().toLowerCase();
    this.applyFilter();
  }

  private filtraPorTextoInterno(e: Estudiante): boolean {
    const filtro = this.textoFiltro;
    const nombre = e.nombre.toLowerCase();
    const apellido = e.apellido.toLowerCase();
    const estado = e.estado?.toLowerCase() ?? '';
    const anioNacimiento = e.fechaNacimiento ? new Date(e.fechaNacimiento).getFullYear().toString() : '';
    const anioInscripcion = e.fechaInscripcion ? new Date(e.fechaInscripcion).getFullYear().toString() : '';
    const nroDoc = e.numeroDocumento.toString();

    return (
      nombre.startsWith(filtro) ||
      apellido.startsWith(filtro) ||
      estado.startsWith(filtro) ||
      anioNacimiento.includes(filtro) ||
      anioInscripcion.includes(filtro) ||
      nroDoc.includes(filtro)
    );
  }

  private onDocumentClick(event: MouseEvent): void {
    if (this.filterVisible && !(event.target as HTMLElement).closest('.ag-buttons-container')) {
      this.filterVisible = false;
    }
  }

  getNombreDistrito(id: number): string {
    const distrito = this.distritos.find(d => d.id === id);
    return distrito ? distrito.nombre : 'Desconocido';
  }

  getNombrePrograma(id: number): string {
    const programa = this.programas.find(p => p.id === id);
    return programa ? programa.nombre : 'Desconocido';
  }
}
