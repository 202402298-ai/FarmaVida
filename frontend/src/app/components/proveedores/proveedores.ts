import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { ProveedoresService } from '../../services/proveedores.service';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './proveedores.html'
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  cargando = true;
  mostrarModal = false;
  editando = false;
  busqueda = '';
  mensaje = '';
  error = '';

  form: any = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };
  idEditando: number | null = null;

  constructor(
    private proveedoresService: ProveedoresService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarDatos(); }

  cargarDatos() {
    this.cargando = true;
    this.proveedoresService.getAll().subscribe(p => {
      this.proveedores = p;
      this.cargando = false;
      this.cdr.detectChanges();
    });
  }

  get proveedoresFiltrados() {
    return this.proveedores.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirModal(proveedor?: any) {
    this.error = '';
    this.mensaje = '';
    if (proveedor) {
      this.editando = true;
      this.idEditando = proveedor.id;
      this.form = { ...proveedor };
    } else {
      this.editando = false;
      this.idEditando = null;
      this.form = { nombre: '', contacto: '', telefono: '', email: '', direccion: '' };
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
      ? this.proveedoresService.update(this.idEditando!, this.form)
      : this.proveedoresService.create(this.form);

    obs.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Proveedor actualizado' : 'Proveedor creado';
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
    if (confirm('¿Eliminar este proveedor?')) {
      this.proveedoresService.delete(id).subscribe(() => this.cargarDatos());
    }
  }
}