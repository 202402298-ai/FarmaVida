import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { UsuariosService } from '../../services/usuarios.service';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './usuarios.html'
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = [];
  cargando = true;
  mostrarModal = false;
  busqueda = '';

  form: any = {
    nombre: '', email: '', password: '', rol_id: 2
  };
  
  mensaje = '';
  error = '';

  constructor(
    private usuariosService: UsuariosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.usuariosService.getAll().subscribe({
      next: (u) => {
        this.usuarios = u;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No tienes permisos para ver los usuarios o hubo un error';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  get usuariosFiltrados() {
    return this.usuarios.filter(u =>
      u.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      u.email.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirModal() {
    this.error = '';
    this.mensaje = '';
    this.form = { nombre: '', email: '', password: '', rol_id: 2 };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  guardar() {
    this.usuariosService.create(this.form).subscribe({
      next: () => {
        this.mensaje = 'Usuario creado existosamente';
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al guardar';
        this.cdr.detectChanges();
      }
    });
  }

  cambiarRol(usuario: any) {
    const nuevoRol = usuario.rol_id === 1 ? 2 : 1;
    if (confirm(`¿Cambiar rol de ${usuario.nombre} a ${nuevoRol === 1 ? 'Admin' : 'Empleado'}?`)) {
      this.usuariosService.updateRole(usuario.id, nuevoRol).subscribe({
        next: () => {
          this.mensaje = 'Rol actualizado';
          this.cargarDatos();
        },
        error: (err) => {
          this.error = err.error?.error || 'Error al actualizar rol';
          this.cdr.detectChanges();
        }
      });
    }
  }

  toggleEstado(usuario: any) {
    const accion = usuario.activo ? 'desactivar' : 'activar';
    if (confirm(`¿Seguro de ${accion} al usuario ${usuario.nombre}?`)) {
      this.usuariosService.toggleStatus(usuario.id).subscribe({
        next: () => {
          this.mensaje = `Usuario ${accion}do exitosamente`;
          this.cargarDatos();
        },
        error: (err) => {
          this.error = err.error?.error || `Error al ${accion}`;
          this.cdr.detectChanges();
        }
      });
    }
  }
}
