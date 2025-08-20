// App State
let currentTab = "work";
let tasks = [];
let events = [];

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    console.log("App initialized");
    loadTasks();
    loadEvents();
    setupEventListeners();
    renderTasks();
    updateDateTime();
    
    // Update time every second
    setInterval(updateDateTime, 1000);
});

function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    // Modal controls
    const addTaskBtn = document.getElementById("addTaskBtn");
    const taskModal = document.getElementById("taskModal");
    const closeModal = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelBtn");
    const taskForm = document.getElementById("taskForm");
    
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", openModal);
    }
    if (closeModal) {
        closeModal.addEventListener("click", closeModalFunc);
    }
    if (cancelBtn) {
        cancelBtn.addEventListener("click", closeModalFunc);
    }
    if (taskForm) {
        taskForm.addEventListener("submit", handleTaskSubmit);
    }
    
    // Tab switching
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });
}

function updateDateTime() {
    const currentDateEl = document.getElementById("currentDate");
    const currentTimeEl = document.getElementById("currentTime");
    
    if (!currentDateEl || !currentTimeEl) return;
    
    const now = new Date();
    
    // Update date
    const dateOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric'
    };
    currentDateEl.textContent = now.toLocaleDateString('es-ES', dateOptions);
    
    // Update time
    const timeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    currentTimeEl.textContent = now.toLocaleTimeString('es-ES', timeOptions);
}

function openModal() {
    const taskModal = document.getElementById("taskModal");
    if (taskModal) {
        taskModal.classList.add("active");
        document.body.style.overflow = "hidden";
    }
}

function closeModalFunc() {
    const taskModal = document.getElementById("taskModal");
    const taskForm = document.getElementById("taskForm");
    
    if (taskModal) {
        taskModal.classList.remove("active");
        document.body.style.overflow = "auto";
        if (taskForm) taskForm.reset();
    }
}

function switchTab(tabName) {
    console.log("Switching to tab:", tabName);
    currentTab = tabName;
    
    // Update tab buttons
    const tabBtns = document.querySelectorAll(".tab-btn");
    tabBtns.forEach(btn => {
        btn.classList.toggle("active", btn.dataset.tab === tabName);
    });
    
    // Update tab content
    const tabContents = document.querySelectorAll(".tab-content");
    tabContents.forEach(content => {
        content.classList.toggle("active", content.id === `${tabName}-content`);
    });
    
    renderTasks();
    updateEmptyState();
}

function handleTaskSubmit(e) {
    e.preventDefault();
    
    const taskTitle = document.getElementById("taskTitle");
    const taskCategory = document.getElementById("taskCategory");
    const taskTime = document.getElementById("taskTime");
    const taskPriority = document.getElementById("taskPriority");
    const taskRecurring = document.getElementById("taskRecurring");
    
    if (!taskTitle || !taskCategory || !taskTime || !taskPriority || !taskRecurring) return;
    
    if (taskRecurring.value === 'yes') {
        // Es una tarea recurrente - crear solo UNA tarea que se actualiza
        const weekdays = [];
        const checkboxes = document.querySelectorAll('#recurringOptions input[type="checkbox"]:checked');
        checkboxes.forEach(checkbox => {
            weekdays.push(parseInt(checkbox.value));
        });
        
        if (weekdays.length === 0) {
            showNotification("Selecciona al menos un día de la semana", "warning");
            return;
        }
        
        // Encontrar el próximo día de la semana para esta tarea
        const today = new Date();
        const nextWeekday = weekdays.find(weekday => {
            const daysUntilWeekday = (weekday - today.getDay() + 7) % 7;
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + daysUntilWeekday);
            return nextDate >= today;
        });
        
        if (nextWeekday !== undefined) {
            const daysUntilNext = (nextWeekday - today.getDay() + 7) % 7;
            const nextDate = new Date(today);
            nextDate.setDate(today.getDate() + daysUntilNext);
            
            const task = {
                id: Date.now().toString(),
                title: taskTitle.value,
                category: taskCategory.value,
                time: taskTime.value,
                priority: taskPriority.value,
                completed: false,
                createdAt: new Date().toISOString(),
                isRecurring: true,
                originalWeekdays: weekdays,
                scheduledDate: nextDate.toISOString().split('T')[0],
                nextOccurrence: nextDate.toISOString().split('T')[0]
            };
            
            addTask(task);
            showNotification("Tarea recurrente creada", "success");
        }
    } else {
        // Es una tarea única
        const task = {
            id: Date.now().toString(),
            title: taskTitle.value,
            category: taskCategory.value,
            time: taskTime.value,
            priority: taskPriority.value,
            completed: false,
            createdAt: new Date().toISOString(),
            isRecurring: false
        };
        
        addTask(task);
    }
    
    closeModalFunc();
}

