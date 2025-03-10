document.addEventListener("DOMContentLoaded", function () {
    const employeeData = localStorage.getItem("employeeToEdit");

    if (employeeData) {
        const employee = JSON.parse(employeeData);

        // Convertir fecha UTC a local sin modificar el día
        function formatDateToInput(dateString) {
            if (!dateString) return ''; // Evita errores si la fecha es null o undefined

            const date = new Date(dateString);
            const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Corrige la zona horaria

            return localDate.toISOString().split("T")[0]; // Devuelve formato YYYY-MM-DD
        }

        const formattedDate = employee.fecha_contratacion ? formatDateToInput(employee.fecha_contratacion) : "";


        // Llenar los campos del formulario con los datos actuales
        document.getElementById("id_empleado").value = employee.id_empleado;
        document.getElementById("nombre").value = employee.nombre;
        document.getElementById("apellidos").value = employee.apellidos;
        document.getElementById("puesto").value = employee.puesto;
        document.getElementById("salario").value = employee.salario;
        document.getElementById("fecha_contratacion").value = formattedDate;
        document.getElementById("telefono").value = employee.telefono;
        document.getElementById("correo").value = employee.correo;
        document.getElementById("direccion").value = employee.direccion;
        document.getElementById("estado").value = employee.estado;
    }
});

// Manejar el envío del formulario y actualizar los datos en la API
document.getElementById("employeeForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Evita que la página se recargue

    const idEmpleado = document.getElementById("id_empleado").value;

    const updatedEmployee = {
        nombre: document.getElementById("nombre").value,
        apellidos: document.getElementById("apellidos").value,
        puesto: document.getElementById("puesto").value,
        salario: parseFloat(document.getElementById("salario").value),
        fecha_contratacion: document.getElementById("fecha_contratacion").value,
        telefono: document.getElementById("telefono").value,
        correo: document.getElementById("correo").value,
        direccion: document.getElementById("direccion").value,
        estado: document.getElementById("estado").value
    };


    // Enviar actualización a la API si hubo cambios
    fetch(`https://api-corp-tort.onrender.com/empleados/update_Empleado/${idEmpleado}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedEmployee)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Error al actualizar el empleado");
            }
            return response.json();
        })
        .then(() => {
            alert("Empleado actualizado correctamente.");
            localStorage.removeItem("employeeToEdit"); // Limpiar localStorage
            window.location.href = "dashboard.html"; // Redirigir al dashboard
        })
        .catch(error => console.error("Error al actualizar:", error));
});
