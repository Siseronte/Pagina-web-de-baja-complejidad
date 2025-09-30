// --- Lógica centralizada que se ejecuta cuando el DOM está listo ---
document.addEventListener('DOMContentLoaded', () => {
    // Aplazamos la inicialización de scripts para dar tiempo al DOM a actualizarse.
    setTimeout(() => {
        // --- Lógica para ocultar/mostrar el header al hacer scroll ---
        let lastScrollTop = 0;
        const header = document.querySelector('header');
        const scrollThreshold = 150; // Distancia en píxeles antes de que el header se oculte
        const menuToggle = document.getElementById('menu-toggle');

        if (header) {
            // Añadimos la clase de transición después de un breve instante para evitar que se active en la carga inicial
            setTimeout(() => header.classList.add('header-transition'), 100);

            window.addEventListener('scroll', function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

                // Si el menú está abierto, lo cerramos al hacer scroll
                if (menuToggle && menuToggle.checked) {
                    menuToggle.checked = false;
                }

                // Si el scroll es mayor que la posición anterior Y mayor que el umbral
                if (scrollTop > lastScrollTop && scrollTop > scrollThreshold) {
                    // Scroll hacia abajo: Oculta el header
                    header.classList.add('header-transition');
                    header.style.top = '-300px';
                } else {
                    // Scroll hacia arriba o estamos cerca del tope: Muestra el header
                    header.style.top = '0';
                }

                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Actualiza la última posición
            });
        }

        // --- Lógica para cerrar el menú hamburguesa ---
        const menuOverlay = document.getElementById('menu-overlay');
        if (menuOverlay) {
            menuOverlay.addEventListener('click', () => { if (menuToggle) menuToggle.checked = false; });
        }

        window.addEventListener('resize', () => {
            if (menuToggle && menuToggle.checked) {
                menuToggle.checked = false;
            }
        });

        // --- Lógica para el botón de "Volver Arriba" ---
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        if (scrollTopBtn) {
            window.addEventListener('scroll', function() {
                scrollTopBtn.style.display = (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) ? "block" : "none";
            });
            scrollTopBtn.addEventListener('click', function(event) {
                event.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }

        // --- Lógica para el Lightbox ---
        const lightbox = document.getElementById('lightbox');
        if (lightbox) {
            const lightboxImages = document.querySelectorAll('.character-img, .gallery-item img');
            const lightboxImg = document.getElementById('lightbox-img');
            const closeBtn = lightbox.querySelector('.close-btn');
            const prevBtn = lightbox.querySelector('.prev-btn');
            const nextBtn = lightbox.querySelector('.next-btn');
            let currentIndex;

            function showImage(index) {
                currentIndex = (index + lightboxImages.length) % lightboxImages.length;
                lightboxImg.style.opacity = '0';
                setTimeout(() => {
                    lightboxImg.src = lightboxImages[currentIndex].src;
                    lightboxImg.style.opacity = '1';
                }, 200);
            }

            function openLightbox(index) {
                currentIndex = index;
                lightboxImg.src = lightboxImages[currentIndex].src;
                lightbox.classList.add('visible');
            }

            function closeLightbox() {
                lightbox.classList.remove('visible');
            }

            if (lightboxImages.length > 0) {
                lightboxImages.forEach((img, index) => {
                    img.addEventListener('click', () => openLightbox(index));
                });

                closeBtn.addEventListener('click', closeLightbox);
                prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
                nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

                lightbox.addEventListener('click', (e) => {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                });

                document.addEventListener('keydown', (e) => {
                    if (lightbox.classList.contains('visible')) {
                        if (e.key === 'Escape') closeLightbox();
                        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
                        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
                    }
                });
            }
        }

        // --- Lógica para el formulario de contacto ---
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault(); // Previene el envío real
                alert('¡Gracias por tu mensaje! (Este es un formulario de demostración)');
                contactForm.reset(); // Limpia el formulario
            });
        }

        // Inicializamos la animación "fade-in" para las tarjetas.
        const animatedElements = document.querySelectorAll('.character-card, .gallery-item');
        if (animatedElements.length > 0) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target); // Dejamos de observar el elemento una vez animado.
                    }
                });
            }, {
                threshold: 0.1
            });
            animatedElements.forEach(el => observer.observe(el));
        }
    }, 0); // El retardo de 0 es la clave.
});