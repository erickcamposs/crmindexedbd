(function (){
    let DB;
    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
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
})();