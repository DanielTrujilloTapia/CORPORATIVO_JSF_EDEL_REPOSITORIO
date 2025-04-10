document.addEventListener('DOMContentLoaded', () => {
    cargarSelects();
});

// Función para llenar los selects
async function cargarSelects() {
    try {
        const resModulos = await fetch('https://api-corp-tort.onrender.com/modulos/get_modulos');
        const modulos = await resModulos.json();
        const selectModulo = document.getElementById('selectModulo');
        modulos.forEach(mod => {
            const option = document.createElement('option');
            option.value = mod.id_modulo;
            option.textContent = mod.nombreModulo;
            selectModulo.appendChild(option);
        });

        const resPerfiles = await fetch('https://api-corp-tort.onrender.com/perfiles/get_perfiles');
        const perfiles = await resPerfiles.json();
        const selectPerfil = document.getElementById('selectPerfil');
        perfiles.forEach(perfil => {
            const option = document.createElement('option');
            option.value = perfil.id_perfil;
            option.textContent = perfil.nombrePerfil;
            selectPerfil.appendChild(option);
        });
    } catch (err) {
        console.error('Error al cargar selects:', err);
    }
}

// Función para obtener valor booleano de checkboxes (1 o 0)
function getCheckboxValue(id) {
    return document.getElementById(id).checked ? 1 : 0;
}

// Función para enviar los permisos
document.getElementById('perfilModuloForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const data = {
        idPerfil: document.getElementById('selectPerfil').value,
        idModulo: document.getElementById('selectModulo').value,
        bitAgregar: getCheckboxValue('bitAgregar'),
        bitEditar: getCheckboxValue('bitEditar'),
        bitEliminar: getCheckboxValue('bitEliminar'),
        bitConsultar: getCheckboxValue('bitConsultar'),
        bitExportar: getCheckboxValue('bitExportar'),
        bitBitacora: getCheckboxValue('bitBitacora')
    };

    try {
        const response = await fetch('http://localhost:3000/perfilModul/post_perfil_permisos_modulo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert('Permisos guardados correctamente.');
            document.getElementById('perfilModuloForm').reset();
        } else {
            const res = await response.json();
            alert('Error al guardar permisos: ' + res.error);
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        alert('Hubo un problema al enviar los datos.');
    }
});