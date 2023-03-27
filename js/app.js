const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const listaArticulos = document.querySelector("#lista-articulos");
let articulosCarrito = [];

cargarEventListeners();

// Al hacer click en el div listaArticulos ejecuta "agregarArticulo"
function cargarEventListeners() {
    // Agregar articulo
    listaArticulos.addEventListener("click", agregarArticulo);

    // Sumar 1 articulo que ya esta en el carrito
    carrito.addEventListener("click", sumarArticulo);

    // Elimina 1 articulo del carrito
    carrito.addEventListener("click", eliminarArticulo);

    // Muestra los articulos de Local Storage
    document.addEventListener("DOMContentLoaded", () => {
        articulosCarrito = JSON.parse(localStorage.getItem("carrito")) || [];

        carritoHTML();
    })

    // Vaciar el carrito
    vaciarCarritoBtn.addEventListener("click", () => {
        articulosCarrito = []; // Vaciamos el array
        limpiarHTMLCarrito();
    });
};

function agregarArticulo(e) {
    // Nos evita los jalones hacia arriba al agregar elementos al carrito
    e.preventDefault();

    // Si el elemento clicado contiene la clase HTML "agregar-carrito" seleccioname el 2 div padre ("card") 
    if (e.target.classList.contains("agregar-carrito")) {
        const articuloSeleccionado = e.target.parentElement.parentElement;
        leerDatosArticulo(articuloSeleccionado);
    }
};

// Elimina 1 articulo del carrito, primero identificamos la clase del elemento al que vamos a clicar para eliminar con  console.log(e.target.classList);

function eliminarArticulo(e) {
    // Debemos acceder al id del articulo que queremos eliminar para que nos borre exactamente ese, usamos console.log(e.target.getAttribute("data-id"));
    if (e.target.classList.contains("borrar-articulo")) {
        const articuloId = e.target.getAttribute("data-id");

        // Elimina del array de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(articulo => articulo.id !== articuloId);

        carritoHTML();
    }
};

// Despues de clicar "agregar-carrito", guardamos en un objeto (La imagen, el nombre, el precio, el id HTML y la cantidad)
function leerDatosArticulo(articulo) {

    const infoArticulo = {
        imagen: articulo.querySelector("img").src,
        titulo: articulo.querySelector("h4").textContent,
        precio: parseInt(articulo.querySelector(".precio span").textContent),
        id: articulo.querySelector("a").getAttribute("data-id"),
        cantidad: 1
    }
    /* --------------------------------------------------------------------------------------------------------------------------------------- */
    /* Actualizar solo la cantidad si compramos mas de uno igual */

    // Revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(articulo => articulo.id === infoArticulo.id);

    if (existe) {
        // Actualizamos la cantidad
        const articulos = articulosCarrito.map(articulo => {
            if (articulo.id === infoArticulo.id) {
                articulo.cantidad++;
                return articulo; // Retorna el objeto actualizado
            } else {
                return articulo; // Retorna los objetos que no sean duplicados
            }
        });
        articulosCarrito = [...articulos];
    }
    // Si no existe ya en el carrito simplemento lo agregamos
    else {
        articulosCarrito = [...articulosCarrito, infoArticulo];
    }
    /* Actualizar solo la cantidad si compramos mas de uno igual */

    /* --------------------------------------------------------------------------------------------------------------------------------------- */
    // Total carrito

    let totalPedido = 0;
    let articulosRepetidos = 0;
    let gastosEnvio = 0;

    articulosCarrito.forEach(function (articulo) {

        totalPedido += articulo.precio;

        if (articulo.cantidad >= 1) {
            totalPedido += articulo.precio * articulo.cantidad - articulo.precio;
            document.querySelector("#total-carrito").innerHTML =
                `Total pedido ${totalPedido}€`;
        }
        console.log(articulo.cantidad);
        console.log(totalPedido);
        console.log(`Gastos envio: ${gastosEnvio}`);

        if (articulo.cantidad > 1) {
            articulosRepetidos += articulo.cantidad;
        }
        if (totalPedido < 30) {
            gastosEnvio = 10;
            totalPedido = totalPedido + gastosEnvio;
            document.querySelector("#total-carrito").innerHTML =
                `Total pedido ${totalPedido}€`;
            document.querySelector("#gastos-envio").innerHTML =
                `10€ de gastos de envio en pedidos inferiores a 30€`;
        }
        if (totalPedido >= 30) {
            totalPedido = totalPedido - gastosEnvio;
            gastosEnvio = 0;
            document.querySelector("#total-carrito").innerHTML =
                `Total pedido ${totalPedido}€`;
            document.querySelector("#gastos-envio").innerHTML =
                `Gastos de envio ${gastosEnvio}€`;
        }
    });
    console.log(`La suma del pedido acumula: ${totalPedido}€, articulos repetidos ${articulosRepetidos}, Gastos de envio ${gastosEnvio}€`);

    /* --------------------------------------------------------------------------------------------------------------------------------------- */
    console.log(articulosCarrito);
    carritoHTML();
};

function sumarArticulo(e) {
    if (e.target.classList.contains("sumar-articulo")) {
        console.log("Sumando articulo...");
        /* totalPedido = totalPedido + articulo.precio;
        articulo.cantidad++; */
    }
}


// Muestra el carrito de compras en el HTML
function carritoHTML() {

    // Limpiar el carrito HTML de duplicados 
    limpiarHTMLCarrito();

    // Recorre el carrito y genera el HTML
    articulosCarrito.forEach(articulo => {

        const {
            imagen,
            titulo,
            precio,
            cantidad,
            id
        } = articulo;

        const row = document.createElement("tr");

        row.innerHTML = `
        <td><img src="${imagen}" width="100"></td>
        <td>${titulo}</td>
        <td>${precio}</td>
        <td>${cantidad}</td>
        <td><a href="#" class="sumar-articulo" data-id="${id}">+</a></td>
        <td><a href="#" class="restar-articulo" data-id="${id}">-</a></td>
         <td><a href="#" class="borrar-articulo" data-id="${id}">X</a> </td>`;

        // Agrega el HTML del carrito en el tbody
        contenedorCarrito.appendChild(row);
    });

    // Guardar el carrito en local storage 
    sincronizarStorage();
}
// Guardar el carrito en local storage 
function sincronizarStorage() {
    localStorage.setItem("carrito", JSON.stringify(articulosCarrito));
}

// Elimina los articulos del tbody
function limpiarHTMLCarrito() {
    /* El siguiente while realiza lo mismo que (contenedorCarrito.innerHTML = "";) */
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild)
    }
}