function addTask(task) {
    tasks.push(task);
    saveTasks();
    renderTasks();
    updateEmptyState();
    
    showNotification("Tarea creada exitosamente", "success");
}

function toggleTaskComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        
        // Si se completa una tarea recurrente, actualizar a la siguiente fecha
        if (task.completed && task.isRecurring) {
            updateRecurringTaskToNext(task);
        }
        
        saveTasks();
        renderTasks();
        
        const message = task.completed ? "Tarea completada" : "Tarea marcada como pendiente";
        showNotification(message, "info");
    }
}

function updateRecurringTaskToNext(completedTask) {
    if (!completedTask.isRecurring || !completedTask.originalWeekdays) return;
    
    const today = new Date();
    const completedDate = new Date(completedTask.scheduledDate);
    
    // Encontrar el próximo día de la semana para esta tarea
    const nextWeekday = completedTask.originalWeekdays.find(weekday => {
        const nextDate = new Date(completedDate);
        const daysUntilNext = (weekday - completedDate.getDay() + 7) % 7;
        nextDate.setDate(completedDate.getDate() + daysUntilNext + 7); // +7 para la siguiente semana
        
        return nextDate > today;
    });
    
    if (nextWeekday !== undefined) {
        const nextDate = new Date(completedDate);
        const daysUntilNext = (nextWeekday - completedDate.getDay() + 7) % 7;
        nextDate.setDate(completedDate.getDate() + daysUntilNext + 7);
        
        // Actualizar la tarea existente en lugar de crear una nueva
        completedTask.completed = false;
        completedTask.scheduledDate = nextDate.toISOString().split('T')[0];
        completedTask.nextOccurrence = nextDate.toISOString().split('T')[0];
        
        showNotification("Tarea recurrente actualizada para la próxima fecha", "info");
    }
}

function deleteTask(taskId) {
    if (confirm("¿Estás seguro de que quieres eliminar esta tarea?")) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        renderTasks();
        updateEmptyState();
        
        showNotification("Tarea eliminada", "warning");
    }
}

function renderTasks() {
    const workTasksContainer = document.getElementById("work-tasks");
    const lifeTasksContainer = document.getElementById("life-tasks");
    
    if (!workTasksContainer || !lifeTasksContainer) return;
    
    // Clear containers
    workTasksContainer.innerHTML = "";
    lifeTasksContainer.innerHTML = "";
    
    // Filter tasks by category
    const workTasks = tasks.filter(t => t.category === "work");
    const lifeTasks = tasks.filter(t => t.category === "life");
    
    // Sort tasks by time
    const sortTasks = (taskList) => {
        return taskList.sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return a.time.localeCompare(b.time);
        });
    };
    
    // Render work tasks
    sortTasks(workTasks).forEach(task => {
        workTasksContainer.appendChild(createTaskElement(task));
    });
    
    // Render life tasks
    sortTasks(lifeTasks).forEach(task => {
        lifeTasksContainer.appendChild(createTaskElement(task));
    });
}

function createTaskElement(task) {
    const taskElement = document.createElement("div");
    taskElement.className = `task-item ${task.completed ? "completed" : ""} ${task.isRecurring ? "recurring" : ""}`;
    taskElement.dataset.taskId = task.id;
    
    const priorityClass = `priority-${task.priority}`;
    
    // Mostrar fecha programada para tareas recurrentes
    let dateInfo = '';
    if (task.isRecurring && task.scheduledDate) {
        const scheduledDate = new Date(task.scheduledDate);
        const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
        const formattedDate = scheduledDate.toLocaleDateString('es-ES', dateOptions);
        dateInfo = `<div class="task-date">📅 ${formattedDate}</div>`;
    }
    
    // Indicador de tarea recurrente más visible - solo icono
    const recurringBadge = task.isRecurring ? '<div class="recurring-badge">🔄</div>' : '';
    
    taskElement.innerHTML = `
        <div class="task-priority ${priorityClass}"></div>
        <div class="task-header">
            <div class="task-title">
                ${escapeHtml(task.title)}
            </div>
            <div class="task-time">${formatTime(task.time)}</div>
        </div>
        <div class="task-info">
            <div class="task-date-container">
                ${recurringBadge}
                ${dateInfo}
            </div>
        </div>
        <div class="task-actions">
            <button class="action-btn complete" onclick="toggleTaskComplete('${task.id}')" title="${task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}">
                <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
            </button>
            <button class="action-btn delete" onclick="deleteTask('${task.id}')" title="Eliminar tarea">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `;
    
    return taskElement;
}

