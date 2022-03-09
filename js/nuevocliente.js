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
        transaccion.oncomplete = function(){
            imprimirAlerta('Cliente Agregado Correctamente', 'exito');
            setTimeout(() => {
                formulario.reset();
                window.location.href = 'index.html';
            }, 500);
            
        }
        transaccion.onerror = function(){
            console.log('No se agrego el cliente, intente de nuevo');
            imprimirAlerta('Esté correo ya ha sido registrado', 'error');
        }
    }

})();