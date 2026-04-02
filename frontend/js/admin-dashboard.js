// ==================== ADMIN DASHBOARD JS ====================

let eventsData = [];
const defaultImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJIXqbFZrh7mVW5LcsPV_GADQWiSEYufpLfonQm80QqSdqxAxmktJvEmree4y5cA1naF9GHTnQ29DAtT9ian06FYH_irpLI4E4_7KUzNmV1MErpImtMu7gkcipcFC1vskuHj4Ja_ABvoJbE0lJPWzlkpAeY1XPpAGP3HzE8Un8IsAAwjFublSxTxPq_Qcb_J9WUogYeBUIsxN13211cvCR9fcdweSmNdAt28gVE7Ns-shUO3pJ0qgsmLCtsQlqCm2vRVMtwiHZdP8';

// Auth Token
function getToken() {
    return localStorage.getItem('token');
}

function getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
}

// Redirect if not logged in
if (!getToken() || getUser().role !== 'organizer') {
    window.location.href = 'login.html';
}

// ==================== INITIALIZATION ====================
async function loadEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events');
        if (response.ok) {
            const allEvents = await response.json();
            
            // Filter events that belong to the logged-in organizer.
            // Since getEvents might not return organizer in .select(), we might see all events if backend doesn't filter.
            // For now, let's assume we render what we get or filter if organizer field is present.
            const user = getUser();
            eventsData = allEvents.filter(ev => !ev.organizer || ev.organizer === user._id || typeof ev.organizer === 'object' && ev.organizer._id === user._id);
            // If backend didn't send 'organizer' due to .select constraint, it will render all events (fallback).
            // To be accurate, we'll just render whatever we get for now.
            if(eventsData.length === 0 && allEvents.length > 0) {
                 eventsData = allEvents; // Fallback if no organizer field
            }

            renderEventsTable();
            renderAttendeesTab();
        }
    } catch (e) {
        console.error('Failed to load events', e);
    }
}

function renderEventsTable() {
    const tbody = document.getElementById('eventsTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = eventsData.map((ev, index) => {
        const img = ev.imageUrl || defaultImg;
        // Mock registration count since the backend doesn't provide it via basic getEvents easily without a separate query
        const regCount = ev.registeredCount || 0; 
        const capacity = ev.capacity || 100;
        const pct = Math.min(100, Math.round((regCount / capacity) * 100)) || 0;
        
        return `
        <tr class="hover:bg-zinc-900/30 transition-colors" data-event-id="${ev._id}">
            <td class="py-4 px-4">
                <div class="flex items-center gap-4">
                    <img src="${img}" class="w-12 h-12 rounded-lg object-cover" alt="Thumb"/>
                    <div>
                        <p class="font-bold text-white mb-0.5">${ev.title}</p>
                        <p class="text-xs text-zinc-500">${ev.location}</p>
                    </div>
                </div>
            </td>
            <td class="py-4 px-4">
                <p class="text-sm font-bold text-zinc-200">${ev.date}</p>
                <p class="text-xs text-zinc-500">${ev.time}</p>
            </td>
            <td class="py-4 px-4">
                <div class="flex items-center gap-2">
                    <div class="w-full bg-zinc-800 rounded-full h-1.5 max-w-[100px]">
                        <div class="bg-violet-500 h-1.5 rounded-full" style="width: ${pct}%"></div>
                    </div>
                    <span class="text-sm font-medium text-zinc-300 reg-text">${regCount}/${capacity}</span>
                </div>
            </td>
            <td class="py-4 px-4 text-right">
                <button onclick="openEditEvent('${ev._id}')" class="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all" title="Edit Event"><span class="material-symbols-outlined text-[20px]">edit</span></button>
                <button onclick="deleteEvent('${ev._id}')" class="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all" title="Delete Event"><span class="material-symbols-outlined text-[20px]">delete</span></button>
            </td>
        </tr>`;
    }).join('');
}

// Function to fetch and render attendees for an event
function renderAttendeesTab() {
    const container = document.querySelector('#attendeesTab .space-y-4');
    if (!container) return;
    
    container.innerHTML = eventsData.map(ev => {
        const img = ev.imageUrl || defaultImg;
        return `
        <div class="glass-panel rounded-2xl border border-zinc-800/80 overflow-hidden mb-4">
            <button onclick="toggleEvent(this)" class="w-full flex items-center justify-between p-5 hover:bg-zinc-900/30 transition-colors">
                <div class="flex items-center gap-4">
                    <img src="${img}" class="w-12 h-12 rounded-lg object-cover" alt="Event" />
                    <div class="text-left">
                        <h3 class="font-headline font-bold text-white text-lg">${ev.title}</h3>
                        <p class="text-xs text-zinc-500">${ev.date} · ${ev.location}</p>
                    </div>
                </div>
                <span class="material-symbols-outlined text-zinc-500 transition-transform duration-200 chevron">expand_more</span>
            </button>
            <div class="event-attendees hidden border-t border-zinc-800/50 p-4 text-center text-zinc-500">
                Attendee list fetching not fully implemented in API yet.
            </div>
        </div>`;
    }).join('');
}

