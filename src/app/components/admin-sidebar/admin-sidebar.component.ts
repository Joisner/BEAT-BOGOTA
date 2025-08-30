import { Component, inject } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../core/module/icons.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IsActiveMatchOptions, RouterModule } from '@angular/router';
import { Router } from '@angular/router';
interface MenuItem {
    name: string;
    icon: string;
    href?: string;
    badge?: number;
    children?: MenuItem[];
    expanded?: boolean;
}
@Component({
    selector: 'app-admin-sidebar',
    standalone: true,
    imports: [LucideAngularModule, IconsModule, RouterModule, CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admin-sidebar.component.html',
    styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {
  private router = inject(Router);

  isCollapsed = false;

  // 100% dinámico: agrega/edita aquí y se refleja en el HTML
  menuItems: MenuItem[] = [
    { name: 'Eventos',        icon: 'calendar-days', href: '/admin/events' },
    { name: 'Promotores',     icon: 'users',         href: '/admin/promotores' },
    { name: 'Descuentos',     icon: 'percent',       href: '/admin/descuentos', badge: 3 },
    { name: 'Etapas de Boleta', icon: 'layers',      href: '/admin/etapas-boleta' },
    // Ejemplo con submenús (opcional):
    // {
    //   name: 'Reportes',
    //   icon: 'bar-chart-3',
    //   expanded: false,
    //   children: [
    //     { name: 'Ventas', icon: 'line-chart', href: '/admin/reportes/ventas' },
    //     { name: 'Asistencia', icon: 'users-round', href: '/admin/reportes/asistencia' }
    //   ]
    // }
  ];

  onToggleClick() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleSubmenu(item: MenuItem) {
    item.expanded = !item.expanded;
  }

  // Activo si el link o alguno de sus hijos coincide con la URL actual
  isMenuActive(item: MenuItem): boolean {
    const opts: IsActiveMatchOptions = {
      paths: 'subset', queryParams: 'ignored', fragment: 'ignored', matrixParams: 'ignored'
    };
    if (item.href && this.router.isActive(item.href, opts)) return true;
    if (item.children?.some(c => c.href && this.router.isActive(c.href, opts))) return true;
    return false;
  }

  trackByName = (_: number, i: MenuItem) => i.name;

  getIconName(icon: string) { return icon; }
}