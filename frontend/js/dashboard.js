// ==================== ATTENDEE DASHBOARD JS ====================

let eventsData = {};
let currentDetailId = null;
let registeredEventsList = [];

// Get Token
function getToken() {
    return localStorage.getItem('token');
}

// Redirect if not logged in
if (!getToken()) {
    window.location.href = 'login.html';
}

// ==================== INITIALIZATION ====================
async function loadEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) {
            const array = await response.json();
            eventsData = {}; 
            array.forEach(ev => { eventsData[ev._id] = ev; });
            renderEventsGrid(array);
        }
    } catch (e) {
        console.error('Failed to load events', e);
    }
}

async function loadRegistrations() {
    try {
        const response = await fetch('http://localhost:5000/api/registrations/my-events', {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (response.ok) {
            registeredEventsList = await response.json();
            renderRegistrations();
            
            // Mark existing events as registered on UI
            registeredEventsList.forEach(reg => {
                if (reg.event && reg.event._id) {
                    markAsRegistered(reg.event._id);
                }
            });
        }
    } catch (e) {
        console.error('Failed to load registrations', e);
    }
}

function markAsRegistered(eventId) {
    const card = document.querySelector(`.event-card[data-event="${eventId}"]`);
    if (card) {
        let badge = card.querySelector('.reg-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'reg-badge absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10';
            badge.textContent = 'Registered';
            card.querySelector('.relative').appendChild(badge);
        }
    }
}

function renderEventsGrid(eventsArray) {
    const grid = document.getElementById('eventsGrid');
    if (!grid) return;
    
    // Default image if not provided
    const defaultImg = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJIXqbFZrh7mVW5LcsPV_GADQWiSEYufpLfonQm80QqSdqxAxmktJvEmree4y5cA1naF9GHTnQ29DAtT9ian06FYH_irpLI4E4_7KUzNmV1MErpImtMu7gkcipcFC1vskuHj4Ja_ABvoJbE0lJPWzlkpAeY1XPpAGP3HzE8Un8IsAAwjFublSxTxPq_Qcb_J9WUogYeBUIsxN13211cvCR9fcdweSmNdAt28gVE7Ns-shUO3pJ0qgsmLCtsQlqCm2vRVMtwiHZdP8';

    grid.innerHTML = eventsArray.map(ev => {
        const img = ev.imageUrl || defaultImg;
        return `
        <div class="event-card glass-panel rounded-2xl border border-zinc-800/80 overflow-hidden relative cursor-pointer" data-event="${ev._id}" onclick="openDetails('${ev._id}')">
            <div class="relative">
                <img src="${img}" class="w-full h-44 object-cover" alt="Event" />
                <div class="card-overlay absolute inset-0 bg-zinc-950/70 backdrop-blur-sm flex items-center justify-center">
                    <span class="bg-violet-600 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg">
                        <span class="material-symbols-outlined text-sm">visibility</span>
                        View Details
                    </span>
                </div>
            </div>
            <div class="p-4">
                <h4 class="font-headline font-bold text-white text-lg">${ev.title}</h4>
            </div>
        </div>`;
    }).join('');
}

window.addEventListener('load', () => {
    loadEvents().then(() => loadRegistrations());
});

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
    document.getElementById('browseTab').classList.toggle('hidden', tab !== 'browse');
    document.getElementById('registeredTab').classList.toggle('hidden', tab !== 'registered');

    document.querySelectorAll('.sidebar-nav-btn').forEach(btn => {
        if (btn.dataset.tab === tab) {
            btn.className = btn.className.replace('text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium', 'bg-violet-600/10 text-violet-400 font-bold').replace('border-violet-500/20', '') + ' border border-violet-500/20';
        } else {
            btn.className = btn.className.replace('bg-violet-600/10 text-violet-400 font-bold', 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50 font-medium').replace(/\s*border\s+border-violet-500\/20/g, '');
        }
    });
}

// ==================== SEARCH ====================
function searchEvents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const cards = document.querySelectorAll('#eventsGrid .event-card');
    cards.forEach(card => {
        const titleEl = card.querySelector('.font-headline');
        if (titleEl) {
            card.style.display = titleEl.textContent.toLowerCase().includes(query) ? '' : 'none';
        }
    });
}

// ==================== VIEW DETAILS ====================
function openDetails(id) {
    const ev = eventsData[id];
    if (!ev) return;
    currentDetailId = id;
    
    document.getElementById('detailImg').src = ev.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJIXqbFZrh7mVW5LcsPV_GADQWiSEYufpLfonQm80QqSdqxAxmktJvEmree4y5cA1naF9GHTnQ29DAtT9ian06FYH_irpLI4E4_7KUzNmV1MErpImtMu7gkcipcFC1vskuHj4Ja_ABvoJbE0lJPWzlkpAeY1XPpAGP3HzE8Un8IsAAwjFublSxTxPq_Qcb_J9WUogYeBUIsxN13211cvCR9fcdweSmNdAt28gVE7Ns-shUO3pJ0qgsmLCtsQlqCm2vRVMtwiHZdP8';
    document.getElementById('detailTitle').textContent = ev.title;
    document.getElementById('detailLocation').textContent = ev.location;
    document.getElementById('detailDate').textContent = ev.date;
    document.getElementById('detailTime').textContent = ev.time;
    document.getElementById('detailCategory').textContent = ev.category;
    document.getElementById('detailSpots').textContent = ev.capacity ? `Capacity: ${ev.capacity}` : '';
    document.getElementById('detailsModal').classList.remove('hidden');
}

// ==================== REGISTER ====================
let currentRegId = null;

function openRegister(id) {
    const ev = eventsData[id];
    if (!ev) return;
    
    // Check if registered
    const isReg = registeredEventsList.find(r => r.event && r.event._id === id);
    if (isReg) {
        alert('You are already registered for this event!');
        return;
    }
    
    currentRegId = id;
    document.getElementById('regEventName').textContent = ev.title;
    
    // Pre-fill user data
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            document.getElementById('regName').value = user.name || '';
            document.getElementById('regEmail').value = user.email || '';
        } catch(e) {}
    }
    
    document.getElementById('registerModal').classList.remove('hidden');
}

