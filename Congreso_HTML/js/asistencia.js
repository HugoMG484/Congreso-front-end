document.addEventListener('DOMContentLoaded', () => {

    const buscador = document.getElementById('buscador');
    buscador.addEventListener('input', filtrarTarjetas);

    const urlParams = new URLSearchParams(window.location.search);
    const conferenciaId = urlParams.get('id');

    const apiUrlInscripciones = `http://localhost:5024/api/Inscripcion/ConferenciaId/${conferenciaId}`;
    const apiUrlConferencia = `http://localhost:5024/api/Conferencium/${conferenciaId}`;

    fetch(apiUrlInscripciones)
        .then(response => response.json())
        .then(dataInscripciones => {
            console.log('Datos de inscripciones confirmadas:', dataInscripciones);

            const participantesConfirmadosIds = dataInscripciones.map(inscripcion => inscripcion.participanteId);

            fetch('http://localhost:5024/api/Participante')
                .then(response => response.json())
                .then(dataParticipantes => {
                    console.log('Datos de todos los participantes:', dataParticipantes);

                    const participantesConfirmadosData = dataParticipantes.filter(participante => participantesConfirmadosIds.includes(participante.id));
                    console.log('Participantes confirmados:', participantesConfirmadosData);

                    crearTarjetas(participantesConfirmadosData);
                });

            fetch(apiUrlConferencia)
                .then(response => response.json())
                .then(dataConferencia => {
                    console.log('Datos de la conferencia:', dataConferencia);

                    const labelConferencia = document.getElementById('conferencia');
                    if (labelConferencia) {
                        labelConferencia.textContent = dataConferencia.nombre;
                    } else {
                        console.error('Elemento de conferencia no encontrado en la página.');
                    }
                })
                .catch(error => console.error('Error al obtener datos de la conferencia:', error));
        })
        .catch(error => console.error('Error al obtener datos de inscripción confirmadas por ConferenciaId:', error));




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

    function filtrarTarjetas() {
        let filtro = buscador.value.toLowerCase();
        let tarjetas = document.querySelectorAll('.tarjeta');

        tarjetas.forEach(tarjeta => {
            let contenidoTarjeta = tarjeta.innerText.toLowerCase();
            tarjeta.style.display = contenidoTarjeta.includes(filtro) ? 'flex' : 'none';
        });
    }
})
