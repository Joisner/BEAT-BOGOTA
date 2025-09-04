import { Component, OnInit } from '@angular/core';
import { EtapaBoletaService } from '../../../core/services/etapa-boleta.service';
import { EtapaBoleta } from '../../../core/models/etapa-boleta.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IconsModule } from '../../../core/module/icons.module';
import { NotificationService } from '../../../core/services/notification.service';
import { finalize } from 'rxjs/operators';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, IconsModule],
    selector: 'app-etapa-boleta-list',
    templateUrl: './etapa-boleta-list.component.html',
    styleUrls: ['./etapa-boleta-list.component.css']
})
export class EtapaBoletaListComponent implements OnInit {
    etapas: EtapaBoleta[] = [];
    loading = false;
    error: string | null = null;
    eventId = '1'; // This should come from route params or a service

    constructor(
        private etapaService: EtapaBoletaService,
        private notificationService: NotificationService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.loadEtapas();
    }

    loadEtapas(): void {
        this.loading = true;
        this.error = null;
        
        this.etapaService.getEtapas(this.eventId).pipe(
            finalize(() => this.loading = false)
        ).subscribe({
            next: (etapas) => {
                debugger;
                this.etapas = etapas;
            },
            error: (err) => {
                this.error = 'No se pudieron cargar las etapas. Por favor, intente nuevamente.';
                this.notificationService.error(this.error);
                console.error('Error loading etapas:', err);
            }
        });
    }

    eliminarEtapa(id: string): void {
        if (confirm('¿Está seguro de que desea eliminar esta etapa? Esta acción no se puede deshacer.')) {
            this.loading = true;
            this.etapaService.deleteEtapa(id).subscribe({
                next: () => {
                    this.etapas = this.etapas.filter(e => e.id !== id);
                    this.notificationService.success('Etapa eliminada correctamente');
                },
                error: (err) => {
                    this.notificationService.error('Error al eliminar la etapa');
                    console.error('Error deleting etapa:', err);
                    this.loading = false;
                }
            });
        }
    }

    editarEtapa(id: string): void {
        this.router.navigate(['/admin/etapas-boleta/editar', id]);
    }

    nuevaEtapa(): void {
        this.router.navigate(['/admin/etapas-boleta/new']);
    }
}
