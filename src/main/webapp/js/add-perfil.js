// Función asincrónica para enviar los datos del formulario
async function guardarPerfil(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores de los campos del formulario
    const nombrePerfil = document.getElementById('nombrePerfil').value;

    try {
        // Hacer la petición POST a la API
        const response = await fetch('http://localhost:3000/perfiles/post_perfil', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({nombrePerfil: nombrePerfil})
        });

        // Comprobar si la respuesta fue exitosa
        if (response.ok) {
            // Mostrar un mensaje de éxito
            alert('Perfil agregado con éxito');
            // Opcionalmente, puedes redirigir al usuario al modulo Perfiles o limpiar el formulario
            window.location.href = 'Perfiles.html'; // Redirigir a la página de dashboard
        } else {
            // Mostrar un mensaje de error si la respuesta no fue exitosa
            alert('Error al agregar el perfil');
        }
    } catch (error) {
        // Manejar errores de red o problemas en la solicitud
        console.error('Error al enviar los datos:', error);
        alert('Hubo un error al intentar guardar el perfil');
    }
}

// Asignar el evento de submit del formulario para llamar a la función guardarEmpleado
document.getElementById('perfilForm').addEventListener('submit', guardarPerfil);
