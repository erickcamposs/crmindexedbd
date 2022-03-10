(function (){
    let DB;
    const listado = document.querySelector('#listado-clientes');
    const formulario = document.querySelector('#formulario');
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
        if(window.indexedDB.open('crm', 1)){
            mostrarClientes();
        }
        listado.addEventListener('click', eliminarCliente);
    });

    //Crear IndexDB
    function crearDB(){
        const clienteDB = window.indexedDB.open('crm', 1);
        clienteDB.onerror = () => {
            console.log('Hubo un error');
        };
        clienteDB.onsuccess = () => {
            console.log('Base de datos creada index');
            DB = clienteDB.result;
        };
        clienteDB.onupgradeneeded = (e) =>{
            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true
            });

            objectStore.createIndex('nombre', 'nombre', {unique: false});
            objectStore.createIndex('email', 'email', {unique: true});
            objectStore.createIndex('telefono', 'telefono', {unique: false});
            objectStore.createIndex('empresa', 'empresa', {unique: false});
            objectStore.createIndex('id', 'id', {unique: true});
        };
    }

    function mostrarClientes(){
        //Abrir la conexión a la base de datos
        const db = window.indexedDB.open('crm', 1);
        db.onerror = () => {
            console.log('Hubo un error en la conexión de la base de datos');
        }
        db.onsuccess = () => {
            DB = db.result;
            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function (e){
                const cursor = e.target.result;
                if(cursor){
                    const {nombre, telefono, empresa, email, id} = cursor.value;
                    listado.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                     `;
                    cursor.continue();
                }else{
                    console.log('Ya no hay registros');
                }
            }
        }
    }
    function eliminarCliente(e){
        if(e.target.classList.contains('eliminar')){
            const id = Number(e.target.dataset.cliente);

            const confirmar = confirm('Desea Eliminar este cliente?');
            if(confirmar){
                console.log(confirmar);
                const transaction = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaction.objectStore('crm');
                objectStore.delete(id);

                transaction.oncomplete = function () {
                    console.log('Eliminado');
                    e.target.parentElement.parentElement.remove();
                }
                transaction.onerror = function(){
                    console.log('Hubo un error');
                }
            }

        }
    }
})();