import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar';
import { SidebarComponent } from '../sidebar/sidebar';
import { OrdenesService } from '../../services/ordenes.service';
import { ProveedoresService } from '../../services/proveedores.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './ordenes.html'
})
export class OrdenesComponent implements OnInit {
  ordenes: any[] = [];
  proveedores: any[] = [];
  productos: any[] = [];
  cargando = true;
  mostrarModal = false;
  mostrarDetalle = false;
  ordenSeleccionada: any = null;
  mensaje = '';
  error = '';
  filtroEstado = '';

  form: any = { proveedor_id: null, notas: '', items: [] };
  itemActual: any = { producto_id: null, cantidad: 1, precio_unitario: 0 };

  constructor(
    private ordenesService: OrdenesService,
    private proveedoresService: ProveedoresService,
    private productosService: ProductosService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() { this.cargarDatos(); }

  cargarDatos() {
    this.cargando = true;
    this.ordenesService.getAll().subscribe(o => {
      this.ordenes = o;
      this.cargando = false;
      this.cdr.detectChanges();
    });
    this.proveedoresService.getAll().subscribe(p => {
      this.proveedores = p;
      this.cdr.detectChanges();
    });
    this.productosService.getAll().subscribe(p => {
      this.productos = p;
      this.cdr.detectChanges();
    });
  }

  get ordenesFiltradas() {
    if (!this.filtroEstado) return this.ordenes;
    return this.ordenes.filter(o => o.estado === this.filtroEstado);
  }

  abrirModal() {
    this.error = '';
    this.form = { proveedor_id: null, notas: '', items: [] };
    this.itemActual = { producto_id: null, cantidad: 1, precio_unitario: 0 };
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  onProductoChange() {
    const prod = this.productos.find(p => p.id == this.itemActual.producto_id);
    if (prod) this.itemActual.precio_unitario = prod.precio;
    this.cdr.detectChanges();
  }

  agregarItem() {
    if (!this.itemActual.producto_id || this.itemActual.cantidad <= 0) return;
    const prod = this.productos.find(p => p.id == this.itemActual.producto_id);
    this.form.items.push({
      producto_id: this.itemActual.producto_id,
      cantidad: this.itemActual.cantidad,
      precio_unitario: this.itemActual.precio_unitario,
      nombre: prod?.nombre
    });
    this.itemActual = { producto_id: null, cantidad: 1, precio_unitario: 0 };
    this.cdr.detectChanges();
  }

  quitarItem(index: number) {
    this.form.items.splice(index, 1);
    this.cdr.detectChanges();
  }

  get totalOrden() {
    return this.form.items.reduce((sum: number, i: any) =>
      sum + (i.cantidad * i.precio_unitario), 0);
  }

  guardar() {
    if (!this.form.proveedor_id) {
      this.error = 'Seleccione un proveedor';
      this.cdr.detectChanges();
      return;
    }
    if (this.form.items.length === 0) {
      this.error = 'Agregue al menos un producto';
      this.cdr.detectChanges();
      return;
    }
    this.ordenesService.create(this.form).subscribe({
      next: () => {
        this.mensaje = 'Orden de compra creada exitosamente';
        this.cerrarModal();
        this.cargarDatos();
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al crear orden';
        this.cdr.detectChanges();
      }
    });
  }

  verDetalle(id: number) {
    this.ordenesService.getById(id).subscribe(o => {
      this.ordenSeleccionada = o;
      this.mostrarDetalle = true;
      this.cdr.detectChanges();
    });
  }

  cerrarDetalle() {
    this.mostrarDetalle = false;
    this.cdr.detectChanges();
  }

  cambiarEstado(id: number, estado: string) {
    const msg = estado === 'completada'
      ? '¿Marcar como completada? Esto actualizará el stock automáticamente.'
      : `¿Cambiar estado a "${estado}"?`;
    if (confirm(msg)) {
      this.ordenesService.cambiarEstado(id, estado).subscribe({
        next: () => {
          this.mensaje = `Orden ${estado} correctamente`;
          this.cargarDatos();
          if (this.mostrarDetalle) this.verDetalle(id);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = err.error?.error || 'Error al cambiar estado';
          this.cdr.detectChanges();
        }
      });
    }
  }

  badgeEstado(estado: string) {
    const map: any = {
      pendiente: 'bg-warning text-dark',
      completada: 'bg-success',
      cancelada: 'bg-danger'
    };
    return map[estado] || 'bg-secondary';
  }
}