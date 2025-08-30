import { Injectable } from '@angular/core';
import { loadMercadoPago } from "@mercadopago/sdk-js";
import { environment } from '../../env/environment';

declare var window: any;

@Injectable({
    providedIn: 'root'
})
export class MercadoPagoService {
    environment = environment;
    private readonly publicKey = environment.public_key; // <-- IMPORTANT: Replace with your public key
    private readonly apiUrl: string = 'YOUR_API_URL'; // <-- IMPORTANT: Replace with your backend API URL
    private mp: any;

    constructor() { }

    public async loadMp(amount: string) {
        await loadMercadoPago();
        this.mp = new window.MercadoPago(this.publicKey);

        const cardForm = this.mp.cardForm({
            amount: amount,
            iframe: true,
            form: {
                id: "form-checkout",
                cardNumber: {
                    id: "form-checkout__cardNumber",
                    placeholder: "Card Number",
                },
                expirationDate: {
                    id: "form-checkout__expirationDate",
                    placeholder: "MM/YY",
                },
                securityCode: {
                    id: "form-checkout__securityCode",
                    placeholder: "Security Code",
                },
                cardholderName: {
                    id: "form-checkout__cardholderName",
                    placeholder: "Cardholder Name",
                },
                issuer: {
                    id: "form-checkout__issuer",
                    placeholder: "Issuer",
                },
                installments: {
                    id: "form-checkout__installments",
                    placeholder: "Installments",
                },
                identificationType: {
                    id: "form-checkout__identificationType",
                    placeholder: "Document Type",
                },
                identificationNumber: {
                    id: "form-checkout__identificationNumber",
                    placeholder: "Document Number",
                },
                cardholderEmail: {
                    id: "form-checkout__cardholderEmail",
                    placeholder: "Email",
                },
            },
            callbacks: {
                onFormMounted: (error: any) => {
                    if (error) {
                        console.warn("Form Mounted handling error:", error);
                        // Handle error display to the user
                        return;
                    }
                    console.log("Form mounted");
                },
                onSubmit: (event: any) => {
                    event.preventDefault();
                    const {
                        paymentMethodId: payment_method_id,
                        issuerId: issuer_id,
                        cardholderEmail: email,
                        amount,
                        token,
                        installments,
                        identificationNumber,
                        identificationType,
                    } = cardForm.getCardFormData();

                    // This is where you would send the data to your backend
                    console.log('Submitting payment to backend...');
                    fetch(this.apiUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            token,
                            issuer_id,
                            payment_method_id,
                            transaction_amount: Number(amount),
                            installments: Number(installments),
                            description: "Product Description", // Customize description
                            payer: {
                                email,
                                identification: {
                                    type: identificationType,
                                    number: identificationNumber,
                                },
                            }
                        }),
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error("Failed to process payment");
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log("Payment processed:", data);
                            // Handle successful payment (e.g., redirect to a success page)
                        })
                        .catch(error => {
                            console.error("Payment error:", error);
                            // Handle payment error (e.g., show an error message)
                        });
                },
                onFetching: (resource: any) => {
                    console.log("Fetching resource: ", resource);
                }
            }
        });
    }
}
