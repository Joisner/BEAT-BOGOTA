import { Component, OnInit } from '@angular/core';
import { PromoterService } from '../../../core/services/promoter.service';
import { Promoter } from '../../../core/models/promoter.model';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';
import { RouterModule } from '@angular/router';
import { LoadingComponent } from '../../../single-pages/loading/loading.component';

@Component({
    standalone: true,
    imports: [CommonModule, LucideAngularModule, IconsModule, RouterModule, LoadingComponent],
    selector: 'app-promotor-list',
    templateUrl: './promotor-list.component.html',
    styleUrls: ['./promotor-list.component.css']
})
export class PromotorListComponent implements OnInit {
    promoters: Promoter[] = []

    constructor(private promoterService: PromoterService) {}
  
    ngOnInit(): void {
      this.loadPromoters()
    }
  
    private loadPromoters(): void {
      this.promoterService.getPromoters().subscribe({
        next: (promoters) => {
          this.promoters = promoters
        },
        error: (error) => {
          console.error(`No fue posible cargar promotores ${error}`)
        },
      })
    }
  
    deletePromoter(id: string): void {
      if (confirm("¿Estás seguro de que deseas eliminar este promotor?")) {
        this.promoterService.deletePromoter(id).subscribe({
          next: () => {
            this.loadPromoters() // Reload the list
            console.log("Promotor eliminado exitosamente")
          },
          error: (error) => {
            console.error("Error al eliminar promotor:", error)
          },
        })
      }
    }
  }
  