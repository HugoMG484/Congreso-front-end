// Evento que se ejecuta cuando el DOM ha cargado completamente
document.addEventListener('DOMContentLoaded', () => {
    // Obtener referencia al botón de registro
    const botonRegistro = document.getElementById('botonRegistro');

    // Verificar si el botón existe
    if (botonRegistro) {
        // Agregar un evento de clic al botón de registro
        botonRegistro.addEventListener('click', () => {
            // Verificar si el usuario aceptó los términos y condiciones
            const aceptaTerminos = document.getElementById('check').checked;

            // Si no se aceptaron los términos, mostrar una alerta y salir de la función
            if (!aceptaTerminos) {
                mostrarAlerta("¡Revisar Términos!", "Debes aceptar los términos y condiciones", "info");
                return;
            }

            // Obtener los datos del formulario
            const datos = obtenerDatosFormulario();

            // Si se obtuvieron datos válidos, enviar el formulario
            if (datos) {
                enviarFormulario(datos);
            }
        });
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

    // Función para obtener los datos del formulario y realizar validaciones
    function obtenerDatosFormulario() {
        // Validar el campo de nombre
        const nombre = validarCampo('nombre', /^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$/, "El nombre debe contener solo letras, espacios y acentos.");
        // Validar el campo de apellidos
        const apellidos = validarCampo('apellidos', /^[a-zA-ZáéíóúÁÉÍÓÚüÜ ]+$/, "Los apellidos deben contener solo letras, espacios y acentos.");
        // Validar el campo de correo electrónico
        const email = validarCampo('email', /^\S+@\S+\.\S+$/, "Formato de correo electrónico no válido");
        // Validar el campo de Twitter
        const twitter = validarCampo('twitter', /^@[a-zA-Z0-9_]{4,15}$/, "El campo Twitter debe comenzar con '@' y contener entre 4 y 15 caracteres válidos.");
        // Validar el campo de perfil
        const perfil = validarCampo('perfil', /^[a-zA-ZáéíóúÁÉÍÓÚüÜ. ]+$/, "El perfil debe contener solo letras, espacios, acentos y puntos.");

        // Si hay algún campo no válido, retorna null
        if (!nombre || !apellidos || !email || !twitter || !perfil) {
            return null;
        }

        // Obtener el avatar seleccionado
        const avatarSeleccionado = document.querySelector('input[name="avatar"]:checked');

        // Si no se seleccionó ningún avatar, mostrar una alerta y retornar null
        if (!avatarSeleccionado) {
            mostrarAlerta('Error', 'Ningún avatar seleccionado', 'error');
            return null;
        }

        // Obtener el valor del avatar seleccionado
        const avatar = avatarSeleccionado.value;
        // Obtener el valor del checkbox de términos y condiciones
        const aceptaTerminos = document.getElementById('check').checked;

        // Retornar un objeto con los datos del formulario
        return {
            nombre,
            apellidos,
            email,
            twitter,
            avatar,
            perfil,
            aceptaTerminos
        };
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

    // Función para enviar los datos del formulario a través de una solicitud fetch
    function enviarFormulario(datos) {
        fetch('http://localhost:5024/api/Participante', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos),
        })
            .then(response => {
                // Verificar si la solicitud fue exitosa
                if (!response.ok) {
                    // Mostrar una alerta de error si la respuesta no es exitosa
                    throw new Error(`Error en la solicitud: ${response.statusText}`);
                }
                // Retornar la respuesta en formato JSON
                return response.json();
            })
            .then(data => {
                // Mostrar una alerta de registro exitoso y redirigir después de 2 segundos
                mostrarAlerta('Registro exitoso', 'Redireccionando...', 'success');
                setTimeout(() => {
                    window.location.replace('/participantes.html');
                }, 2000);
            })
            .catch(error => {
                // Mostrar una alerta de error en caso de problemas con la solicitud
                console.error('Error en la solicitud:', error);
                mostrarAlerta('Error', 'Error en el registro', 'error');
            });
    }
});

// Función para seleccionar un avatar y deseleccionar los demás
function selectAvatar(avatarId) {
    $('input[name="avatar"]').prop('checked', false);
    $('#' + avatarId).prop('checked', true);
}

// Función para mostrar una alerta con los términos y condiciones
function mostrarAlertaTerminos() {
    Swal.fire({
        title: "Términos y Condiciones.",
        text: "Al utilizar la aplicación del Congreso de Tecnologías de la Información y Comunicación (TIC), aceptas utilizarla de manera ética y respetuosa. Proporciona información precisa al registrarte, respeta los derechos de propiedad intelectual, participa en discusiones de manera constructiva y protege tu información de inicio de sesión. La aplicación puede recibir actualizaciones y nos reservamos el derecho de suspender cuentas que violen estas condiciones. Gracias por ser parte del Congreso de TIC. ¡Disfruta de la experiencia!",
        icon: "info"
    });
}
