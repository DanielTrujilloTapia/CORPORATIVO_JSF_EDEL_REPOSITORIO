// Función asincrónica para enviar los datos del formulario
async function guardarModulo(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores de los campos del formulario
    const nombreModulo = document.getElementById('nombreModulo').value;

    try {
        // Hacer la petición POST a la API
        const response = await fetch('http://localhost:3000/modulos/post_modulo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nombreModulo: nombreModulo})
        });

        // Comprobar si la respuesta fue exitosa
        if (response.ok) {
            // Mostrar un mensaje de éxito
            alert('Modulo agregado con éxito');
            // Opcionalmente, puedes redirigir al usuario al modulo Modulos o limpiar el formulario
            window.location.href = 'Modulos.html'; // Redirigir a la página de dashboard de Modulos
        } else {
            // Mostrar un mensaje de error si la respuesta no fue exitosa
            alert('Error al agregar el modulo');
        }
    } catch (error) {
        // Manejar errores de red o problemas en la solicitud
        console.error('Error al enviar los datos:', error);
        alert('Hubo un error al intentar guardar el modulo');
    }
}

// Asignar el evento de submit del formulario para llamar a la función guardarEmpleado
document.getElementById('moduloForm').addEventListener('submit', guardarModulo);
