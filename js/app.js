// app.js - Este archivo contendrá la lógica específica de Seats.io y la gestión de la reserva
// También manejará el modal de pagos.

document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos HTML de Seats.io y reserva
    const seatsioChartContainer = document.getElementById('seatsio-chart');
    const selectedSeatsDisplay = document.getElementById('selected-seats');
    const totalPriceSpan = document.getElementById('total-price');
    const bookingForm = document.getElementById('booking-form');
    const openPaymentModalBtn = document.getElementById('openPaymentModalBtn'); // Nuevo botón para abrir el modal de pagos

    // Referencias a los elementos HTML del modal de pagos
    const paymentModal = document.getElementById('paymentModal');
    const closePaymentModalBtn = paymentModal ? paymentModal.querySelector('.close-button') : null;
    const paymentForm = document.getElementById('paymentForm');
    const body = document.body; // Para controlar el scroll del body

    // ===========================================
    // Lógica para Seats.io (existente)
    // ===========================================
    if (seatsioChartContainer) {
        new seatsio.SeatingChart({
            divId: 'seatsio-chart',
            // Tu Public Key de Seats.io
            publicKey: 'tu_public_key_seatsio', // ¡IMPORTANTE! Reemplaza con tu clave pública
            // La Chart Key de tu evento específico
            event: 'tu_chart_key_del_evento', // ¡IMPORTANTE! Reemplaza con la clave de tu plano
            
            onSelectionChange: (selectedObjects) => {
                let totalPrice = 0;
                selectedSeatsDisplay.innerHTML = ''; 

                if (selectedObjects.length === 0) {
                    selectedSeatsDisplay.innerHTML = '<p class="text-placeholder">Selecciona asientos en el plano</p>';
                } else {
                    selectedObjects.forEach(object => {
                        const price = object.price || 0; 
                        totalPrice += price;
                        const seatName = object.label || object.id; 
                        
                        const seatItem = document.createElement('p');
                        seatItem.classList.add('seat-item');
                        seatItem.innerHTML = `<span>${seatName}</span> <span>$${price.toFixed(2)}</span>`;
                        selectedSeatsDisplay.appendChild(seatItem);
                    });
                }
                totalPriceSpan.textContent = `$${totalPrice.toFixed(2)}`;
            },
            // Opciones adicionales, por ejemplo, para categorías o precios
            // pricing: [
            //     { category: 'A', price: 100 },
            //     { category: 'B', price: 80 }
            // ],
            // showMinimap: true,
            // ... otras configuraciones
        }).render();
    }

    // ===========================================
    // Lógica para el Formulario de Reserva y Modal de Pagos
    // ===========================================

    // Función para abrir un modal
    function openModal(modalElement) {
        if (modalElement) {
            modalElement.classList.add('show');
            body.classList.add('no-scroll'); // Previene el scroll del fondo
        }
    }

    // Función para cerrar un modal
    function closeModal(modalElement) {
        if (modalElement) {
            modalElement.classList.remove('show');
            body.classList.remove('no-scroll'); // Habilita el scroll del fondo
        }
    }

    // Abre el modal de pagos al hacer clic en "Confirmar reserva"
    if (openPaymentModalBtn) {
        openPaymentModalBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evita que el formulario se envíe directamente

            // Validar campos de nombre y email antes de abrir el modal de pago
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');

            if (!nameInput.value || !emailInput.value) {
                alert('Por favor, ingresa tu nombre completo y email.'); // Usar un modal de alerta custom en producción
                return;
            }

            const selectedSeatsCount = selectedSeatsDisplay.querySelectorAll('.seat-item').length;
            if (selectedSeatsCount === 0) {
                alert('Por favor, selecciona al menos un asiento.'); // Usar un modal de alerta custom en producción
                return;
            }

            openModal(paymentModal);
        });
    }

    // Cierra el modal de pagos
    if (closePaymentModalBtn) {
        closePaymentModalBtn.addEventListener('click', () => {
            closeModal(paymentModal);
        });
    }

    // Cierra el modal de pagos si se hace clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === paymentModal) {
            closeModal(paymentModal);
        }
    });

    // Manejo del envío del formulario de pago
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Previene el envío por defecto del formulario

            const cardNumber = document.getElementById('cardNumber').value;
            const cardHolderName = document.getElementById('cardHolderName').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;
            const cardHolderID = document.getElementById('cardHolderID').value;
            const totalAmount = totalPriceSpan.textContent; // Obtener el total

            // SIMULACIÓN DE PROCESO DE PAGO
            console.log('Iniciando proceso de pago con los siguientes datos (simulados):');
            console.log('Número de Tarjeta:', cardNumber.replace(/\s/g, '')); // Quitar espacios
            console.log('Nombre del Titular:', cardHolderName);
            console.log('Fecha de Expiración:', expiryDate);
            console.log('CVV:', cvv);
            console.log('Cédula/RIF:', cardHolderID);
            console.log('Monto Total:', totalAmount);
            
            // =========================================================================================
            // !!! ADVERTENCIA DE SEGURIDAD CRÍTICA !!!
            // =========================================================================================
            // Las siguientes operaciones (encriptación AES, cálculo de hash SHA256 y la llamada
            // a la API del banco) DEBEN realizarse en un SERVIDOR SEGURO (BACKEND).
            // NUNCA expongas tus claves de cifrado o realices estas operaciones directamente
            // desde el JavaScript del lado del cliente.
            // Esto es solo una demostración del flujo en el frontend.
            // =========================================================================================

            alert('Procesando pago... (Recuerda: la lógica de pago real con el banco debe ir en tu backend por seguridad).'); // Usar un modal custom en producción

            // En un escenario real, aquí se enviarían los datos (posiblemente ya tokenizados
            // por un proveedor de pagos PCI-DSS si no se envía la tarjeta directamente)
            // a tu backend. Tu backend sería el encargado de:
            // 1. Obtener/refrescar la WorkingKey del Banco Nacional de Crédito.
            // 2. Construir el objeto de petición de pago.
            // 3. Calcular el SHA256 hash.
            // 4. Encriptar el valor de la petición con AES.
            // 5. Enviar la petición POST a la API del BNC.
            // 6. Manejar la respuesta del BNC (éxito/error, desencriptar, validar hash).
            // 7. Notificar al frontend el resultado.

            // Ejemplo de llamada simulada a un backend (comentar o reemplazar)
            /*
            fetch('/api/process-payment', { // URL de tu API de backend
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    cardNumber: cardNumber, // NO ENVIAR ASÍ EN PRODUCCIÓN SIN TOKENIZACIÓN
                    cardHolderName: cardHolderName,
                    expiryDate: expiryDate,
                    cvv: cvv, // NO ENVIAR ASÍ EN PRODUCCIÓN SIN TOKENIZACIÓN
                    cardHolderID: cardHolderID,
                    amount: totalAmount,
                    // ... otros datos necesarios para tu backend
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log('Respuesta del backend:', data);
                if (data.success) {
                    alert('Pago exitoso!'); // Usar modal custom
                    closeModal(paymentModal);
                    // Redirigir o mostrar confirmación
                } else {
                    alert('Error en el pago: ' + data.message); // Usar modal custom
                }
            })
            .catch(error => {
                console.error('Error al comunicarse con el backend:', error);
                alert('Ocurrió un error al procesar tu pago.'); // Usar modal custom
            });
            */

            // Resetear el formulario de pago después de la simulación
            paymentForm.reset();
            // Mantener el modal abierto para propósitos de demostración o cerrarlo en éxito
            // closeModal(paymentModal); // Descomentar para cerrar el modal automáticamente
        });
    }

});
