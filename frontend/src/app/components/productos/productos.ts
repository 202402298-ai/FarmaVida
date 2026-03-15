import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { ProductosService } from '../../services/productos.service';
import { CategoriasService } from '../../services/categorias.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './productos.html'
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];
  categorias: any[] = [];
  cargando = true;
  mostrarModal = false;
  editando = false;
  busqueda = '';

  form: any = {
    codigo: '', nombre: '', descripcion: '', precio: 0,
    stock_actual: 0, stock_minimo: 5, categoria_id: null, imagen_url: ''
  };
  idEditando: number | null = null;
  mensaje = '';
  error = '';

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.productosService.getAll().subscribe(p => {
      this.productos = p;
      this.cargando = false;
      this.cdr.detectChanges();
    });
    this.categoriasService.getAll().subscribe(c => {
      this.categorias = c;
      this.cdr.detectChanges();
    });
  }

  get productosFiltrados() {
    return this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }

  abrirModal(producto?: any) {
    this.error = '';
    this.mensaje = '';
    if (producto) {
      this.editando = true;
      this.idEditando = producto.id;
      this.form = { ...producto };
    } else {
      this.editando = false;
      this.idEditando = null;
      this.form = { codigo: '', nombre: '', descripcion: '', precio: 0, stock_actual: 0, stock_minimo: 5, categoria_id: null, imagen_url: '' };
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
      ? this.productosService.update(this.idEditando!, this.form)
      : this.productosService.create(this.form);

    obs.subscribe({
      next: () => {
        this.mensaje = this.editando ? 'Producto actualizado' : 'Producto creado';
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
    if (confirm('¿Eliminar este producto?')) {
      this.productosService.delete(id).subscribe(() => this.cargarDatos());
    }
  }
}