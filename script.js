window.addEventListener("DOMContentLoaded",() => {
	const starRating = new StarRating("form");
});

class StarRating {
	constructor(qs) {
		this.ratings = [
			{id: 1, name: "xD"},
			{id: 2, name: "Meh he visto mejores"},
			{id: 3, name: "Normal"},
			{id: 4, name: "Esta chido"},
			{id: 5, name: "Me gustó que creativo"}
		];
		this.rating = null;
		this.el = document.querySelector(qs);

		this.init();
	}
	init() {
		this.el?.addEventListener("change",this.updateRating.bind(this));

		// stop Firefox from preserving form data between refreshes
		try {
			this.el?.reset();
		} catch (err) {
			console.error("Element isn’t a form.");
		}
	}
	updateRating(e) {
		// clear animation delays
		Array.from(this.el.querySelectorAll(`[for*="rating"]`)).forEach(el => {
			el.className = "rating__label";
		});

		const ratingObject = this.ratings.find(r => r.id === +e.target.value);
		const prevRatingID = this.rating?.id || 0;

		let delay = 0;
		this.rating = ratingObject;
		this.ratings.forEach(rating => {
			const { id } = rating;

			// add the delays
			const ratingLabel = this.el.querySelector(`[for="rating-${id}"]`);

			if (id > prevRatingID + 1 && id <= this.rating.id) {
				++delay;
				ratingLabel.classList.add(`rating__label--delay${delay}`);
			}

			// hide ratings to not read, show the one to read
			const ratingTextEl = this.el.querySelector(`[data-rating="${id}"]`);

			if (this.rating.id !== id)
				ratingTextEl.setAttribute("hidden",true);
			else
				ratingTextEl.removeAttribute("hidden");
		});
	}
}

