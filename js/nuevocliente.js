(function (){   
    let DB;
    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', validarFormulario);
    });

    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm',1);
        
        abrirConexion.onerror = function(){
            console.log('Hubo un error inesperado');
        }
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
            console.log('Conexión hecha satisfactorimente');
        }
    }
    function validarFormulario(e){
        e.preventDefault();
        //Seleccionar los inputs y valores
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if(nombre === '' || email === '' || telefono === '' || empresa === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        //Crear objeto para guardar datos
        const infoCliente = {
            nombre,
            email,
            telefono,
            empresa
        }
        infoCliente.id = Date.now();
        agregarCliente(infoCliente);
        
        
    }

    function agregarCliente(cliente){
        const transaccion = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaccion.objectStore('crm');

        objectStore.add(cliente);
        console.log(cliente);
        transaccion.oncomplete = function(){
            imprimirAlerta('Cliente Agregado Correctamente', 'exito');
            console.log('Cliente agregado');
            setTimeout(() => {
                formulario.reset();
                window.location.href = 'index.html';
            }, 2000);
            
        }
        transaccion.onerror = function(){
            console.log('No se agrego el cliente, intente de nuevo');
            imprimirAlerta('Esté correo ya ha sido registrado', 'error');
        }
    }

    function imprimirAlerta(mensaje, tipo){
        const alerta = document.querySelector('.alerta')
        if(!alerta){
            const divMensaje = document.createElement('DIV');
            divMensaje.textContent = mensaje;
            divMensaje.classList.add('px-4', 'py-3', 'rounded', 'mx-w-lg', 'mx-auto', 'mt-6', 'text-center','border', 'alerta');
            if(tipo === 'error'){
                divMensaje.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
            }else{
                divMensaje.classList.add('bg-greed-100', 'border-green-400', 'text-green-700');
            }

            formulario.appendChild(divMensaje);
            setTimeout(() => {
                divMensaje.remove();
            }, 2000);
        }
    }

})();