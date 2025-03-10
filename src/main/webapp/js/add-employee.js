// Función asincrónica para enviar los datos del formulario
async function guardarEmpleado(event) {
    event.preventDefault(); // Prevenir el envío del formulario por defecto

    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const apellidos = document.getElementById('apellidos').value;
    const puesto = document.getElementById('puesto').value;
    const salario = document.getElementById('salario').value;
    const fechaContratacion = document.getElementById('fecha_contratacion').value;
    const telefono = document.getElementById('telefono').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;
    const estado = document.getElementById('estado').value;

    // Crear un objeto con los datos del empleado
    const empleado = {
        nombre: nombre,
        apellidos: apellidos,
        puesto: puesto,
        salario: salario,
        fecha_contratacion: fechaContratacion,
        telefono: telefono,
        correo: correo,
        direccion: direccion,
        estado: estado
    };

    try {
        // Hacer la petición POST a la API
        const response = await fetch('https://api-corp-tort.onrender.com/empleados/post_Empleado', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(empleado)
        });

        // Comprobar si la respuesta fue exitosa
        if (response.ok) {
            // Mostrar un mensaje de éxito
            alert('Empleado agregado con éxito');
            // Opcionalmente, puedes redirigir al usuario al dashboard o limpiar el formulario
            window.location.href = 'dashboard.html'; // Redirigir a la página de dashboard
        } else {
            // Mostrar un mensaje de error si la respuesta no fue exitosa
            alert('Error al agregar el empleado');
        }
    } catch (error) {
        // Manejar errores de red o problemas en la solicitud
        console.error('Error al enviar los datos:', error);
        alert('Hubo un error al intentar guardar el empleado');
    }
}

// Asignar el evento de submit del formulario para llamar a la función guardarEmpleado
document.getElementById('employeeForm').addEventListener('submit', guardarEmpleado);
