import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './categorias.html'
})
export class CategoriasComponent implements OnInit {
  categorias: any[] = [];
  cargando = true;
  mostrarModal = false;
  editando = false;
  mensaje = '';
  error = '';

  form: any = { nombre: '', descripcion: '' };
  idEditando: number | null = null;

  constructor(
    private categoriasService: CategoriasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarDatos(); }

  cargarDatos() {
    this.cargando = true;
    this.categoriasService.getAll().subscribe(c => {
      this.categorias = c;
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }

  abrirModal(categoria?: any) {
    this.error = '';
    this.mensaje = '';
    if (categoria) {
      this.editando = true;
      this.idEditando = categoria.id;
      this.form = { ...categoria };
    } else {
      this.editando = false;
      this.idEditando = null;
      this.form = { nombre: '', descripcion: '' };
    }
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  guardar() {
    const obs = this.editando
      ? this.categoriasService.update(this.idEditando!, this.form)
      : this.categoriasService.create(this.form);

    obs.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Categoría actualizada' : 'Categoría creada';
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al guardar';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta categoría?')) {
      this.categoriasService.delete(id).subscribe(() => this.cargarDatos());
    }
  }
}