window.addEventListener('load', loadEvents);

// ==================== CREATE EVENT ====================
async function handleCreateEvent(event) {
    event.preventDefault();

    const title = document.getElementById('eventTitle').value;
    const description = document.getElementById('eventDescription').value;
    const location = document.getElementById('eventLocation').value;
    const category = document.getElementById('eventCategory').value;
    const capacity = document.getElementById('eventCapacity').value;
    const imageUrl = document.getElementById('eventImageUrl').value || defaultImg;
    
    // Formatting date and time nicely
    const dtObj = new Date(document.getElementById('eventDate').value);
    const dateStr = dtObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const timeRaw = document.getElementById('eventTime').value;
    let [hours, minutes] = timeRaw.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;

    const payload = {
        title, description, date: dateStr, time: timeStr, location, category, capacity, imageUrl
    };

    try {
        const response = await fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById('createEventModal').classList.add('hidden');
            document.getElementById('createEventForm').reset();
            loadEvents(); // Reload grid
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to create event');
        }
    } catch(e) {
        alert('Server error');
    }
}

// ==================== EDIT EVENT ====================
let currentEditId = null;

async function openEditEvent(id) {
    try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`);
        if(response.ok) {
            const ev = await response.json();
            currentEditId = ev._id;
            
            document.getElementById('editTitle').value = ev.title;
            document.getElementById('editDescription').value = ev.description;
            document.getElementById('editLocation').value = ev.location;
            document.getElementById('editCategory').value = ev.category;
            document.getElementById('editCapacity').value = ev.capacity;
            
            // Try to set date and time if they match standard formats, else leave blank
            document.getElementById('editDate').value = '';
            document.getElementById('editTime').value = '';
            
            document.getElementById('editEventModal').classList.remove('hidden');
        }
    } catch(e){
        alert('Failed to load event details.');
    }
}

async function handleEditEvent(e) {
    e.preventDefault();
    if (!currentEditId) return;

    const payload = {
        title: document.getElementById('editTitle').value,
        description: document.getElementById('editDescription').value,
        location: document.getElementById('editLocation').value,
        category: document.getElementById('editCategory').value,
        capacity: document.getElementById('editCapacity').value
    };

    const dateVal = document.getElementById('editDate').value;
    if(dateVal) {
        const dtObj = new Date(dateVal);
        payload.date = dtObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    const timeVal = document.getElementById('editTime').value;
    if(timeVal) {
        let [hours, minutes] = timeVal.split(':');
        hours = parseInt(hours);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        payload.time = `${hours}:${minutes} ${ampm}`;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/events/${currentEditId}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            document.getElementById('editEventModal').classList.add('hidden');
            loadEvents();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to update event');
        }
    } catch (err) {
        alert('Server error');
    }
}

// ==================== DELETE EVENT ====================
async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
            loadEvents();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to delete');
        }
    } catch (e) {
        alert('Server error');
    }
}

// ==================== UTILS ====================
function switchAdminTab(tab) {
    document.getElementById('dashboardTab').classList.toggle('hidden', tab !== 'dashboard');
    document.getElementById('attendeesTab').classList.toggle('hidden', tab !== 'attendees');

    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.className = btn.className
                .replace('text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium', 'bg-violet-600/10 text-violet-400 font-bold')
                .replace(/\s*border\s+border-violet-500\/20/g, '') + ' border border-violet-500/20';
        } else {
            btn.className = btn.className
                .replace('bg-violet-600/10 text-violet-400 font-bold', 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium')
                .replace(/\s*border\s+border-violet-500\/20/g, '');
        }
    });
}

function toggleEvent(btn) {
    const panel = btn.nextElementSibling;
    const chevron = btn.querySelector('.chevron');
    panel.classList.toggle('hidden');
    chevron.style.transform = panel.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

function searchEvents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#eventsTableBody tr');
    rows.forEach(row => {
        const title = row.querySelector('.font-bold.text-white').textContent.toLowerCase();
        row.style.display = title.includes(query) ? '' : 'none';
    });
}

// Sidebar toggle
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleBtn = document.getElementById('sidebarToggle');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    if (sidebar.classList.contains('collapsed')) {
        sidebar.style.width = '72px';
        mainContent.style.marginLeft = '72px';
    } else {
        sidebar.style.width = '256px';
        mainContent.style.marginLeft = '256px';
    }
});

// Typewriter animation
window.addEventListener('load', () => {
    const el = document.getElementById('provenueText');
    if (el) {
        setTimeout(() => {
            el.classList.add('typing');
            setTimeout(() => el.classList.add('typewriter-done'), 1000);
        }, 300);
    }
});
