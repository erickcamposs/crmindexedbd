(function(){
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');
    const formulario = document.querySelector('#formulario');
    let DB;
    let clienteID;
    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', actualizarCliente);

        const URLParametros = new URLSearchParams(window.location.search);
        clienteID = URLParametros.get('id');
        console.log(clienteID);
        if(clienteID){
            setTimeout(() =>{
                obtenerCliente(clienteID);
            },100);
        }
    });

    function obtenerCliente(id){
        const transaccion = DB.transaction(['crm'], 'readonly');
        const objectStore = transaccion.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e){
            const cursor = e.target.result;
            if(cursor){
                if(cursor.value.id === Number(id)){
                   llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }
    function llenarFormulario(cliente){
        const {nombre, email, telefono, empresa} = cliente;
        nombreInput.value = nombre;
        emailInput.value = email;
        empresaInput.value = empresa;
        telefonoInput.value = telefono;
    }
    function conectarDB(){
        const abrirConexion = window.indexedDB.open('crm',1);
        
        abrirConexion.onerror = function(){
            console.log('Hubo un error inesperado');
        }
        abrirConexion.onsuccess = function(){
            DB = abrirConexion.result;
        }
    }
    function actualizarCliente(e){
        e.preventDefault();
        console.log('Actualizar');
        if(nombreInput.value === '' || emailInput.value === '' || empresaInput.value === '' || telefonoInput.value === ''){
            imprimirAlerta('Todos los campos son obligatorios', 'error');
            return;
        }
        const clienteActualizado = {
            nombre: nombreInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            email: emailInput.value,
            id: Number(clienteID)
        }
        
        const transaccion = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaccion.objectStore('crm');

        objectStore.put(clienteActualizado);
        transaccion.oncomplete = function(){
            imprimirAlerta('Cliente Actualizado correctamente');
            setTimeout(()=>{
                window.location.href = 'index.html';
            },1500);
        }
        transaccion.onerror = function(){
            imprimirAlerta('Hubo un error', 'error');
        }
    }

})();