document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://api-corp-tort.onrender.com/perfiles/get_perfiles";
    const permisosUrl = "http://localhost:3000/permisos/get_permisos_modulo";
    const tableBody = document.getElementById("perfilTable");
    const pagination = document.getElementById("pagination");
    const btnAgregar = document.getElementById("boton-agregar");
    const tablaConsultar = document.getElementById("consultar-tabla");
    const itemsPerPage = 10;
    let perfiles = [];
    let currentPage = 1;
    let permisos = { bitEditar: 0, bitEliminar: 0, bitAgregar: 0, bitConsultar: 0 };


    async function fetchPermisos() {
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const idPerfil = usuario?.idPerfil;

        if (!idPerfil) {
            console.error("No se encontró idPerfil en el localStorage");
            return;
        }

        try {
            const response = await fetch(`${permisosUrl}?idPerfil=${idPerfil}&nombreModulo=Perfiles`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                permisos.bitEditar = data[0].bitEditar.data[0];
                permisos.bitEliminar = data[0].bitEliminar.data[0];
                permisos.bitAgregar = data[0].bitAgregar?.data[0] ?? 0;
                permisos.bitConsultar = data[0].bitConsultar?.data[0] ?? 0;

                // Mostrar u ocultar botón agregar según permiso
                if (btnAgregar) {
                    btnAgregar.style.display = permisos.bitAgregar ? "inline-block" : "none";
                }
                if (tablaConsultar) {
                    tablaConsultar.style.display = permisos.bitConsultar ? "inline-block" : "none";
                }

            }
        } catch (error) {
            console.error("Error al obtener permisos:", error);
        }
    }

    // FUNCIÓN ASÍNCRONA PARA OBTENER LOS PERFILES
    async function fetchPerfiles() {
        try {
            const response = await fetch(apiUrl);
            perfiles = await response.json();
            renderTable();
        } catch (error) {
            console.error("Error al obtener perfiles:", error);
        }
    }

    // FUNCIÓN PARA MOSTRAR LOS PERFILES EN LA TABLA
    function renderTable() {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedPerfiles = perfiles.slice(start, start + itemsPerPage);

        paginatedPerfiles.forEach(perfil => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", perfil.id_perfil); // Asegúrate de que el id corresponda a la propiedad correcta

            const editarBtn = permisos.bitEditar
                ? `<button class="btn btn-warning btn-sm" onclick="editPerfil(${perfil.id_perfil})">Editar</button>`
                : "";

            const eliminarBtn = permisos.bitEliminar
                ? `<button class="btn btn-danger btn-sm" onclick="deletePerfil(${perfil.id_perfil})">Eliminar</button>`
                : "";

            row.innerHTML = ` 
                <td>${perfil.id_perfil}</td>
                <td>${perfil.nombrePerfil}</td>
                <td class="text-sm-center">
                     ${editarBtn}
                    ${eliminarBtn}
                </td>
            `;
            tableBody.appendChild(row);
        });

        renderPagination();
    }

    // FUNCIÓN PARA PAGINAR LOS PERFILES
    function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(perfiles.length / itemsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement("li");
            li.classList.add("page-item");
            if (i === currentPage) li.classList.add("active");

            const a = document.createElement("a");
            a.classList.add("page-link");
            a.href = "#";
            a.textContent = i;
            a.addEventListener("click", function (event) {
                event.preventDefault();
                currentPage = i;
                renderTable();
            });

            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    // ELIMINAR PERFIL
    window.deletePerfil = async function (id) {
        // if (confirm("¿Seguro que quieres eliminar este perfil?")) {
        //     try {
        //         await fetch(`https://api-corp-tort.onrender.com/empleados/delete_empleado/${id}`, {
        //             method: "DELETE",
        //             headers: { "Content-Type": "application/json" }
        //         });
        //
        //         perfiles = perfiles.filter(p => p.id_empleado !== id);
        //
        //         const rowToDelete = document.querySelector(`tr[data-id="${id}"]`);
        //         if (rowToDelete) {
        //             rowToDelete.remove();
        //         }
        //
        //         renderPagination();
        //     } catch (error) {
        //         console.error("Error al eliminar:", error);
        //     }
        // }
        alert("Usuario eliminado");
    };

    // EDITAR PERFIL
    window.editPerfil = function (id) {
        // const perfil = perfiles.find(p => p.id_empleado === id);
        // if (perfil) {
        //     localStorage.setItem("perfilToEdit", JSON.stringify(perfil));
        //     window.location.href = "edit-employee.html";
        // }
        alert("Usuario Editado")
    };

    // INICIAR PROCESO: PRIMERO PERMISOS, LUEGO DATOS
    async function init() {
        await fetchPermisos();
        await fetchPerfiles();
    }

    init(); // 👈 Esta es la correcta

});
