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

  // Configuración de menú dinámico
  menuItems: MenuItem[] = [
    { 
      name: 'Users', 
      icon: 'users', 
      expanded: false, // Cambiado a false por defecto
      children: [
        /* { name: 'Profile', icon: 'user', href: '/admin/users/profile' }, */
        { name: 'Manage Users', icon: 'users', href: '/admin/users' },
        /* { name: 'Permissions', icon: 'shield', href: '/admin/users/permissions' } */
      ]
    },
    { name: 'Promotores',     icon: 'users',         href: '/admin/promotores' },
    { name: 'Eventos',        icon: 'calendar-days', href: '/admin/events' },
    { name: 'Etapas de Boleta', icon: 'layers',      href: '/admin/etapas-boleta' },
    { name: 'Descuentos',     icon: 'percent',       href: '/admin/descuentos', badge: 3 },
    /* {
      name: 'Reportes',
      icon: 'bar-chart-3',
      expanded: false,
      children: [
        { name: 'Ventas', icon: 'line-chart', href: '/admin/reportes/ventas' },
        { name: 'Asistencia', icon: 'users-round', href: '/admin/reportes/asistencia' },
        { name: 'Analytics', icon: 'trending-up', href: '/admin/reportes/analytics' }
      ]
    },
    {
      name: 'Configuración',
      icon: 'settings',
      expanded: false,
      children: [
        { name: 'General', icon: 'settings', href: '/admin/config/general' },
        { name: 'Security', icon: 'lock', href: '/admin/config/security', badge: 2 },
        { name: 'Notifications', icon: 'bell', href: '/admin/config/notifications' }
      ]
    } */
  ];

  onToggleClick() {
    this.isCollapsed = !this.isCollapsed;
    // Cerrar todos los submenús al colapsar
    if (this.isCollapsed) {
      this.menuItems.forEach(item => {
        if (item.children) {
          item.expanded = false;
        }
      });
    }
  }

  toggleSubmenu(event: MouseEvent, item: MenuItem) {
    event.preventDefault();
    event.stopPropagation();
    
    // Si el sidebar está colapsado, no permitir expandir submenús
    if (this.isCollapsed) {
      return;
    }
    
    const wasExpanded = item.expanded;
    
    // Cerrar todos los otros submenús (comportamiento acordeón)
    this.menuItems.forEach(menuItem => {
      if (menuItem !== item && menuItem.children) {
        menuItem.expanded = false;
      }
    });
    
    // Toggle del item actual
    item.expanded = !wasExpanded;
  }

  // Verifica si un menú está activo (incluyendo sus hijos)
  isMenuActive(item: MenuItem): boolean {
    const opts: IsActiveMatchOptions = {
      paths: 'subset', 
      queryParams: 'ignored', 
      fragment: 'ignored', 
      matrixParams: 'ignored'
    };
    
    // Verificar si el item principal está activo
    if (item.href && this.router.isActive(item.href, opts)) {
      return true;
    }
    
    // Verificar si algún hijo está activo
    if (item.children?.some(child => child.href && this.router.isActive(child.href, opts))) {
      return true;
    }
    
    return false;
  }

  // Función para tracking en *ngFor (mejora performance)
  trackByName = (_: number, item: MenuItem) => item.name;

  // Helper para obtener nombre del icono
  getIconName(icon: string): string { 
    return icon; 
  }

  // Función para auto-expandir submenú si un hijo está activo
  ngOnInit() {
    this.autoExpandActiveMenus();
  }

  private autoExpandActiveMenus() {
    const opts: IsActiveMatchOptions = {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    };

    this.menuItems.forEach(item => {
      if (item.children) {
        // Si algún hijo está activo, expandir el padre
        const hasActiveChild = item.children.some(child => 
          child.href && this.router.isActive(child.href, opts)
        );
        if (hasActiveChild) {
          item.expanded = true;
        }
      }
    });
  }
}