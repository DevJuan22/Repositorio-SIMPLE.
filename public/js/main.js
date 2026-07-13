// ===== INICIALIZAR ANIMACIONES AL HACER SCROLL =====
AOS.init({
  duration: 800,
  once: true,
  offset: 80,
});

// ===== MENÚ MÓVIL =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  navToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

// ===== HEADER CON EFECTO AL HACER SCROLL =====
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== FORMULARIO DE CONTACTO (conectado al backend) =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formFeedback = document.getElementById('formFeedback');

contactForm.addEventListener('submit', async (evento) => {
  // Evita que el formulario recargue la página (comportamiento por defecto del navegador)
  evento.preventDefault();

  const datos = {
    nombre: document.getElementById('nombre').value.trim(),
    email: document.getElementById('email').value.trim(),
    mensaje: document.getElementById('mensaje').value.trim(),
  };

  // Deshabilita el botón mientras se envía, para evitar doble clic
  submitBtn.disabled = true;
  submitBtn.textContent = 'Enviando...';
  formFeedback.textContent = '';
  formFeedback.className = 'form-feedback';

  try {
    const respuesta = await fetch('/api/contacto', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datos),
    });

    const resultado = await respuesta.json();

    if (respuesta.ok && resultado.ok) {
      formFeedback.textContent = resultado.mensaje;
      formFeedback.classList.add('success');
      contactForm.reset();
    } else {
      formFeedback.textContent = resultado.error || 'Ocurrió un error. Intenta de nuevo.';
      formFeedback.classList.add('error');
    }
  } catch (error) {
    // Esto captura errores de red (ej: el servidor está apagado)
    formFeedback.textContent = 'No se pudo conectar con el servidor. Intenta más tarde.';
    formFeedback.classList.add('error');
    console.error('Error al enviar el formulario:', error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Enviar mensaje';
  }
});