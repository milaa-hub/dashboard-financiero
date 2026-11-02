const contenedorCotizaciones =
    document.getElementById("contenedorCotizaciones");

const mensajeCarga =
    document.getElementById("mensajeCarga");

const mensajeError =
    document.getElementById("mensajeError");

const btnActualizar =
    document.getElementById("btnActualizar");

const estadoConexion =
    document.getElementById("estadoConexion");

const ultimaActualizacion =
    document.getElementById("ultimaActualizacion");


const cantidad =
    document.getElementById("cantidad");

const monedaOrigen =
    document.getElementById("monedaOrigen");

const tipoCambio =
    document.getElementById("tipoCambio");

const btnConvertir =
    document.getElementById("btnConvertir");

const resultado =
    document.getElementById("resultado");


let cotizacionBlue = null;
let cotizacionOficial = null;


async function obtenerCotizaciones() {

    mensajeCarga.classList.remove("oculto");

    mensajeError.classList.add("oculto");

    btnActualizar.disabled = true;
    btnActualizar.textContent = "Cargando...";


    try {

        const respuesta = await fetch(
            "https://dolarapi.com/v1/dolares"
        );


        if (!respuesta.ok) {
            throw new Error("No se pudo obtener la información");
        }


        const datos = await respuesta.json();


        console.log(datos);


        cotizacionBlue = datos.find(function(dolar) {
            return dolar.casa === "blue";
        });


        cotizacionOficial = datos.find(function(dolar) {
            return dolar.casa === "oficial";
        });


        mostrarCotizaciones();


        guardarDatos(datos);


        estadoConexion.textContent = "🟢 Conectado";


    } catch (error) {

        console.log(error);

        estadoConexion.textContent =
            "🔴 Sin conexión - Modo Offline";


        cargarDatosGuardados();

    }


    mensajeCarga.classList.add("oculto");

    btnActualizar.disabled = false;
    btnActualizar.textContent = "Actualizar";
}


function mostrarCotizaciones() {

    contenedorCotizaciones.innerHTML = "";


    if (cotizacionBlue) {

        const tarjetaBlue = document.createElement("div");

        tarjetaBlue.classList.add("tarjeta");

        tarjetaBlue.innerHTML = `
            <h3>Dólar Blue</h3>

            <p>
                <strong>Compra:</strong>
                $${cotizacionBlue.compra}
            </p>

            <p>
                <strong>Venta:</strong>
                $${cotizacionBlue.venta}
            </p>
        `;

        contenedorCotizaciones.appendChild(tarjetaBlue);
    }


    if (cotizacionOficial) {

        const tarjetaOficial = document.createElement("div");

        tarjetaOficial.classList.add("tarjeta");

        tarjetaOficial.innerHTML = `
            <h3>Dólar Oficial</h3>

            <p>
                <strong>Compra:</strong>
                $${cotizacionOficial.compra}
            </p>

            <p>
                <strong>Venta:</strong>
                $${cotizacionOficial.venta}
            </p>
        `;

        contenedorCotizaciones.appendChild(tarjetaOficial);
    }


    const fecha = new Date();

    ultimaActualizacion.textContent =
        "Última actualización: " +
        fecha.toLocaleString();
}


function guardarDatos(datos) {

    localStorage.setItem(
        "cotizaciones",
        JSON.stringify(datos)
    );


    const fecha = new Date();

    localStorage.setItem(
        "fechaCotizaciones",
        fecha.toLocaleString()
    );
}


function cargarDatosGuardados() {

    const datosGuardados =
        localStorage.getItem("cotizaciones");


    if (datosGuardados) {

        const datos = JSON.parse(datosGuardados);


        cotizacionBlue = datos.find(function(dolar) {
            return dolar.casa === "blue";
        });


        cotizacionOficial = datos.find(function(dolar) {
            return dolar.casa === "oficial";
        });


        mostrarCotizaciones();


        const fechaGuardada =
            localStorage.getItem("fechaCotizaciones");


        ultimaActualizacion.textContent =
            "Modo Offline. Última actualización: " +
            fechaGuardada;


        mensajeError.textContent =
            "No se pudo conectar con la API. " +
            "Se muestran las últimas cotizaciones guardadas.";

        mensajeError.classList.remove("oculto");


    } else {

        contenedorCotizaciones.innerHTML = `
            <p>
                No hay cotizaciones disponibles.
                Conectate a Internet para obtener los datos.
            </p>
        `;

        mensajeError.textContent =
            "No hay conexión y tampoco existen datos guardados.";

        mensajeError.classList.remove("oculto");
    }
}


function convertirMoneda() {

    const valor =
        Number(cantidad.value);


    if (valor <= 0 || isNaN(valor)) {

        resultado.textContent =
            "Ingresá un monto válido";

        return;
    }


    let cotizacion;


    if (tipoCambio.value === "blue") {

        cotizacion = cotizacionBlue;

    } else {

        cotizacion = cotizacionOficial;
    }


    if (!cotizacion) {

        resultado.textContent =
            "No hay cotización disponible";

        return;
    }


    if (monedaOrigen.value === "ARS") {

        const dolares =
            valor / cotizacion.venta;


        resultado.textContent =
            "USD " + dolares.toFixed(2);


    } else {

        const pesos =
            valor * cotizacion.compra;


        resultado.textContent =
            "ARS $" + pesos.toFixed(2);
    }
}


btnActualizar.addEventListener(
    "click",
    obtenerCotizaciones
);


btnConvertir.addEventListener(
    "click",
    convertirMoneda
);


obtenerCotizaciones();

