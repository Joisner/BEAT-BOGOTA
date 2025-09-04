import { Component, OnInit } from '@angular/core';
import { DescuentoService } from '../../../core/services/descuento.service';
import { Descuento } from '../../../core/models/descuento.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';

@Component({
    standalone: true,
    selector: 'app-descuento-list',
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, LucideAngularModule, IconsModule],
    templateUrl: './descuento-list.component.html',
    styleUrls: ['./descuento-list.component.css']
})
export class DescuentoListComponent implements OnInit {
    descuentos: Descuento[] = [];

    constructor(private descuentoService: DescuentoService) { }

    ngOnInit(): void {
        this.descuentoService.getDescuentos().subscribe({
            next: (descs) => {
                this.descuentos = descs;
            },
            error: (err) => {
                console.error('Error loading descuentos:', err);
            }
        });
    }

    eliminarDescuento(id: string): void {
        if (confirm('¿Seguro que deseas eliminar este descuento?')) {
            this.descuentos = this.descuentos.filter(d => d.id !== id);
        }
    }
}
