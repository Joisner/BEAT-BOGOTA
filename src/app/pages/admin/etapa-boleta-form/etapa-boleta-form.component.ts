import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EtapaBoletaService } from '../../../core/services/etapa-boleta.service';
import { EtapaBoleta } from '../../../core/models/etapa-boleta.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    selector: 'app-etapa-boleta-form',
    templateUrl: './etapa-boleta-form.component.html',
    styleUrls: ['./etapa-boleta-form.component.css']
})
export class EtapaBoletaFormComponent implements OnInit {
    etapaForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private etapaService: EtapaBoletaService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.etapaForm = this.fb.group({
            nombre: ['', Validators.required],
            fechaInicio: ['', Validators.required],
            fechaFin: ['', Validators.required],
            precio: [0, [Validators.required, Validators.min(1)]],
            disponibilidad: [0, [Validators.required, Validators.min(1)]],
            activa: [true]
        });
    }

    onSubmit(): void {
        if (this.etapaForm.invalid) return;
        // Mock: solo frontend
        alert('Etapa guardada (mock)');
        this.router.navigate(['/admin/etapas-boleta']);
    }
}
