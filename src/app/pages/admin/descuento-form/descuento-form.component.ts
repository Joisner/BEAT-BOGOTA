import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DescuentoService } from '../../../core/services/descuento.service';
import { PromotorService } from '../../../core/services/promotor.service';
import { Descuento, DescuentoTipo } from '../../../core/models/descuento.model';
import { Promotor } from '../../../core/models/promotor.model';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, IconsModule, RouterLink],
    selector: 'app-descuento-form',
    templateUrl: './descuento-form.component.html',
    styleUrls: ['./descuento-form.component.css']
})
export class DescuentoFormComponent implements OnInit {
    descuentoForm!: FormGroup;
    tipos: DescuentoTipo[] = ['general', 'promotor', 'entrada'];
    promotores: Promotor[] = [];
    descuentos: Descuento[] = [];

    constructor(
        private fb: FormBuilder,
        private descuentoService: DescuentoService,
        private promotorService: PromotorService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.descuentoForm = this.fb.group({
            codigo: ['', Validators.required],
            descripcion: ['', Validators.required],
            tipo: ['general', Validators.required],
            valor: [0, [Validators.required, Validators.min(1)]],
            activo: [true],
            promotorId: [''],
            entradaTipo: ['']
        });
        this.promotorService.getPromotores().subscribe(p => this.promotores = p);
        this.descuentoService.getDescuentos().subscribe(d => this.descuentos = d);
    }

    onSubmit(): void {
        if (this.descuentoForm.invalid) return;
        // Aquí solo mock, agregar a la lista local
        alert('Descuento guardado (mock)');
        this.router.navigate(['/admin/descuentos']);
    }

    getActiveCount(): number {
        return this.descuentos.filter(d => d.active).length;
    }

    getInactiveCount(): number {
        return this.descuentos.filter(d => !d.active).length;
    }

    getTypeClass(type: DescuentoTipo): string {
        switch (type) {
            case 'general': return 'bg-green-500/20 border border-green-500/30';
            case 'promotor': return 'bg-blue-500/20 border border-blue-500/30';
            case 'entrada': return 'bg-yellow-500/20 border border-yellow-500/30';
            default: return 'bg-gray-500/20 border border-gray-500/30';
        }
    }

    eliminarDescuento(id: string): void {
        if (confirm('¿Seguro que deseas eliminar este descuento?')) {
            this.descuentos = this.descuentos.filter(d => d.id !== id);
        }
    }
}