// CRITICAL FUNCTIONS - These were missing!
function saveTasks() {
    try {
        console.log('=== SAVING TASKS ===');
        console.log('Tasks to save:', tasks);
        
        // Save to localStorage
        localStorage.setItem("rutinaApp_tasks", JSON.stringify(tasks));
        console.log('Tasks saved to localStorage:', tasks.length);
        
        // Save to sessionStorage as backup
        sessionStorage.setItem("rutinaApp_tasks_backup", JSON.stringify(tasks));
        console.log('Tasks also saved to sessionStorage as backup');
        
        showNotification("Tareas guardadas correctamente", "success");
        
    } catch (error) {
        console.error('Error saving tasks:', error);
        showNotification("Error al guardar tareas", "warning");
    }
}

function saveEvents() {
    try {
        console.log('=== SAVING EVENTS ===');
        console.log('Events to save:', events);
        
        // Save to localStorage
        localStorage.setItem("rutinaApp_events", JSON.stringify(events));
        console.log('Events saved to localStorage:', events.length);
        
        // Save to sessionStorage as backup
        sessionStorage.setItem("rutinaApp_events_backup", JSON.stringify(events));
        console.log('Events also saved to sessionStorage as backup');
        
        showNotification("Eventos guardados correctamente", "success");
        
    } catch (error) {
        console.error('Error saving events:', error);
        showNotification("Error al guardar eventos", "warning");
    }
}

function loadTasks() {
    try {
        const savedTasks = localStorage.getItem("rutinaApp_tasks");
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            console.log('Tasks loaded from localStorage:', tasks.length);
            return;
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
    }
    
    // Try sessionStorage backup
    try {
        const backupTasks = sessionStorage.getItem("rutinaApp_tasks_backup");
        if (backupTasks) {
            tasks = JSON.parse(backupTasks);
            console.log('Tasks loaded from sessionStorage backup:', tasks.length);
            return;
        }
    } catch (backupError) {
        console.error('Error loading tasks from sessionStorage backup:', backupError);
    }
    
    // Default to empty array
    tasks = [];
    console.log('No tasks found, starting with empty array');
}

function loadEvents() {
    try {
        const savedEvents = localStorage.getItem("rutinaApp_events");
        if (savedEvents) {
            events = JSON.parse(savedEvents);
            console.log('Events loaded from localStorage:', events.length);
            return;
        }
    } catch (error) {
        console.error('Error loading events from localStorage:', error);
    }
    
    // Default to empty array
    events = [];
    console.log('No events found, starting with empty array');
}