document.addEventListener('DOMContentLoaded', function() {
    // ========== CONFIGURACIÓN INICIAL ==========
    const sections = document.querySelectorAll('section');
    const main = document.querySelector('main');
    let isScrolling = false;
    let currentSectionIndex = 0;
    let scrollTimeout;
    
    // ========== 1. CONFIGURAR SCROLL POR SECCIONES ==========
    // Configurar altura y scroll snap de cada sección
    sections.forEach(section => {
        section.style.height = '100vh';
    });
    
    // Configurar scroll snap en el main
    main.style.scrollSnapType = 'y mandatory';
    main.style.overflowY = 'scroll';
    main.style.height = '100vh';
    main.style.scrollBehavior = 'auto'; // Desactivamos auto para controlarlo manualmente
    
    // ========== 2. ACTIVAR PRIMERA SECCIÓN ==========
    setTimeout(() => {
        activateSection(sections[0], true);
    }, 500);
    
    // ========== 3. MANEJAR SCROLL CON RUEDA DEL MOUSE ==========
    document.addEventListener('wheel', function(e) {
        if (isScrolling) return;
        
        isScrolling = true;
        const currentSection = document.elementFromPoint(
            window.innerWidth / 2, 
            window.innerHeight / 2
        ).closest('section');
        
        let targetSection;
        
        if (e.deltaY > 0) {
            // Scroll hacia abajo - siguiente sección
            targetSection = currentSection.nextElementSibling;
        } else {
            // Scroll hacia arriba - sección anterior
            targetSection = currentSection.previousElementSibling;
        }
        
        if (targetSection) {
            // Desactivar sección actual
            currentSection.classList.remove('active');
            
            // Ir a la nueva sección
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Activar nueva sección después de un delay
            setTimeout(() => {
                activateSection(targetSection);
                isScrolling = false;
            }, 300);
        } else {
            isScrolling = false;
        }
    }, { passive: true });
    
    // ========== 4. MANEJAR TECLAS DE FLECHA ==========
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            
            const currentSection = document.elementFromPoint(
                window.innerWidth / 2, 
                window.innerHeight / 2
            ).closest('section');
            
            let targetSection;
            
            if (e.key === 'ArrowDown') {
                targetSection = currentSection.nextElementSibling;
            } else {
                targetSection = currentSection.previousElementSibling;
            }
            
            if (targetSection) {
                // Desactivar sección actual
                currentSection.classList.remove('active');
                
                // Ir a la nueva sección
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Activar nueva sección después de un delay
                setTimeout(() => {
                    activateSection(targetSection);
                }, 300);
            }
        }
    });
    
    // ========== 5. MANEJAR SCROLL MANUAL (para móviles/touch) ==========
    let touchStartY = 0;
    
    document.addEventListener('touchstart', function(e) {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (isScrolling) return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const diffY = touchStartY - touchEndY;
        
        // Si el deslizamiento es significativo (más de 50px)
        if (Math.abs(diffY) > 50) {
            isScrolling = true;
            
            const currentSection = document.elementFromPoint(
                window.innerWidth / 2, 
                window.innerHeight / 2
            ).closest('section');
            
            let targetSection;
            
            if (diffY > 0) {
                // Deslizamiento hacia arriba - siguiente sección
                targetSection = currentSection.nextElementSibling;
            } else {
                // Deslizamiento hacia abajo - sección anterior
                targetSection = currentSection.previousElementSibling;
            }
            
            if (targetSection) {
                // Desactivar sección actual
                currentSection.classList.remove('active');
                
                // Ir a la nueva sección
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Activar nueva sección después de un delay
                setTimeout(() => {
                    activateSection(targetSection);
                    isScrolling = false;
                }, 300);
            } else {
                isScrolling = false;
            }
        }
    }, { passive: true });
    
    // ========== 6. FUNCIÓN PARA ACTIVAR UNA SECCIÓN ==========
    function activateSection(section, isFirst = false) {
        // Asegurarse de que solo una sección esté activa
        sections.forEach(s => {
            s.classList.remove('active');
            s.style.pointerEvents = 'none';
        });
        
        // Activar la nueva sección
        section.classList.add('active');
        section.style.pointerEvents = 'auto';
        
        // Actualizar índice actual
        currentSectionIndex = Array.from(sections).indexOf(section);
        
        // Si es la primera vez, agregar animación de entrada a los elementos
        if (isFirst) {
            setTimeout(() => {
                const elements = section.querySelectorAll('h1, h2, p');
                elements.forEach((el, index) => {
                    el.style.animationDelay = `${index * 0.2}s`;
                    el.classList.add('fade-in');
                });
            }, 300);
        }
    }
    
    // ========== 7. OBSERVER PARA DETECTAR SECCIONES VISIBLES ==========
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // La sección es visible
                const section = entry.target;
                
                // Si no está activa, activarla
                if (!section.classList.contains('active')) {
                    sections.forEach(s => s.classList.remove('active'));
                    activateSection(section);
                }
            }
        });
    }, {
        threshold: 0.5 // Cuando al menos el 50% de la sección es visible
    });
    
    // Observar todas las secciones
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // ========== 8. MEJORAR TOOLTIPS ==========
    document.querySelectorAll('.tooltip').forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s';
        });
        
        tooltip.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});


// Establece tu fecha objetivo aquí (año, mes-1, día, hora, minuto, segundo)
        const fechaObjetivo = new Date(2025, 11, 25, 0, 0, 0); // 31 de diciembre de 2024
        
        function actualizarContador() {
            const ahora = new Date();
            const diferencia = fechaObjetivo - ahora;
            
            if (diferencia <= 0) {
                document.getElementById('contador').innerHTML = 
                    "<h2>¡Ya llegó la fecha!</h2>";
                return;
            }
            
            // Calcular días, horas, minutos y segundos
            const segundosTotales = Math.floor(diferencia / 1000);
            const dias = Math.floor(segundosTotales / (3600 * 24));
            const horas = Math.floor((segundosTotales % (3600 * 24)) / 3600);
            const minutos = Math.floor((segundosTotales % 3600) / 60);
            const segundos = segundosTotales % 60;
            
            // Mostrar resultado
            document.getElementById('contador').innerHTML = `
                <h2>Este Sitio web se borrará en:</h2>
                <p class="time"><span>${dias}</span> días, <span>${horas}</span> horas, <span>${minutos}</span> minutos, <span>${segundos}</span>segundos</p>
            `;
        }
        
        // Actualizar cada segundo
        setInterval(actualizarContador, 1000);
        
        // Ejecutar una vez al cargar
        actualizarContador();