document.addEventListener("DOMContentLoaded", function () {
    const modulosPermisos = "http://localhost:3000/perfilModul/get_perfil_permisos_modulos";
    let perfiles = [];
    let permisos = []; // Array para almacenar todos los permisos
    const modulosPorPagina = 10; // Máximo de módulos por página
    let paginaActual = 1; // Página actual (inicia en 1)

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

        // Escuchar cuando cambie el select
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
            mostrarPagina(paginaActual);
            actualizarPaginado();
        } catch (error) {
            console.error("Error al obtener permisos del perfil:", error);
        }
    }

    function llenarTablaPermisos(modulos) {
        const tbody = document.getElementById("modulosPermisosTable");
        tbody.innerHTML = ""; // Limpiar tabla

        modulos.forEach(p => {
            // Convertir el valor de los permisos de Buffer a 1 o 0
            const bitAgregar = p.bitAgregar.data[0] === 1;
            const bitEditar = p.bitEditar.data[0] === 1;
            const bitEliminar = p.bitEliminar.data[0] === 1;
            const bitConsultar = p.bitConsultar.data[0] === 1;
            const bitExportar = p.bitExportar.data[0] === 1;
            const bitBitacora = p.bitBitacora.data[0] === 1;
            const row = `
                <tr>
                    <td>${p.nombreModulo}</td>
                    <td><input type="checkbox" ${bitAgregar ? "checked" : ""} disabled></td>
                    <td><input type="checkbox" ${bitEditar ? "checked" : ""} disabled></td>
                    <td><input type="checkbox" ${bitEliminar ? "checked" : ""} disabled></td>
                    <td><input type="checkbox" ${bitConsultar ? "checked" : ""} disabled></td>
                    <td><input type="checkbox" ${bitExportar ? "checked" : ""} disabled></td>
                    <td><input type="checkbox" ${bitBitacora ? "checked" : ""} disabled></td>
                </tr>
            `;
            tbody.insertAdjacentHTML("beforeend", row);
        });
    }

    function mostrarPagina(pagina) {
        const inicio = (pagina - 1) * modulosPorPagina;
        const fin = inicio + modulosPorPagina;
        const modulosPagina = permisos.slice(inicio, fin); // Extraer solo los módulos correspondientes a la página actual
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
