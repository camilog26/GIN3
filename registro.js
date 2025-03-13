import { teamService } from './services/team-service.js';
import { sessionService } from './services/session-service.js';

document.addEventListener('DOMContentLoaded', () => {
    // Estado global del registro
    const registrationState = {
        currentStep: 1,
        teamData: {
            teamName: '',
            school: '',
            teacher: '',
            phone: '',
            members: []
        },
        maxMembers: 5
    };

    // Validaciones
    const validators = {
        teamName: (value) => {
            return value.length >= 3 ? '' : 'El nombre del equipo debe tener al menos 3 caracteres';
        },
        school: (value) => {
            return value.length >= 3 ? '' : 'El nombre de la institución debe tener al menos 3 caracteres';
        },
        teacher: (value) => {
            return value.length >= 3 ? '' : 'El nombre del docente debe tener al menos 3 caracteres';
        },
        phone: (value) => {
            return /^[0-9]{10}$/.test(value) ? '' : 'El número de celular debe tener 10 dígitos';
        },
        memberName: (value) => {
            return value.length >= 3 ? '' : 'El nombre debe tener al menos 3 caracteres';
        },
        memberAge: (value) => {
            const age = parseInt(value);
            return (age >= 14 && age <= 18) ? '' : 'La edad debe estar entre 14 y 18 años';
        }
    };

    // Renderizado de pasos
    const renderSteps = {
        1: () => {
            return `
                <form id="teamForm" class="registration-step step-enter">
                    <h3>Datos del Equipo</h3>
                    <div class="form-group">
                        <label for="teamName">Nombre del Equipo</label>
                        <input type="text" id="teamName" name="teamName" value="${registrationState.teamData.teamName}" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group">
                        <label for="school">Institución Educativa</label>
                        <input type="text" id="school" name="school" value="${registrationState.teamData.school}" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group">
                        <label for="teacher">Docente Responsable</label>
                        <input type="text" id="teacher" name="teacher" value="${registrationState.teamData.teacher}" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="form-group">
                        <label for="phone">Celular de Contacto</label>
                        <input type="tel" id="phone" name="phone" value="${registrationState.teamData.phone}" required>
                        <span class="error-message"></span>
                    </div>
                    <div class="step-buttons">
                        <button type="submit" class="vintage-button primary">
                            <i class="fas fa-arrow-right"></i> Siguiente
                        </button>
                    </div>
                </form>
            `;
        },
        2: () => {
            const membersList = registrationState.teamData.members.map((member, index) => `
                <div class="member-card member-enter">
                    <div class="member-info">
                        <h4>Integrante ${index + 1}</h4>
                        <p><strong>Nombre:</strong> ${member.name}</p>
                        <p><strong>Grado:</strong> ${member.grade}°</p>
                        <p><strong>Edad:</strong> ${member.age} años</p>
                        <p><strong>Género:</strong> ${getGenderText(member.gender)}</p>
                    </div>
                    <div class="member-actions">
                        <button type="button" class="vintage-button mini" onclick="editMember(${index})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="vintage-button mini error" onclick="removeMember(${index})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');

            return `
                <div class="registration-step step-enter">
                    <h3>Integrantes del Equipo (${registrationState.teamData.members.length}/${registrationState.maxMembers})</h3>
                    <div class="members-list">
                        ${membersList}
                    </div>
                    ${registrationState.teamData.members.length < registrationState.maxMembers ? `
                        <form id="memberForm">
                            <div class="form-group">
                                <label for="memberName">Nombre Completo</label>
                                <input type="text" id="memberName" name="memberName" required>
                                <span class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="memberGrade">Grado</label>
                                <select id="memberGrade" name="memberGrade" required>
                                    <option value="">Seleccione...</option>
                                    <option value="10">10°</option>
                                    <option value="11">11°</option>
                                </select>
                                <span class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="memberAge">Edad</label>
                                <input type="number" id="memberAge" name="memberAge" min="14" max="18" required>
                                <span class="error-message"></span>
                            </div>
                            <div class="form-group">
                                <label for="memberGender">Género</label>
                                <select id="memberGender" name="memberGender" required>
                                    <option value="">Seleccione...</option>
                                    <option value="M">Masculino</option>
                                    <option value="F">Femenino</option>
                                    <option value="O">Otro</option>
                                </select>
                                <span class="error-message"></span>
                            </div>
                            <button type="submit" class="vintage-button primary">
                                <i class="fas fa-plus"></i> Agregar Integrante
                            </button>
                        </form>
                    ` : ''}
                    <div class="step-buttons">
                        <button type="button" class="vintage-button secondary" onclick="changeStep(1)">
                            <i class="fas fa-arrow-left"></i> Anterior
                        </button>
                        ${registrationState.teamData.members.length >= 3 ? `
                            <button type="button" class="vintage-button primary" onclick="changeStep(3)">
                                <i class="fas fa-arrow-right"></i> Siguiente
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        },
        3: () => {
            return `
                <div class="registration-step step-enter">
                    <h3>Confirmación de Registro</h3>
                    <div class="confirmation-section">
                        <h4>Datos del Equipo</h4>
                        <div class="confirmation-data">
                            <p><strong>Nombre del Equipo:</strong> ${registrationState.teamData.teamName}</p>
                            <p><strong>Institución:</strong> ${registrationState.teamData.school}</p>
                            <p><strong>Docente:</strong> ${registrationState.teamData.teacher}</p>
                            <p><strong>Contacto:</strong> ${registrationState.teamData.phone}</p>
                        </div>
                        <h4>Integrantes</h4>
                        <div class="members-list">
                            ${registrationState.teamData.members.map((member, index) => `
                                <div class="member-card">
                                    <h5>Integrante ${index + 1}</h5>
                                    <p><strong>Nombre:</strong> ${member.name}</p>
                                    <p><strong>Grado:</strong> ${member.grade}°</p>
                                    <p><strong>Edad:</strong> ${member.age} años</p>
                                    <p><strong>Género:</strong> ${getGenderText(member.gender)}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="step-buttons">
                        <button type="button" class="vintage-button secondary" onclick="changeStep(2)">
                            <i class="fas fa-arrow-left"></i> Anterior
                        </button>
                        <button type="button" class="vintage-button primary" onclick="submitRegistration()">
                            <i class="fas fa-check"></i> Confirmar Registro
                        </button>
                    </div>
                </div>
            `;
        }
    };

    // Funciones auxiliares
    const getGenderText = (gender) => {
        const genders = { 'M': 'Masculino', 'F': 'Femenino', 'O': 'Otro' };
        return genders[gender] || gender;
    };

    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-message');
        formGroup.classList.add('invalid');
        errorDisplay.textContent = message;
    };

    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        const errorDisplay = formGroup.querySelector('.error-message');
        formGroup.classList.remove('invalid');
        errorDisplay.textContent = '';
    };

    const updateProgressBar = () => {
        document.querySelectorAll('.progress-step').forEach((step, index) => {
            if (index + 1 < registrationState.currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index + 1 === registrationState.currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('completed', 'active');
            }
        });
    };

    // Cambio de pasos
    window.changeStep = (step) => {
        if (step < 1 || step > 3) return;
        
        const modalContent = document.querySelector('.modal-content');
        modalContent.innerHTML = renderSteps[step]();
        registrationState.currentStep = step;
        updateProgressBar();
        initializeFormValidation();
    };

    // Manejo de integrantes
    window.editMember = (index) => {
        const member = registrationState.teamData.members[index];
        const memberForm = document.getElementById('memberForm');
        if (memberForm) {
            memberForm.memberName.value = member.name;
            memberForm.memberGrade.value = member.grade;
            memberForm.memberAge.value = member.age;
            memberForm.memberGender.value = member.gender;
            registrationState.teamData.members.splice(index, 1);
            changeStep(2);
        }
    };

    window.removeMember = (index) => {
        if (confirm('¿Estás seguro de eliminar este integrante?')) {
            registrationState.teamData.members.splice(index, 1);
            changeStep(2);
        }
    };

    // Inicialización de validación de formularios
    const initializeFormValidation = () => {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    if (validators[input.name]) {
                        const error = validators[input.name](input.value);
                        if (error) {
                            showError(input, error);
                        } else {
                            clearError(input);
                        }
                    }
                });
            });
        });
    };

    // Registro final
    window.submitRegistration = async () => {
        try {
            const submitButton = document.querySelector('.step-buttons .primary');
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

            // Validar cantidad mínima de integrantes
            if (registrationState.teamData.members.length < 3) {
                throw new Error('El equipo debe tener al menos 3 integrantes');
            }

            // Registrar equipo en Firebase
            const result = await teamService.registerTeam(registrationState.teamData);

            if (result.success) {
                const modalContent = document.querySelector('.modal-content');
                modalContent.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle fa-3x"></i>
                        <h3>¡Registro Exitoso!</h3>
                        <p>Su equipo ha sido registrado correctamente.</p>
                        <div class="access-code-container">
                            <p>Su código de acceso es:</p>
                            <div class="access-code code-reveal">${result.accessCode}</div>
                            <p class="warning">¡Guarde este código! Lo necesitará para ingresar al juego.</p>
                        </div>
                        <button type="button" class="vintage-button primary" onclick="closeModal()">
                            <i class="fas fa-check"></i> Entendido
                        </button>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            alert(error.message || 'Error al procesar el registro. Por favor intente nuevamente.');
            submitButton.disabled = false;
            submitButton.innerHTML = '<i class="fas fa-check"></i> Confirmar Registro';
        }
    };

    // Event Listeners
    document.addEventListener('submit', (e) => {
        e.preventDefault();

        if (e.target.id === 'teamForm') {
            const formData = new FormData(e.target);
            const errors = [];

            for (let [key, value] of formData.entries()) {
                const error = validators[key]?.(value);
                if (error) errors.push(error);
            }

            if (errors.length > 0) {
                alert(errors.join('\n'));
                return;
            }

            registrationState.teamData = {
                ...registrationState.teamData,
                teamName: formData.get('teamName'),
                school: formData.get('school'),
                teacher: formData.get('teacher'),
                phone: formData.get('phone')
            };

            changeStep(2);
        }

        if (e.target.id === 'memberForm') {
            const formData = new FormData(e.target);
            const member = {
                name: formData.get('memberName'),
                grade: formData.get('memberGrade'),
                age: parseInt(formData.get('memberAge')),
                gender: formData.get('memberGender')
            };

            const errors = validators.memberName(member.name);
            if (errors) {
                alert(errors);
                return;
            }

            registrationState.teamData.members.push(