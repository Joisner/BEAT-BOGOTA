import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EtapaBoletaService } from '../../../core/services/etapa-boleta.service';
import { EtapaBoleta } from '../../../core/models/etapa-boleta.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { IconsModule } from '../../../core/module/icons.module';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/event.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, LucideAngularModule, IconsModule],
    selector: 'app-etapa-boleta-form',
    templateUrl: './etapa-boleta-form.component.html',
    styleUrls: ['./etapa-boleta-form.component.css']
})
export class EtapaBoletaFormComponent implements OnInit {
    stageForm!: FormGroup
    isSubmitting = false
    editMode = false
    private stageId: number | null = null
    pageTitle = "Crear Etapa de Boleta"
    submitButtonText = "Crear Etapa"

    events: Event[] = []
    selectedEvent: Event | null = null

    constructor(
        private fb: FormBuilder,
        private etapaBoletaService: EtapaBoletaService,
        private eventService: EventService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.initForm()
        this.checkMode()
        this.loadEvents()
    }

    private initForm(): void {
        this.stageForm = this.fb.group({
            name: ["", [Validators.required, Validators.minLength(3)]],
            price: ["", [Validators.required]],
            availability: ["", [Validators.required]],
            start_date: ["", [Validators.required]],
            end_date: ["", [Validators.required]],
            event_id: ["", [Validators.required]],
            active: [true],
        })

        this.stageForm.setValidators(this.dateRangeValidator)
    }

    private checkMode(): void {
        this.route.paramMap.subscribe((params) => {
            const id = params.get("id")
            if (id) {
                this.editMode = true
                this.stageId = +id
                this.pageTitle = "Editar Etapa de Boleta"
                this.submitButtonText = "Guardar Cambios"
                this.loadStageData(String(this.stageId))
            }
        })
    }

    private loadEvents(): void {
        this.eventService.getEvents().subscribe({
            next: (events) => {
                this.events = events
            },
            error: (error) => {
                console.error("No fue posible cargar eventos", error)
            },
        })
    }

    private loadStageData(id: string): void {
        this.etapaBoletaService.getEtapa(id).subscribe({
            next: (stage) => {
                if (stage) {
                    this.stageForm.patchValue({
                        ...stage,
                        start_date: this.formatDateForInput(stage.start_date),
                        end_date: this.formatDateForInput(stage.end_date),
                    })
                    this.onEventChange()
                } else {
                    this.router.navigate(["/admin/etapas"])
                }
            },
            error: () => this.router.navigate(["/admin/etapas"]),
        })
    }

    private formatDateForInput(date: Date): string {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = ("0" + (d.getMonth() + 1)).slice(-2)
        const day = ("0" + d.getDate()).slice(-2)
        const hours = ("0" + d.getHours()).slice(-2)
        const minutes = ("0" + d.getMinutes()).slice(-2)
        return `${year}-${month}-${day}T${hours}:${minutes}`
    }

    dateRangeValidator(group: any) {
        const fechaInicio = group.get("start_date")?.value
        const fechaFin = group.get("end_date")?.value

        if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
            return { dateRangeInvalid: true }
        }
        return null
    }

    onEventChange(): void {
        const eventId = this.stageForm.get("event_id")?.value
        this.selectedEvent = this.events.find((event) => event.id === +eventId) || null
    }

    onSubmit(): void {
        if (this.stageForm.invalid) {
            this.stageForm.markAllAsTouched()
            this.showFormErrors()
            return
        }

        this.isSubmitting = true
        const formValue = this.stageForm.value

        const stageData: Partial<EtapaBoleta> = {
            name: formValue.name,
            start_date: new Date(formValue.start_date),
            end_date: new Date(formValue.end_date),
            price: Number.parseFloat(formValue.price),
            availability: Number.parseInt(formValue.availability),
            active: formValue.active,
            event_id: String(formValue.event_id),       
        }

        const operation =
            this.editMode && this.stageId
                ? this.etapaBoletaService.updateEtapa(String(this.stageId), stageData)
                : this.etapaBoletaService.createEtapa(String(this.selectedEvent?.id) || "", stageData as EtapaBoleta)

        operation.subscribe({
            next: (result) => {
                this.showSuccessMessage()
                setTimeout(() => {
                    this.router.navigate(["/admin/etapas"])
                }, 1500)
            },
            error: (err) => {
                console.error("Error saving stage:", err)
                this.showErrorMessage()
                this.isSubmitting = false
            },
        })
    }

    private showFormErrors(): void {
        console.log("Form has errors, please check all fields")
        const firstError = document.querySelector(".text-red-400")
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }

    private showSuccessMessage(): void {
        console.log("¡Etapa de boleta creada exitosamente!")
    }

    private showErrorMessage(): void {
        console.log("Error al crear la etapa de boleta. Por favor intenta de nuevo.")
    }

    isFieldInvalid(fieldName: string): boolean {
        const field = this.stageForm.get(fieldName)
        return field ? field.invalid && field.touched : false
    }

    getFieldError(fieldName: string): string {
        const field = this.stageForm.get(fieldName)
        if (!field || !field.errors || !field.touched) {
            return ""
        }

        if (field.errors["required"]) {
            return "Este campo es requerido"
        }
        if (field.errors["minlength"]) {
            return `Mínimo ${field.errors["minlength"].requiredLength} caracteres`
        }
        if (field.errors["maxlength"]) {
            return `Máximo ${field.errors["maxlength"].requiredLength} caracteres`
        }
        if (field.errors["min"]) {
            return `El valor mínimo es ${field.errors["min"].min}`
        }
        if (field.errors["max"]) {
            return `El valor máximo es ${field.errors["max"].max}`
        }

        return "Campo inválido"
    }

    resetForm(): void {
        this.stageForm.reset({
            activa: true,
        })
        this.selectedEvent = null
    }

    calculateDiscountedPrice(): number | null {
        const precio = this.stageForm.get("precio")?.value
        const descuento = this.stageForm.get("descuento_porcentaje")?.value

        if (precio && descuento) {
            return precio - precio * (descuento / 100)
        }
        return null
    }
}
