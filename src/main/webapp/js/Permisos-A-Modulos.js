document.addEventListener("DOMContentLoaded", function () {
    const modulosPermisos = "http://localhost:3000/perfilModul/get_perfil_permisos_modulos";
    let perfiles = [];
    let permisos = [];
    const modulosPorPagina = 10;
    let paginaActual = 1;
    let isEditing = false; // Variable para controlar el modo edición

    // Agregar botón de edición al HTML
    const editButton = document.createElement("button");
    editButton.id = "editButton";
    editButton.textContent = "Editar";
    document.querySelector(".container").prepend(editButton); // Ajusta el selector según tu HTML

    async function fetchPerfiles() {
        try {
            const response = await fetch("https://api-corp-tort.onrender.com/perfiles/get_perfiles");
            perfiles = await response.json();
            fillSelectPerfil();
        } catch (error) {
            console.error("Error al obtener perfiles:", error);
        }
    }

    function fillSelectPerfil() {
        const selectPerfil = document.getElementById("selectPerfil");
        if (!selectPerfil) return;

        selectPerfil.innerHTML = '<option value="">-- Selecciona un perfil --</option>';

        perfiles.forEach(perfil => {
            const option = document.createElement("option");
            option.value = perfil.id_perfil;
            option.textContent = perfil.nombrePerfil;
            selectPerfil.appendChild(option);
        });

        selectPerfil.addEventListener("change", async function () {
            const selectedId = this.value;
            if (selectedId) {
                await cargarPermisosPerfil(selectedId);
            } else {
                document.getElementById("modulosPermisosTable").innerHTML = "";
            }
        });
    }

    async function cargarPermisosPerfil(idPerfil) {
        try {
            const response = await fetch(`${modulosPermisos}?idPerfil=${idPerfil}`);
            permisos = await response.json();

            // Convertir Buffers a números
            permisos.forEach(p => {
                p.bitAgregar = p.bitAgregar.data[0];
                p.bitEditar = p.bitEditar.data[0];
                p.bitEliminar = p.bitEliminar.data[0];
                p.bitConsultar = p.bitConsultar.data[0];
                p.bitExportar = p.bitExportar.data[0];
                p.bitBitacora = p.bitBitacora.data[0];

                // Asegurar que existan estas propiedades
                p.idPerfil = p.idPerfil || p.id_perfil; // Si viene como id_perfil
                p.idModulo = p.idModulo || p.id_modulo; // Si viene como id_modulo
            });

            mostrarPagina(paginaActual);
            actualizarPaginado();
        } catch (error) {
            console.error("Error al obtener permisos del perfil:", error);
        }
    }

    function llenarTablaPermisos(modulos) {
        const tbody = document.getElementById("modulosPermisosTable");
        tbody.innerHTML = "";

        modulos.forEach(p => {
            const row = `
                <tr data-id-perfil="${p.idPerfil}" data-id-modulo="${p.idModulo}">
                    <td>${p.nombreModulo}</td>
                    <td><input type="checkbox" ${p.bitAgregar ? "checked" : ""} ${isEditing ? "" : "disabled"}></td>
                    <td><input type="checkbox" ${p.bitEditar ? "checked" : ""} ${isEditing ? "" : "disabled"}></td>
                    <td><input type="checkbox" ${p.bitEliminar ? "checked" : ""} ${isEditing ? "" : "disabled"}></td>
                    <td><input type="checkbox" ${p.bitConsultar ? "checked" : ""} ${isEditing ? "" : "disabled"}></td>
                    <td><input type="checkbox" ${p.bitExportar ? "checked" : ""} ${isEditing ? "" : "disabled"}></td>
                    <td><input type="checkbox" ${p.bitBitacora ? "checked" : ""} ${isEditing ? "" : "disabled"}></td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", row);
        });

        // Agregar event listeners a los checkboxes
        const checkboxes = tbody.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener("change", function() {
                const row = this.closest("tr");
                const idPerfil = row.dataset.idPerfil;
                const idModulo = row.dataset.idModulo;
                const permiso = permisos.find(p =>
                    p.idPerfil == idPerfil && p.idModulo == idModulo
                );

                console.log(permiso);

                if (permiso) {
                    const cellIndex = this.parentElement.cellIndex;
                    const value = this.checked ? 1 : 0;

                    switch(cellIndex) {
                        case 1: permiso.bitAgregar = value; break;
                        case 2: permiso.bitEditar = value; break;
                        case 3: permiso.bitEliminar = value; break;
                        case 4: permiso.bitConsultar = value; break;
                        case 5: permiso.bitExportar = value; break;
                        case 6: permiso.bitBitacora = value; break;
                    }
                }
            });
        });
    }

    // Función para guardar cambios
    async function guardarPermisos() {
        try {
            for (const permiso of permisos) {
                const response = await fetch("http://localhost:3000/perfilModul/update_perfil_permisos_modulo", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idPerfil: permiso.idPerfil,
                        idModulo: permiso.idModulo,
                        bitAgregar: permiso.bitAgregar,
                        bitEditar: permiso.bitEditar,
                        bitEliminar: permiso.bitEliminar,
                        bitConsultar: permiso.bitConsultar,
                        bitExportar: permiso.bitExportar,
                        bitBitacora: permiso.bitBitacora
                    })
                });

                if (!response.ok) throw new Error("Error en la actualización");
            }

            alert("Permisos actualizados correctamente");
        } catch (error) {
            console.error("Error:", error);
            alert("Error al guardar permisos");
        }
    }

    // Event listener para el botón de edición
    editButton.addEventListener("click", function() {
        if (!isEditing) {
            isEditing = true;
            this.textContent = "Guardar";
            mostrarPagina(paginaActual);
        } else {
            isEditing = false;
            this.textContent = "Editar";
            mostrarPagina(paginaActual);
            guardarPermisos();
        }
    });

    // Resto del código sin cambios (mostrarPagina, actualizarPaginado, init)
    function mostrarPagina(pagina) {
        const inicio = (pagina - 1) * modulosPorPagina;
        const fin = inicio + modulosPorPagina;
        const modulosPagina = permisos.slice(inicio, fin);
        llenarTablaPermisos(modulosPagina);
    }

    function actualizarPaginado() {
        const totalModulos = permisos.length;
        const totalPaginas = Math.ceil(totalModulos / modulosPorPagina);
        const paginacion = document.getElementById("paginacion");
        paginacion.innerHTML = ""; // Limpiar paginación

        // Botón "Anterior"
        const btnAnterior = document.createElement("button");
        btnAnterior.textContent = "Anterior";
        btnAnterior.disabled = paginaActual === 1;
        btnAnterior.addEventListener("click", function () {
            if (paginaActual > 1) {
                paginaActual--;
                mostrarPagina(paginaActual);
                actualizarPaginado();
            }
        });
        paginacion.appendChild(btnAnterior);

        // Botones de páginas
        for (let i = 1; i <= totalPaginas; i++) {
            const btnPagina = document.createElement("button");
            btnPagina.textContent = i;
            btnPagina.disabled = i === paginaActual;
            btnPagina.addEventListener("click", function () {
                paginaActual = i;
                mostrarPagina(paginaActual);
                actualizarPaginado();
            });
            paginacion.appendChild(btnPagina);
        }

        // Botón "Siguiente"
        const btnSiguiente = document.createElement("button");
        btnSiguiente.textContent = "Siguiente";
        btnSiguiente.disabled = paginaActual === totalPaginas;
        btnSiguiente.addEventListener("click", function () {
            if (paginaActual < totalPaginas) {
                paginaActual++;
                mostrarPagina(paginaActual);
                actualizarPaginado();
            }
        });
        paginacion.appendChild(btnSiguiente);
    }

    async function init() {
        await fetchPerfiles();
    }

    init();
});
