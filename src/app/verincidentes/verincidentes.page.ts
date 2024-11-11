import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-verincidentes',
  templateUrl: './verincidentes.page.html',
  styleUrls: ['./verincidentes.page.scss'],
})
export class VerincidentesPage implements OnInit {
  indice: number = 0;
  incidentes: {
    id: number;
    tipoIncidente: string;
    descripcion: string;
    ubicacion: string;
    fechaHora: string;
    fotoUrl: string;
    prioridad: string;
  }[] = [];

  incidentesFiltrados: {
    id: number;
    tipoIncidente: string;
    descripcion: string;
    ubicacion: string;
    fechaHora: string;
    fotoUrl: string;
    prioridad: string;
  }[] = [];

  incidentesCompletados: {
    id: number;
    tipoIncidente: string;
    descripcion: string;
    ubicacion: string;
    fechaHora: string;
    fotoUrl: string;
    prioridad: string;
  }[] = [];

  filtroTipo: string = '';
  filtroUbicacion: string = '';
  filtroPrioridad: string = '';

  tiposDisponibles: string[] = [];
  ubicacionesDisponibles: string[] = [];

  constructor(private router: Router) { }

  ngOnInit() {
    let incidentesCompletado = localStorage.getItem('incidentesCompletados')
    if (incidentesCompletado) {
      this.incidentesCompletados = JSON.parse(incidentesCompletado);
    }
    // Cargar incidentes del localStorage
    let incidentesGuardados = localStorage.getItem('incidentes');
    if (incidentesGuardados) {
      this.incidentes = JSON.parse(incidentesGuardados);
      // Ordenar los incidentes por prioridad (alta, media, baja)
      this.incidentes.sort((a, b) => this.ordenarPorPrioridad(a.prioridad, b.prioridad));
      this.incidentesFiltrados = [...this.incidentes];

      // Obtener listas únicas de tipos y ubicaciones para los filtros
      this.tiposDisponibles = Array.from(new Set(this.incidentes.map(inc => inc.tipoIncidente)));
      this.ubicacionesDisponibles = Array.from(new Set(this.incidentes.map(inc => inc.ubicacion)));
    }
  }

  ordenarPorPrioridad(a: string, b: string): number {
    const prioridadValor: { [key: string]: number } = { alta: 3, media: 2, baja: 1 };
    return prioridadValor[b as keyof typeof prioridadValor] - prioridadValor[a as keyof typeof prioridadValor];
  }

  aplicarFiltros() {
    this.incidentesFiltrados = this.incidentes.filter(incidente => {
      return (
        (!this.filtroTipo || incidente.tipoIncidente === this.filtroTipo) &&
        (!this.filtroUbicacion || incidente.ubicacion === this.filtroUbicacion) &&
        (!this.filtroPrioridad || incidente.prioridad === this.filtroPrioridad)
      );
    });
  }

  restablecerLista() {
    // Restablecer los valores de los filtros
    this.filtroTipo = '';
    this.filtroUbicacion = '';
    this.filtroPrioridad = '';

    // Restaurar la lista original de incidentes
    this.incidentesFiltrados = [...this.incidentes];
  }
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }
  Completar(id: number) {
    for (let i = 0; i <= this.incidentesFiltrados.length - 1; i++) {
      if (this.incidentesFiltrados[i].id === id)
        this.indice = i;
    }
    console.log(this.indice);
    let incidente = this.incidentesFiltrados[this.indice]; //Añadir a incientes completados
    console.log(incidente);//ver incidente completado
    this.incidentesCompletados.push(incidente);
    localStorage.setItem('incidentesCompletados', JSON.stringify(this.incidentesCompletados));
    this.incidentesFiltrados.splice(this.indice, 1);
    localStorage.setItem('incidentes', JSON.stringify(this.incidentesFiltrados));

    // Agregar notificación
    let notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    notificaciones.push({
      mensaje: `Incidente completado: ${incidente.tipoIncidente}`,
      fecha: new Date().toLocaleString()
    });
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
  }
  Borrar(id: number) {
    console.log("hosafsdfsd");
    for (let i = 0; i <= this.incidentesFiltrados.length - 1; i++) {
      if (this.incidentesFiltrados[i].id === id)
        this.indice = i;
    }
    console.log(this.indice);
    this.incidentesFiltrados.splice(this.indice, 1);
    localStorage.setItem('incidentes', JSON.stringify(this.incidentesFiltrados));
    let incidente = this.incidentesFiltrados[this.indice]; //Añadir a incientes completados
    
    // Agregar notificación
    let notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
    notificaciones.push({
      mensaje: `Incidente Eliminado: ${incidente.tipoIncidente}`,
      fecha: new Date().toLocaleString()
    });
    localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
  }
}
