// Función para obtener el valor de un parámetro en la URL
function obtenerParametroUrl(parametro) {
    const url = new URL(window.location.href);
    return url.searchParams.get(parametro);
}

// Evento que se ejecuta cuando el DOM ha cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // Obtener el id del participante desde la URL
    const id = obtenerParametroUrl('id');

    // Si hay un id, cargar los datos del participante y llenar el formulario
    if (id) {
        cargarDatosParticipante(id)
            .then(participante => {
                llenarFormulario(participante);
            })
            .catch(error => console.error('Error al cargar datos del participante:', error));
    }
});

// Función para seleccionar un avatar y deseleccionar los demás
function selectAvatar(avatarId) {
    // Desmarcar todos los avatares
    $('input[name="avatar"]').prop('checked', false);
    // Marcar el avatar seleccionado
    $('#' + avatarId).prop('checked', true);
}

// Función para cargar los datos de un participante desde la API
function cargarDatosParticipante(id) {
    return fetch(`http://localhost:5024/api/Participante/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al obtener datos del participante: ${response.statusText}`);
            }
            return response.json();
        });
}

// Función para llenar el formulario con los datos del participante
function llenarFormulario(participante) {
    // Obtener referencias a los elementos del formulario
    const nombreInput = document.getElementById('nombre');
    const apellidosInput = document.getElementById('apellidos');
    const emailInput = document.getElementById('email');
    const twitterInput = document.getElementById('twitter');
    const perfilInput = document.getElementById('perfil');

    // Verificar si los elementos del formulario existen
    if (nombreInput && apellidosInput && emailInput && twitterInput && perfilInput) {
        // Llenar el formulario con los datos del participante
        nombreInput.value = participante.nombre;
        apellidosInput.value = participante.apellidos;
        emailInput.value = participante.email;
        twitterInput.value = participante.twitter;
        perfilInput.value = participante.perfil;

        // Seleccionar el avatar correspondiente
        const avatarInput = document.querySelector(`input[name="avatar"][value="${participante.avatar}"]`);
        if (avatarInput) {
            avatarInput.checked = true;
        }
    } else {
        console.error('Elementos del formulario no encontrados.');
    }
}

// Obtener referencia al botón de guardar
const botonGuardar = document.getElementById('botonGuardar');
// Verificar si el botón existe
if (botonGuardar) {
    // Agregar un evento de clic al botón de guardar
    botonGuardar.addEventListener('click', guardarEdicion);
}

// Función para validar un campo según una expresión regular y mostrar una alerta en caso de error
function validarCampo(idCampo, regex, mensajeError) {
    // Obtener el elemento del campo
    const campo = document.getElementById(idCampo);
    // Obtener el valor del campo y eliminar espacios en blanco al inicio y al final
    const valor = campo.value.trim();

    // Verificar si el valor del campo cumple con la expresión regular y otros criterios de validación
    if (!regex.test(valor) || valor === '' || /\s{2,}/.test(valor)) {
        // Mostrar una alerta de error y retornar null si la validación no pasa
        mostrarAlerta('Error', mensajeError, 'error');
        return null;
    }

    // Retornar el valor del campo si la validación es exitosa
    return valor;
}

// Función para mostrar una alerta con título, texto e icono específicos
function mostrarAlerta(titulo, texto, icono) {
    Swal.fire({
        title: titulo,
        text: texto,
        icon: icono,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
    });
}

// Función para guardar la edición de los datos del participante
function guardarEdicion() {
    // Obtener el id del participante desde la URL
    const id = obtenerParametroUrl('id');
    // Obtener el formulario de edición
    const formulario = document.getElementById('formularioEdicion');

    // Validar cada campo del formulario
    const nombre = validarCampo('nombre', /^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$/, "El nombre debe contener solo letras, espacios y acentos.");
    const apellidos = validarCampo('apellidos', /^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$/, "Los apellidos deben contener solo letras, espacios y acentos.");
    const email = validarCampo('email', /^\S+@\S+\.\S+$/, "Formato de correo electrónico no válido");
    const twitter = validarCampo('twitter', /^@[a-zA-Z0-9_]{4,15}$/, "El campo Twitter debe comenzar con '@' y contener entre 4 y 15 caracteres válidos.");
    const perfil = validarCampo('perfil', /^[a-zA-ZáéíóúÁÉÍÓÚüÜ. ]+$/, "El perfil debe contener solo letras, espacios, acentos y puntos.");

    // Si algún campo no pasa la validación, salir de la función
    if (!nombre || !apellidos || !email || !twitter || !perfil) {
        return;
    }

    // Crear un objeto con los datos del formulario
    const datos = {
        id: id,
        nombre: nombre,
        apellidos: apellidos,
        email: email,
        twitter: twitter,
        avatar: formulario.querySelector('input[name="avatar"]:checked')?.value,
        perfil: perfil
    };

    // Enviar los datos al servidor mediante una solicitud fetch
    fetch(`http://localhost:5024/api/Participante/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos),
    })
        .then(response => {
            // Verificar si la solicitud fue exitosa
            if (!response.ok) {
                // Mostrar una alerta de error si la respuesta no es exitosa
                throw new Error(`Error al actualizar el registro: ${response.statusText}`);
            }

            // Verificar si hay datos en la respuesta
            if (response.status !== 204) {
                return response.json();
            } else {
                return null;
            }
        })
        .then(data => {
            // Mostrar una alerta dependiendo de la respuesta del servidor
            if (data) {
                console.log('Registro actualizado:', data);
            } else {
                console.log('Registro actualizado correctamente.');

                // Mostrar una alerta de éxito y redirigir después de 2 segundos
                mostrarAlerta('Actualizado!', 'Redireccionando...', 'success');
                setTimeout(() => {
                    window.location.replace('/participantes.html');
                }, 2000);
            }
        })
        .catch(error => {
            // Mostrar una alerta de error en caso de problemas con la solicitud
            console.error('Error al actualizar el registro:', error);
            mostrarAlerta('Error', 'Error al actualizar el registro', 'error');
        });
}