async function handleRegistration(e) {
    e.preventDefault();
    const ev = eventsData[currentRegId];
    if (!ev) return;

    try {
        const response = await fetch(`http://localhost:5000/api/registrations/${currentRegId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            }
        });
        const data = await response.json();
        
        if (response.ok) {
            // Close modal & reset
            document.getElementById('registerModal').classList.add('hidden');
            document.getElementById('registerForm').reset();
            
            // Reload registrations
            loadRegistrations();
            alert('Successfully registered!');
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (err) {
        alert('Server error');
    }
}

// ==================== RENDER REGISTRATIONS ====================
function renderRegistrations() {
    const list = document.getElementById('registeredList');
    document.getElementById('regCount').textContent = registeredEventsList.length + ' event' + (registeredEventsList.length !== 1 ? 's' : '');

    if (registeredEventsList.length === 0) {
        list.innerHTML = `
            <div class="text-center py-16">
                <span class="material-symbols-outlined text-zinc-700 text-6xl mb-4 block">event_busy</span>
                <p class="text-zinc-500 font-medium">You haven't registered for any events yet.</p>
                <button onclick="switchTab('browse')" class="mt-4 text-violet-400 font-bold hover:text-violet-300 transition-colors">Browse Events →</button>
            </div>`;
        return;
    }

    list.innerHTML = registeredEventsList.map(r => {
        const evInfo = r.event;
        if (!evInfo) return '';
        
        const img = evInfo.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJIXqbFZrh7mVW5LcsPV_GADQWiSEYufpLfonQm80QqSdqxAxmktJvEmree4y5cA1naF9GHTnQ29DAtT9ian06FYH_irpLI4E4_7KUzNmV1MErpImtMu7gkcipcFC1vskuHj4Ja_ABvoJbE0lJPWzlkpAeY1XPpAGP3HzE8Un8IsAAwjFublSxTxPq_Qcb_J9WUogYeBUIsxN13211cvCR9fcdweSmNdAt28gVE7Ns-shUO3pJ0qgsmLCtsQlqCm2vRVMtwiHZdP8';
        const regDate = new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        return `
        <div class="glass-panel rounded-2xl border border-zinc-800/80 p-5 flex items-center justify-between gap-4 relative">
            <div class="flex items-center gap-4">
                <img src="${img}" class="w-14 h-14 rounded-xl object-cover" alt="Event"/>
                <div>
                    <p class="font-bold text-white">${evInfo.title}</p>
                    <p class="text-xs text-zinc-500">${evInfo.location} · ${evInfo.date}</p>
                    <p class="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">Registered on ${regDate}</p>
                </div>
            </div>
            <button onclick="cancelRegistration('${evInfo._id}')" class="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-all" title="Cancel Registration">
                <span class="material-symbols-outlined">cancel</span>
            </button>
        </div>`;
    }).join('');
}

// ==================== CANCEL REGISTRATION ====================
async function cancelRegistration(eventId) {
    if (!confirm('Cancel your registration for this event?')) return;
    
    try {
        const response = await fetch(`http://localhost:5000/api/registrations/${eventId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
            // Remove registered badge from card
            const card = document.querySelector(`.event-card[data-event="${eventId}"]`);
            if (card) {
                const badge = card.querySelector('.reg-badge');
                if (badge) badge.remove();
            }
            loadRegistrations();
        } else {
            const data = await response.json();
            alert(data.message || 'Failed to cancel');
        }
    } catch (e) {
        alert('Server error');
    }
}

// ==================== SIDEBAR TOGGLE ====================
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

// Typewriter animation for ProVenue
window.addEventListener('load', () => {
    const el = document.getElementById('provenueText');
    if (el) {
        setTimeout(() => {
            el.classList.add('typing');
            setTimeout(() => el.classList.add('typewriter-done'), 1000);
        }, 300);
    }
});