function updateEmptyState() {
    const emptyState = document.getElementById("emptyState");
    
    if (!emptyState) return;
    
    if (currentTab === "calendar") {
        emptyState.style.display = "none";
        return;
    }
    
    const currentTasks = tasks.filter(t => t.category === currentTab);
    const isEmpty = currentTasks.length === 0;
    
    if (isEmpty) {
        emptyState.style.display = "block";
        emptyState.innerHTML = `
            <div class="empty-icon">
                <i class="fas fa-${currentTab === 'work' ? 'briefcase' : 'heart'}"></i>
            </div>
            <h3>No hay tareas de ${currentTab === 'work' ? 'trabajo' : 'vida personal'}</h3>
            <p>Comienza creando tu primera tarea para organizar tu día</p>
        `;
    } else {
        emptyState.style.display = "none";
    }
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function showNotification(message, type = "info") {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll(".notification");
    existingNotifications.forEach(n => n.remove());
    
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification notification-${type}`;
    
    let bgColor = "#17a2b8";
    let icon = "info-circle";
    
    switch (type) {
        case "success":
            bgColor = "#28a745";
            icon = "check-circle";
            break;
        case "warning":
            bgColor = "#ffc107";
            icon = "exclamation-triangle";
            break;
    }
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = "translateX(0)";
    }, 100);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}



// No sample tasks - start with empty state
console.log('App starting with empty task list');

// Calendar Functions
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function renderCalendar() {
    const calendarGrid = document.getElementById("calendarGrid");
    const currentMonthEl = document.getElementById("currentMonth");
    
    if (!calendarGrid || !currentMonthEl) return;
    
    // Update month display
    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    currentMonthEl.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    
    // Clear grid
    calendarGrid.innerHTML = "";
    
    // Add weekday headers
    const weekdays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    weekdays.forEach(day => {
        const dayHeader = document.createElement("div");
        dayHeader.className = "calendar-weekday";
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Check if there are any configured events
    const hasWorkSchedule = events.some(e => e.type === 'work_schedule' && e.start_date && e.time && e.description);
    const hasWeeklyMeeting = events.some(e => e.type === 'weekly_meeting' && e.weekdays && e.weekdays.length > 0 && e.time && e.description);
    const hasSpecificEvents = events.some(e => e.type === 'specific_event');
    
    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Generate calendar days
    for (let i = 0; i < 42; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);
        
        const dayElement = document.createElement("div");
        dayElement.className = "calendar-day";
        
        // Check if it's current month
        if (currentDate.getMonth() !== currentMonth) {
            dayElement.classList.add("other-month");
        }
        
        // Check if it's today
        const today = new Date();
        if (currentDate.toDateString() === today.toDateString()) {
            dayElement.classList.add("today");
        }
        
        // Only check for events if there are configured events
        if (hasWorkSchedule || hasWeeklyMeeting || hasSpecificEvents) {
            const dateString = currentDate.toISOString().split('T')[0];
            const dayEvents = getEventsForDate(dateString);
            
            if (dayEvents.length > 0) {
                dayElement.classList.add("has-event");
                
                // Add specific event type classes - priorizar el evento de mayor prioridad
                const hasSpecificEvent = dayEvents.some(event => event.type === 'specific_event');
                const hasWeeklyMeetingEvent = dayEvents.some(event => event.type === 'weekly_meeting');
                const hasWorkScheduleEvent = dayEvents.some(event => event.type === 'work_schedule');
                
                // Aplicar la clase del evento de mayor prioridad
                if (hasSpecificEvent) {
                    dayElement.classList.add("specific-event");
                } else if (hasWeeklyMeetingEvent) {
                    dayElement.classList.add("weekly-meeting");
                } else if (hasWorkScheduleEvent) {
                    dayElement.classList.add("work-schedule");
                }
            }
        }
        
        dayElement.textContent = currentDate.getDate();
        dayElement.dataset.date = currentDate.toISOString().split('T')[0];
        dayElement.addEventListener("click", () => selectCalendarDay(currentDate.toISOString().split('T')[0]));
        
        calendarGrid.appendChild(dayElement);
    }
}

function getEventsForDate(dateString) {
    const dayEvents = events.filter(event => {
        if (event.type === 'work_schedule') {
            return isWorkDay(dateString, event);
        } else if (event.type === 'weekly_meeting') {
            return isMeetingDay(dateString, event);
        } else if (event.type === 'specific_event') {
            return event.date === dateString;
        }
        return false;
    });
    
    // Ordenar eventos por prioridad: específicos primero, luego reuniones semanales, luego horario de trabajo
    return dayEvents.sort((a, b) => {
        const priorityOrder = {
            'specific_event': 1,    // Prioridad más alta
            'weekly_meeting': 2,    // Prioridad media
            'work_schedule': 3      // Prioridad más baja
        };
        
        return priorityOrder[a.type] - priorityOrder[b.type];
    });
}

function isWorkDay(dateString, workSchedule) {
    // Solo marcar como día de trabajo si realmente existe un horario configurado
    if (!workSchedule || !workSchedule.start_date || !workSchedule.time || !workSchedule.description) {
        return false;
    }
    
    const startDate = new Date(workSchedule.start_date);
    const checkDate = new Date(dateString);
    
    // Solo procesar fechas futuras o iguales a la fecha de inicio
    if (checkDate < startDate) {
        return false;
    }
    
    const daysDiff = Math.floor((checkDate - startDate) / (1000 * 60 * 60 * 24));
    
    // 6x4 schedule: 6 days work, 4 days off
    const cycleDay = daysDiff % 10;
    return cycleDay < 6; // Days 0-5 are work days
}

function isMeetingDay(dateString, meeting) {
    // Solo marcar como día de reunión si realmente existe una reunión configurada
    if (!meeting || !meeting.weekdays || !Array.isArray(meeting.weekdays) || 
        !meeting.time || !meeting.description || meeting.weekdays.length === 0) {
        return false;
    }
    
    // Crear la fecha de manera más explícita para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('-').map(Number);
    const checkDate = new Date(year, month - 1, day); // month - 1 porque JavaScript usa 0-11 para meses
    const dayOfWeek = checkDate.getDay();
    
    // Los días de la semana en JavaScript: 0=Domingo, 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado
    // Los checkboxes usan estos mismos valores, así que la comparación debería ser directa
    const dayOfWeekString = dayOfWeek.toString();
    return meeting.weekdays.includes(dayOfWeekString);
}

function selectCalendarDay(dateString) {
    const selectedDayEvents = document.getElementById("selectedDayEvents");
    const selectedDayEventsList = document.getElementById("selectedDayEventsList");
    
    if (!selectedDayEvents || !selectedDayEventsList) return;
    
    const dayEvents = getEventsForDate(dateString);
    
    if (dayEvents.length > 0) {
        selectedDayEvents.style.display = "block";
        selectedDayEventsList.innerHTML = "";
        
        dayEvents.forEach(event => {
            const eventElement = document.createElement("div");
            eventElement.className = `event-item ${event.type}`;
            
            let eventTitle = "";
            if (event.type === 'work_schedule') {
                eventTitle = "Horario de Trabajo 6x4";
            } else if (event.type === 'weekly_meeting') {
                eventTitle = "Reunión Semanal";
            } else if (event.type === 'specific_event') {
                eventTitle = event.title || "Evento Específico";
            }
            
            eventElement.innerHTML = `
                <div class="event-header">
                    <div class="event-title">${eventTitle}</div>
                    <div class="event-time">${event.time || ''}</div>
                </div>
                <div class="event-description">${event.description || ''}</div>
            `;
            
            selectedDayEventsList.appendChild(eventElement);
        });
    } else {
        selectedDayEvents.style.display = "none";
    }
}

function renderTodayEvents() {
    const todayEvents = document.getElementById("todayEvents");
    if (!todayEvents) return;
    
    const today = new Date().toISOString().split('T')[0];
    const todayEventsList = getEventsForDate(today);
    
    if (todayEventsList.length === 0) {
        todayEvents.innerHTML = '<p style="color: #718096; text-align: center;">No hay eventos para hoy</p>';
        return;
    }
    
    todayEvents.innerHTML = "";
    todayEventsList.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = `event-item ${event.type}`;
        
        let eventTitle = "";
        if (event.type === 'work_schedule') {
            eventTitle = "Horario de Trabajo 6x4";
        } else if (event.type === 'weekly_meeting') {
            eventTitle = "Reunión Semanal";
        } else if (event.type === 'specific_event') {
            eventTitle = event.title || "Evento Específico";
        }
        
        eventElement.innerHTML = `
            <div class="event-header">
                <div class="event-title">${eventTitle}</div>
                <div class="event-time">${event.time || ''}</div>
            </div>
            <div class="event-description">${event.description || ''}</div>
        `;
        
        todayEvents.appendChild(eventElement);
    });
}

function renderUpcomingEvents() {
    const upcomingEvents = document.getElementById("upcomingEvents");
    if (!upcomingEvents) return;
    
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const upcomingEventsList = [];
    
    for (let i = 1; i <= 7; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() + i);
        const dateString = checkDate.toISOString().split('T')[0];
        const dayEvents = getEventsForDate(dateString);
        
        dayEvents.forEach(event => {
            upcomingEventsList.push({
                ...event,
                date: dateString
            });
        });
    }
    
    if (upcomingEventsList.length === 0) {
        upcomingEvents.innerHTML = '<p style="color: #718096; text-align: center;">No hay eventos próximos</p>';
        return;
    }
    
    upcomingEvents.innerHTML = "";
    upcomingEventsList.forEach(event => {
        const eventElement = document.createElement("div");
        eventElement.className = `event-item ${event.type}`;
        
        let eventTitle = "";
        if (event.type === 'work_schedule') {
            eventTitle = "Horario de Trabajo 6x4";
        } else if (event.type === 'weekly_meeting') {
            eventTitle = "Reunión Semanal";
        } else if (event.type === 'specific_event') {
            eventTitle = event.title || "Evento Específico";
        }
        
        const eventDate = new Date(event.date);
        const dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
        const formattedDate = eventDate.toLocaleDateString('es-ES', dateOptions);
        
        eventElement.innerHTML = `
            <div class="event-header">
                <div class="event-title">${eventTitle}</div>
                <div class="event-time">${formattedDate} - ${event.time || ''}</div>
            </div>
            <div class="event-description">${event.description || ''}</div>
        `;
        
        upcomingEvents.appendChild(eventElement);
    });
}

// Work Schedule Modal Functions
function openWorkScheduleModal() {
    const modal = document.getElementById("workScheduleModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        
        // Set default values
        const now = new Date();
        const workStartDate = document.getElementById("workStartDate");
        const workStartTime = document.getElementById("workStartTime");
        
        if (workStartDate) {
            workStartDate.value = now.toISOString().split('T')[0];
        }
        if (workStartTime) {
            workStartTime.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        }
    }
}

function closeWorkScheduleModal() {
    const modal = document.getElementById("workScheduleModal");
    const form = document.getElementById("workScheduleForm");
    
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        if (form) form.reset();
    }
}

function createWorkSchedule(e) {
    e.preventDefault();
    
    const startDate = document.getElementById("workStartDate").value;
    const startTime = document.getElementById("workStartTime").value;
    const description = document.getElementById("workDescription").value;
    
    if (!startDate || !startTime || !description) return;
    
    // Remove existing work schedule events
    events = events.filter(event => event.type !== 'work_schedule');
    
    const workSchedule = {
        id: Date.now().toString(),
        type: 'work_schedule',
        start_date: startDate,
        time: startTime,
        description: description,
        createdAt: new Date().toISOString()
    };
    
    events.push(workSchedule);
    saveEvents();
    
    closeWorkScheduleModal();
    
    // Force refresh of calendar and events
    setTimeout(() => {
        renderCalendar();
        renderTodayEvents();
        renderUpcomingEvents();
    }, 100);
    
    showNotification("Horario de trabajo configurado", "success");
}

// Weekly Meeting Modal Functions
function openWeeklyMeetingModal() {
    const modal = document.getElementById("weeklyMeetingModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        
        // Set default time
        const now = new Date();
        const meetingTime = document.getElementById("meetingTime");
        if (meetingTime) {
            meetingTime.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        }
    }
}

// Specific Event Modal Functions
function openSpecificEventModal() {
    const modal = document.getElementById("specificEventModal");
    if (modal) {
        modal.classList.add("active");
        document.body.style.overflow = "hidden";
        
        // Set default date and time
        const now = new Date();
        const eventDate = document.getElementById("eventDate");
        const eventTime = document.getElementById("eventTime");
        
        if (eventDate) {
            eventDate.value = now.toISOString().split('T')[0];
        }
        if (eventTime) {
            eventTime.value = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
        }
    }
}

function closeSpecificEventModal() {
    const modal = document.getElementById("specificEventModal");
    const form = document.getElementById("specificEventForm");
    
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        if (form) form.reset();
    }
}

function createSpecificEvent(e) {
    e.preventDefault();
    
    const title = document.getElementById("eventTitle").value;
    const date = document.getElementById("eventDate").value;
    const time = document.getElementById("eventTime").value;
    const description = document.getElementById("eventDescription").value;
    
    if (!title || !date || !time) return;
    
    const specificEvent = {
        id: Date.now().toString(),
        type: 'specific_event',
        title: title,
        date: date,
        time: time,
        description: description,
        createdAt: new Date().toISOString()
    };
    
    events.push(specificEvent);
    saveEvents();
    
    closeSpecificEventModal();
    
    // Force refresh of calendar and events
    setTimeout(() => {
        renderCalendar();
        renderTodayEvents();
        renderUpcomingEvents();
    }, 100);
    
    showNotification("Evento específico creado", "success");
}

function closeWeeklyMeetingModal() {
    const modal = document.getElementById("weeklyMeetingModal");
    const form = document.getElementById("weeklyMeetingForm");
    
    if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "auto";
        if (form) form.reset();
    }
}

function createWeeklyMeeting(e) {
    e.preventDefault();
    
    const weekdays = [];
    const checkboxes = document.querySelectorAll('#weeklyMeetingForm input[type="checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        weekdays.push(checkbox.value);
    });
    
    const time = document.getElementById("meetingTime").value;
    const description = document.getElementById("meetingDescription").value;
    
    if (weekdays.length === 0 || !time || !description) return;
    
    // Remove existing weekly meeting events
    events = events.filter(event => event.type !== 'weekly_meeting');
    
    const weeklyMeeting = {
        id: Date.now().toString(),
        type: 'weekly_meeting',
        weekdays: weekdays,
        time: time,
        description: description,
        createdAt: new Date().toISOString()
    };
    
    events.push(weeklyMeeting);
    saveEvents();
    
    closeWeeklyMeetingModal();
    
    // Force refresh of calendar and events
    setTimeout(() => {
        renderCalendar();
        renderTodayEvents();
        renderUpcomingEvents();
    }, 100);
    
    showNotification("Reunión semanal configurada", "success");
}

// Add event listeners for calendar functionality
document.addEventListener("DOMContentLoaded", () => {
    // Calendar navigation
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener("click", () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            renderCalendar();
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener("click", () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            renderCalendar();
        });
    }
    
    // Work Schedule Modal
    const addWorkScheduleBtn = document.getElementById("addWorkScheduleBtn");
    const closeWorkScheduleModalBtn = document.getElementById("closeWorkScheduleModal");
    const cancelWorkScheduleBtn = document.getElementById("cancelWorkSchedule");
    const workScheduleForm = document.getElementById("workScheduleForm");
    
    if (addWorkScheduleBtn) {
        addWorkScheduleBtn.addEventListener("click", openWorkScheduleModal);
    }
    if (closeWorkScheduleModalBtn) {
        closeWorkScheduleModalBtn.addEventListener("click", closeWorkScheduleModal);
    }
    if (cancelWorkScheduleBtn) {
        cancelWorkScheduleBtn.addEventListener("click", closeWorkScheduleModal);
    }
    if (workScheduleForm) {
        workScheduleForm.addEventListener("submit", createWorkSchedule);
    }
    
    // Weekly Meeting Modal
    const addWeeklyMeetingBtn = document.getElementById("addWeeklyMeetingBtn");
    const closeWeeklyMeetingModalBtn = document.getElementById("closeWeeklyMeetingModal");
    const cancelWeeklyMeetingBtn = document.getElementById("cancelWeeklyMeeting");
    const weeklyMeetingForm = document.getElementById("weeklyMeetingForm");
    
    if (addWeeklyMeetingBtn) {
        addWeeklyMeetingBtn.addEventListener("click", openWeeklyMeetingModal);
    }
    if (closeWeeklyMeetingModalBtn) {
        closeWeeklyMeetingModalBtn.addEventListener("click", closeWeeklyMeetingModal);
    }
    if (cancelWeeklyMeetingBtn) {
        cancelWeeklyMeetingBtn.addEventListener("click", closeWeeklyMeetingModal);
    }
    if (weeklyMeetingForm) {
        weeklyMeetingForm.addEventListener("submit", createWeeklyMeeting);
    }
    
    // Specific Event Modal
    const addSpecificEventBtn = document.getElementById("addSpecificEventBtn");
    const closeSpecificEventModalBtn = document.getElementById("closeSpecificEventModal");
    const cancelSpecificEventBtn = document.getElementById("cancelSpecificEvent");
    const specificEventForm = document.getElementById("specificEventForm");
    
    if (addSpecificEventBtn) {
        addSpecificEventBtn.addEventListener("click", openSpecificEventModal);
    }
    if (closeSpecificEventModalBtn) {
        closeSpecificEventModalBtn.addEventListener("click", closeSpecificEventModal);
    }
    if (cancelSpecificEventBtn) {
        cancelSpecificEventBtn.addEventListener("click", closeSpecificEventModal);
    }
    if (specificEventForm) {
        specificEventForm.addEventListener("submit", createSpecificEvent);
    }
    
    // Initial calendar render
    setTimeout(() => {
        renderCalendar();
        renderTodayEvents();
        renderUpcomingEvents();
    }, 100);
});
