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