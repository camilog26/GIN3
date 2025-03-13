document.addEventListener('DOMContentLoaded', () => {
    // Configuración inicial
    let isLoading = true;

    // Asegurar que la página comience desde arriba
    window.scrollTo(0, 0);
    document.body.style.overflow = 'hidden';

    // Inicializar AOS con configuración optimizada
    AOS.init({
        duration: 800,
        once: true,
        offset: 100,
        delay: 100,
        easing: 'ease-out'
    });

    // Configuración de particles.js
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 50,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: '#8b4513'
            },
            shape: {
                type: 'circle'
            },
            opacity: {
                value: 0.3,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#8b4513',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 3
                }
            }
        },
        retina_detect: true
    });

    // Animación del loader
    const handleLoader = () => {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingProgress = document.querySelector('.loading-progress');
        let progress = 0;
        
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 20;
            if (progress > 100) progress = 100;
            
            if (loadingProgress) {
                loadingProgress.style.width = `${progress}%`;
                loadingProgress.setAttribute('aria-valuenow', progress);
            }

            if (progress === 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    if (loadingScreen) {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            document.body.style.overflow = 'visible';
                            isLoading = false;
                            AOS.refresh();
                            initializePostLoadAnimations();
                        }, 500);
                    }
                }, 800);
            }
        }, 200);
    };

    // Animaciones post-carga
    const initializePostLoadAnimations = () => {
        // Efecto de máquina de escribir
        const typewriterElements = document.querySelectorAll('.typewriter');
        typewriterElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            let i = 0;
            
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 50);
                }
            };
            
            setTimeout(typeWriter, 500);
        });

        // Animaciones de los pasos del proceso
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.addEventListener('mouseenter', () => {
                const icon = step.querySelector('.step-icon');
                if (icon) {
                    icon.style.transform = 'rotate(360deg) scale(1.1)';
                }
            });

            step.addEventListener('mouseleave', () => {
                const icon = step.querySelector('.step-icon');
                if (icon) {
                    icon.style.transform = 'rotate(0) scale(1)';
                }
            });
        });

        // Animaciones para el formulario de registro
        initializeFormAnimations();
    };

    // Animaciones específicas para formularios
    const initializeFormAnimations = () => {
        // Animación de campos del formulario
        const formGroups = document.querySelectorAll('.form-group');
        formGroups.forEach(group => {
            const input = group.querySelector('input, select');
            const label = group.querySelector('label');

            if (input && label) {
                input.addEventListener('focus', () => {
                    label.style.transform = 'translateY(-25px) scale(0.8)';
                    label.style.color = '#8b4513';
                });

                input.addEventListener('blur', () => {
                    if (!input.value) {
                        label.style.transform = 'translateY(0) scale(1)';
                        label.style.color = '';
                    }
                });

                // Mantener la animación si el campo tiene valor
                if (input.value) {
                    label.style.transform = 'translateY(-25px) scale(0.8)';
                }
            }
        });
    };

    // Animaciones para modales
    const initializeModalAnimations = () => {
        const modalContainer = document.getElementById('modal-container');
        const modal = modalContainer?.querySelector('.modal');

        if (modalContainer && modal) {
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    modal.style.transform = 'scale(0.95)';
                    modal.style.opacity = '0';
                    setTimeout(() => {
                        modalContainer.style.display = 'none';
                        modal.style.transform = 'scale(1)';
                        modal.style.opacity = '1';
                    }, 300);
                }
            });
        }
    };

    // Animaciones para mensajes de estado
    const showStatusMessage = (message, type = 'success') => {
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        document.body.appendChild(statusDiv);

        setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => {
                statusDiv.remove();
            }, 300);
        }, 3000);
    };

    // Animaciones para botones
    const initializeButtonAnimations = () => {
        const buttons = document.querySelectorAll('.vintage-button');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0)';
            });

            button.addEventListener('click', () => {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            });
        });
    };

    // Inicializar todas las animaciones
    handleLoader();
    initializeModalAnimations();
    initializeButtonAnimations();

    // Exponer funciones necesarias globalmente
    window.showStatusMessage = showStatusMessage;
});