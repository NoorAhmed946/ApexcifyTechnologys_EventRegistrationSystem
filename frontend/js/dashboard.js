// ==================== ATTENDEE DASHBOARD JS ====================

// ==================== EVENT DATA ====================
const eventsData = {
    1: {
        title: 'Midnight Synthwave Session',
        location: 'Warehouse 7',
        category: 'Music',
        date: 'Oct 24, 2024',
        time: '9:00 PM',
        spots: '150/1000',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJIXqbFZrh7mVW5LcsPV_GADQWiSEYufpLfonQm80QqSdqxAxmktJvEmree4y5cA1naF9GHTnQ29DAtT9ian06FYH_irpLI4E4_7KUzNmV1MErpImtMu7gkcipcFC1vskuHj4Ja_ABvoJbE0lJPWzlkpAeY1XPpAGP3HzE8Un8IsAAwjFublSxTxPq_Qcb_J9WUogYeBUIsxN13211cvCR9fcdweSmNdAt28gVE7Ns-shUO3pJ0qgsmLCtsQlqCm2vRVMtwiHZdP8'
    },
    2: {
        title: 'Digital Aura Exhibit',
        location: 'Grand Gallery',
        category: 'Digital Art',
        date: 'Nov 15, 2024',
        time: '10:00 AM',
        spots: '225/500',
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfMoGxo1egxBP12IMedQEWflI08FHJlMgiCuDD8iLrbg4Hv1Hwe-Brg8CKgE7zDEforXNXOo5nvG-25ncrOFT0lImnDIMmJHrDM4UDMXM2RteWSk86xZd2EUanrnwYE3KBKVtvID_QqlPXV6drMryx7iP07h41M66oqBpFC4kamcuByJxylmBsycrhjJWNQyjWk3GDZ5yuKnmttiGPr9HY9BQyowoL_sAliW4zVsLnDkHwmanN8rjSjbj1MDU_77ZptnPxQUnk_F8'
    }
};

let currentDetailId = null;
let registeredEvents = {};

// ==================== TAB SWITCHING ====================
function switchTab(tab) {
    document.getElementById('browseTab').classList.toggle('hidden', tab !== 'browse');
    document.getElementById('registeredTab').classList.toggle('hidden', tab !== 'registered');

    // Update sidebar active state
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
    document.getElementById('detailImg').src = ev.img;
    document.getElementById('detailTitle').textContent = ev.title;
    document.getElementById('detailLocation').textContent = ev.location;
    document.getElementById('detailDate').textContent = ev.date;
    document.getElementById('detailTime').textContent = ev.time;
    document.getElementById('detailCategory').textContent = ev.category;
    document.getElementById('detailSpots').textContent = ev.spots + ' registered';
    document.getElementById('detailsModal').classList.remove('hidden');
}

// ==================== REGISTER ====================
let currentRegId = null;

function openRegister(id) {
    const ev = eventsData[id];
    if (!ev) return;
    if (registeredEvents[id]) {
        alert('You are already registered for this event!');
        return;
    }
    currentRegId = id;
    document.getElementById('regEventName').textContent = ev.title;
    document.getElementById('registerModal').classList.remove('hidden');
}

function handleRegistration(e) {
    e.preventDefault();
    const ev = eventsData[currentRegId];
    if (!ev) return;

    registeredEvents[currentRegId] = {
        ...ev,
        name: document.getElementById('regName').value,
        email: document.getElementById('regEmail').value,
        regDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    // Close modal & reset
    document.getElementById('registerModal').classList.add('hidden');
    document.getElementById('registerForm').reset();

    // Update card to show registered badge
    const card = document.querySelector(`.event-card[data-event="${currentRegId}"]`);
    if (card) {
        let badge = card.querySelector('.reg-badge');
        if (!badge) {
            badge = document.createElement('div');
            badge.className = 'reg-badge absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full z-10';
            badge.textContent = 'Registered';
            card.querySelector('.relative').appendChild(badge);
        }
    }

    renderRegistrations();
}

// ==================== RENDER REGISTRATIONS ====================
function renderRegistrations() {
    const list = document.getElementById('registeredList');
    const keys = Object.keys(registeredEvents);
    document.getElementById('regCount').textContent = keys.length + ' event' + (keys.length !== 1 ? 's' : '');

    if (keys.length === 0) {
        list.innerHTML = `
            <div class="text-center py-16">
                <span class="material-symbols-outlined text-zinc-700 text-6xl mb-4 block">event_busy</span>
                <p class="text-zinc-500 font-medium">You haven't registered for any events yet.</p>
                <button onclick="switchTab('browse')" class="mt-4 text-violet-400 font-bold hover:text-violet-300 transition-colors">Browse Events →</button>
            </div>`;
        return;
    }

    list.innerHTML = keys.map(id => {
        const r = registeredEvents[id];
        return `
        <div class="glass-panel rounded-2xl border border-zinc-800/80 p-5 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4">
                <img src="${r.img}" class="w-14 h-14 rounded-xl object-cover" alt="Event"/>
                <div>
                    <p class="font-bold text-white">${r.title}</p>
                    <p class="text-xs text-zinc-500">${r.location} · ${r.date} · ${r.time}</p>
                    <p class="text-[10px] text-emerald-400 font-bold mt-1 uppercase tracking-widest">Registered on ${r.regDate}</p>
                </div>
            </div>
            <button onclick="cancelRegistration(${id})" class="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-all" title="Cancel Registration">
                <span class="material-symbols-outlined">cancel</span>
            </button>
        </div>`;
    }).join('');
}

// ==================== CANCEL REGISTRATION ====================
function cancelRegistration(id) {
    if (!confirm('Cancel your registration for ' + registeredEvents[id].title + '?')) return;
    delete registeredEvents[id];

    // Remove registered badge from card
    const card = document.querySelector(`.event-card[data-event="${id}"]`);
    if (card) {
        const badge = card.querySelector('.reg-badge');
        if (badge) badge.remove();
    }

    renderRegistrations();
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
