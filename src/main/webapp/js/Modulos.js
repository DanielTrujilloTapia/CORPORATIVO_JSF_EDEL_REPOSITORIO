document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://api-corp-tort.onrender.com/modulos/get_modulos";
    const permisosUrl = "http://localhost:3000/permisos/get_permisos_modulo";
    const tableBody = document.getElementById("moduloTable");
    const pagination = document.getElementById("pagination");
    const btnAgregar = document.getElementById("boton-agregar");
    const tablaConsultar = document.getElementById("consultar-tabla");
    const itemsPerPage = 10;
    let modulos = [];
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
            const response = await fetch(`${permisosUrl}?idPerfil=${idPerfil}&nombreModulo=Modulos`);
            const data = await response.json();

            if (Array.isArray(data) && data.length > 0) {
                permisos.bitEditar = data[0].bitEditar.data[0];
                permisos.bitEliminar = data[0].bitEliminar.data[0];
                permisos.bitAgregar = data[0].bitAgregar?.data[0] ?? 0;
                permisos.bitConsultar = data[0].bitConsultar?.data[0] ?? 0;

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

    // FUNCIÓN ASÍNCRONA PARA OBTENER LOS MÓDULOS
    async function fetchModulos() {
        try {
            const response = await fetch(apiUrl);
            modulos = await response.json();
            renderTable();
        } catch (error) {
            console.error("Error al obtener módulos:", error);
        }
    }

    // FUNCIÓN PARA MOSTRAR LOS MÓDULOS EN LA TABLA
    function renderTable() {
        tableBody.innerHTML = "";
        const start = (currentPage - 1) * itemsPerPage;
        const paginatedModulos = modulos.slice(start, start + itemsPerPage);

        paginatedModulos.forEach(modulo => {
            const row = document.createElement("tr");
            row.setAttribute("data-id", modulo.id_modulo);

            const editarBtn = permisos.bitEditar
                ? `<button class="btn btn-warning btn-sm" onclick="editModulo(${modulo.id_modulo})">Editar</button>`
                : "";

            const eliminarBtn = permisos.bitEliminar
                ? `<button class="btn btn-danger btn-sm" onclick="deleteModulo(${modulo.id_modulo})">Eliminar</button>`
                : "";

            row.innerHTML = ` 
                <td>${modulo.id_modulo}</td>
                <td>${modulo.nombreModulo}</td>
                <td class="text-sm-center">
                    ${editarBtn}
                    ${eliminarBtn}
                </td>
            `;
            tableBody.appendChild(row);
        });

        renderPagination();
    }

    // FUNCIÓN PARA PAGINAR LOS MÓDULOS
    function renderPagination() {
        pagination.innerHTML = "";
        const totalPages = Math.ceil(modulos.length / itemsPerPage);

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

    // ELIMINAR MÓDULO
    window.deleteModulo = async function (id) {
        alert("Módulo eliminado");
        // Aquí iría la lógica real para eliminar el módulo si la activas en el futuro
    };

    // EDITAR MÓDULO
    window.editModulo = function (id) {
        alert("Módulo editado");
        // Aquí iría la lógica real para redirigir y editar el módulo si la activas en el futuro
    };

    // INICIAR PROCESO
    async function init() {
        await fetchPermisos();
        await fetchModulos();
    }

    init();
});
