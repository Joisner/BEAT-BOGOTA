import { Component, OnInit } from '@angular/core';
import { EtapaBoletaService } from '../../../core/services/etapa-boleta.service';
import { EtapaBoleta } from '../../../core/models/etapa-boleta.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IconsModule } from '../../../core/module/icons.module';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, IconsModule],
    selector: 'app-etapa-boleta-list',
    templateUrl: './etapa-boleta-list.component.html',
    styleUrls: ['./etapa-boleta-list.component.css']
})
export class EtapaBoletaListComponent implements OnInit {
    etapas: EtapaBoleta[] = [];

    constructor(private etapaService: EtapaBoletaService) { }

    ngOnInit(): void {
        this.etapaService.getEtapas().subscribe(etapas => {
            this.etapas = etapas;
        });
    }

    eliminarEtapa(id: string): void {
        if (confirm('¿Seguro que deseas eliminar esta etapa?')) {
            this.etapas = this.etapas.filter(e => e.id !== id);
        }
    }
}
