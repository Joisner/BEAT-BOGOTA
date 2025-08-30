import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DescuentoService } from '../../../core/services/descuento.service';
import { PromotorService } from '../../../core/services/promotor.service';
import { Descuento, DescuentoTipo } from '../../../core/models/descuento.model';
import { Promotor } from '../../../core/models/promotor.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    selector: 'app-descuento-form',
    templateUrl: './descuento-form.component.html',
    styleUrls: ['./descuento-form.component.css']
})
export class DescuentoFormComponent implements OnInit {
    descuentoForm!: FormGroup;
    tipos: DescuentoTipo[] = ['general', 'promotor', 'entrada'];
    promotores: Promotor[] = [];

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
    }

    onSubmit(): void {
        if (this.descuentoForm.invalid) return;
        // Aquí solo mock, agregar a la lista local
        alert('Descuento guardado (mock)');
        this.router.navigate(['/admin/descuentos']);
    }
}
