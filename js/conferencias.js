document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:5024/api/Conferencium';
  const tableBody = document.querySelector('tbody');
  const formularioDiv = document.getElementById('formularioRegistro');
  const selectParticipante = document.getElementById('participante');
  let conferenciaIdSeleccionada;
  let participanteIdSeleccionado = null;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      data.forEach(conferencia => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${conferencia.horario}</td>
            <td>${conferencia.nombre}</td>
            <td>${conferencia.conferencista}</td>
            <td><button class="registrar-button" data-conferencia-id="${conferencia.id}">Registrar</button></td>
          `;
        tableBody.appendChild(row);
      });

      const buttons = document.querySelectorAll('.registrar-button');
      buttons.forEach(button => {
        button.addEventListener('click', (event) => {

          const botonClickeado = event.currentTarget;
          const conferenciaId = botonClickeado.getAttribute('data-conferencia-id');
          participanteIdSeleccionado = conferenciaId;

          participanteIdSeleccionado = null;
          mostrarFormularioRegistro(conferenciaId);
          Conf_Asistencia.showModal();
        });
      });
    })
    .catch(error => console.error('Error al obtener datos:', error));

  function mostrarFormularioRegistro(conferenciaId) {

    const urlConferencia = `http://localhost:5024/api/Conferencium/${conferenciaId}`;
    fetch(urlConferencia)
      .then(response => response.json())
      .then(conferencia => {

        if (typeof conferencia !== 'object' || conferencia === null) {
          console.error('Respuesta de la API (conferencia):', conferencia);
          throw new Error('La respuesta de la API no es un objeto');
        }

        fetch('http://localhost:5024/api/Participante')
          .then(response => response.json())
          .then(participantes => {
            const selectConferencia = document.getElementById('conferencia');
            const selectParticipante = document.getElementById('participante');

            selectConferencia.innerHTML = '';
            selectParticipante.innerHTML = '';

            const conferenciaOption = document.createElement('option');
            conferenciaOption.value = conferencia.id;
            conferenciaOption.textContent = conferencia.nombre;
            selectConferencia.appendChild(conferenciaOption);

            const participanteInitialOption = document.createElement('option');
            participanteInitialOption.value = -1;
            participanteInitialOption.textContent = '';
            selectParticipante.appendChild(participanteInitialOption);

            participantes.forEach(participante => {
              const participanteOption = document.createElement('option');
              participanteOption.value = participante.id;
              participanteOption.textContent = `${participante.nombre} ${participante.apellidos}`;
              selectParticipante.appendChild(participanteOption);
            });
            conferenciaIdSeleccionada = conferenciaId;

            formularioDiv.style.display = 'block';
          });
      })
      .catch(error => console.error('Error al obtener conferencia:', error));
  }

  selectParticipante.addEventListener('change', () => {

    participanteIdSeleccionado = selectParticipante.value;
    console.log('Participante seleccionado:', participanteIdSeleccionado);
  });


  const botonGuardar = document.getElementById('botonGuardar');
  if (botonGuardar) {
    botonGuardar.addEventListener('click', guardarRegistro);
  }

  function errorAlert() {
    Swal.fire({
      title: "Debe seleccionar:",
      text: "Participante y Asistencia",
      icon: "error",
      showCancelButton: true,
      showConfirmButton: false,
      allowOutsideClick: false,
      target: document.getElementById('Conf_Asistencia')
    });
    Swal.showLoading();
    setTimeout(() => {
      Swal.close();
    }, 2000);
  }

  function guardarRegistro() {

    const conferenciaId = conferenciaIdSeleccionada;
    const participanteId = participanteIdSeleccionado;
    const confirmarAsistencia = document.getElementById('confirmar').checked;
    const cancelarAsistencia = document.getElementById('cancelar').checked;
    const aceptaTerminos = true;

    if (!confirmarAsistencia && !cancelarAsistencia) {
      console.error('Selecciona al menos una opción de asistencia');
      errorAlert()
      return;
    }

    if (!participanteId) {
      console.error('Selecciona un participante');
      errorAlert()
      return;
    } else if (participanteId == -1) {
      errorAlert()
      return;
    }

    console.log('conferenciaId:', conferenciaId);
    console.log('participanteId:', participanteId);

    const data = {
      participanteId: participanteId,
      conferenciaId: conferenciaIdSeleccionada,
      confirmacionAsistencia: confirmarAsistencia,
      cancelacionAsistencia: cancelarAsistencia,
      aceptaTerminosCondiciones: aceptaTerminos
    };

    console.log('Consulta JSON:', JSON.stringify(data));

    fetch('http://localhost:5024/api/Inscripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la solicitud: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        Conf_Asistencia.close();
        console.log('Registro exitoso:', data);

        Swal.fire({
          title: "Actualizado!",
          text: "Redireccionando",
          icon: "success",
          showCancelButton: true,
          showConfirmButton: false,
          allowOutsideClick: false
        });
        Swal.showLoading();
        setTimeout(() => {
          Swal.close();
          window.location.href = `/asistencia.html?id=${conferenciaId}`;
        }, 2000);
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);

        Swal.fire({
          title: "Ya estas registrado",
          text: "Escoge otro participante",
          icon: "error",
          showCancelButton: true,
          showConfirmButton: false,
          allowOutsideClick: false,
          target: document.getElementById('Conf_Asistencia')
        });
        Swal.showLoading();
        setTimeout(() => {
          Swal.close();
          console.log('Erro usuario');
        }, 2000);
      });
  }

  const miDialog = document.getElementById('Conf_Asistencia');

  document.addEventListener('mousedown', (event) => {
    if (event.target === miDialog && miDialog.hasAttribute('open')) {
      miDialog.close();
    }
  });

  Conf_Asistencia.addEventListener('click', (event) => {
    event.stopPropagation();
  });

});


