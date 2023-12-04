document.addEventListener('DOMContentLoaded', () => {
    const buscador = document.getElementById('buscador');
    buscador.addEventListener('input', filtrarTarjetas);

    fetch('http://localhost:5024/api/Participante')
        .then(response => response.json())
        .then(data => {
            crearTarjetas(data);
        });
});

function crearBotonAgregar() {
    const container = document.querySelector('.contenido');

    const botonAgregar = document.createElement('button');
    botonAgregar.type = 'button';
    botonAgregar.id = 'agregar';
    botonAgregar.textContent = 'Agregar';
    botonAgregar.style.width = '100%';

    botonAgregar.addEventListener('click', () => {
        console.log('Clic en Agregar');
    });

    container.insertBefore(botonAgregar, container.firstChild);
}

const botonAgregar = document.getElementById('agregar');
if (botonAgregar) {
    botonAgregar.addEventListener('click', redirigirARegistro);
}

function redirigirARegistro() {
    window.location.replace('/registro.html');
}

function crearTarjetas(participantes) {
    let container = document.querySelector('.contenido');
    container.innerHTML = '';

    participantes.forEach(participante => {
        const tarjeta = document.createElement('div');
        tarjeta.classList.add('tarjeta');

        const avatarContainer = document.createElement('div');
        avatarContainer.classList.add('avatar-container');

        const avatar = document.createElement('img');
        avatar.classList.add('avatar');
        avatar.src = `/img/${participante.avatar}`;
        avatar.alt = 'Avatar';

        avatar.addEventListener('click', () => {
            console.log(`Clic en avatar. ID: ${participante.id}`);
            editarRegistro(participante.id);
        });

        avatarContainer.appendChild(avatar);

        const contenidoTarjeta = document.createElement('div');
        contenidoTarjeta.classList.add('contenido-tarjeta');

        const nombreApellido = document.createElement('p');
        nombreApellido.textContent = `${participante.nombre} ${participante.apellidos}`;

        const twitterlogo = document.createElement('i');
        twitterlogo.classList.add('fa', 'fa-twitter');

        const twitterLink = document.createElement('a');
        twitterLink.classList.add('twitter');
        twitterLink.href = 'https://twitter.com/' + participante.twitter;
        twitterLink.textContent = participante.twitter;

        // Establece el enlace como bloque y ocupa todo el espacio disponible
        twitterLink.style.display = 'block';
        twitterLink.style.width = '100%';
        twitterLink.style.height = '100%';

        const perfilProfesional = document.createElement('p');
        perfilProfesional.classList.add('perfil-profesional');
        perfilProfesional.textContent = participante.perfil;

        contenidoTarjeta.appendChild(twitterlogo);
        contenidoTarjeta.appendChild(nombreApellido);

        contenidoTarjeta.appendChild(twitterLink);
        contenidoTarjeta.appendChild(perfilProfesional);

        tarjeta.appendChild(avatarContainer);
        tarjeta.appendChild(contenidoTarjeta);
        container.appendChild(tarjeta);
    });
}



function editarRegistro(id) {
    window.location.href = `/editarParticipante.html?id=${id}`;
}

function filtrarTarjetas() {
    let filtro = buscador.value.toLowerCase();
    let tarjetas = document.querySelectorAll('.tarjeta');

    tarjetas.forEach(tarjeta => {
        let contenidoTarjeta = tarjeta.innerText.toLowerCase();
        tarjeta.style.display = contenidoTarjeta.includes(filtro) ? 'flex' : 'none';
    });
}
