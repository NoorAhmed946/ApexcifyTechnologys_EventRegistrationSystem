// ==================== ADMIN DASHBOARD JS ====================

// Tab switching
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

// Accordion toggle for attendees
function toggleEvent(btn) {
    const panel = btn.nextElementSibling;
    const chevron = btn.querySelector('.chevron');
    panel.classList.toggle('hidden');
    chevron.style.transform = panel.classList.contains('hidden') ? '' : 'rotate(180deg)';
}

// Open edit modal with pre-filled data from event row
function openEditEvent(rowIndex) {
    const rows = document.querySelectorAll('#eventsTableBody tr');
    const row = rows[rowIndex];
    if (!row) return;

    const title = row.querySelector('.font-bold.text-white').textContent;
    const location = row.querySelector('.text-xs.text-zinc-500').textContent;
    const dateText = row.querySelectorAll('td')[1].querySelector('.text-sm').textContent;
    const timeText = row.querySelectorAll('td')[1].querySelector('.text-xs').textContent;
    const regText = row.querySelector('.text-zinc-300').textContent; // e.g. "850/1000"
    const capacity = regText.split('/')[1];

    document.getElementById('editEventIndex').value = rowIndex;
    document.getElementById('editTitle').value = title;
    document.getElementById('editLocation').value = location;
    document.getElementById('editCapacity').value = capacity;
    // Date and time would need parsing; leave empty for user to set
    document.getElementById('editDate').value = '';
    document.getElementById('editTime').value = '';
    document.getElementById('editPrice').value = '';

    document.getElementById('editEventModal').classList.remove('hidden');
}

// Handle edit form submission
function handleEditEvent(e) {
    e.preventDefault();
    const idx = parseInt(document.getElementById('editEventIndex').value);
    const rows = document.querySelectorAll('#eventsTableBody tr');
    const row = rows[idx];
    if (!row) return;

    const title = document.getElementById('editTitle').value;
    const date = document.getElementById('editDate').value;
    const time = document.getElementById('editTime').value;
    const location = document.getElementById('editLocation').value;
    const capacity = document.getElementById('editCapacity').value;

    // Update visible cells
    row.querySelector('.font-bold.text-white').textContent = title;
    row.querySelector('.text-xs.text-zinc-500').textContent = location;

    if (date) {
        const d = new Date(date + 'T00:00:00');
        row.querySelectorAll('td')[1].querySelector('.text-sm').textContent =
            d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (time) {
        const [h, m] = time.split(':');
        const hr = parseInt(h);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const hr12 = hr % 12 || 12;
        row.querySelectorAll('td')[1].querySelector('.text-xs').textContent = `${hr12}:${m} ${ampm}`;
    }

    // Update capacity in registration text (keep current registrations)
    const regSpan = row.querySelector('.text-zinc-300');
    const currentReg = regSpan.textContent.split('/')[0];
    regSpan.textContent = `${currentReg}/${capacity}`;
    const pct = Math.round((parseInt(currentReg) / parseInt(capacity)) * 100);
    row.querySelector('.bg-violet-500').style.width = pct + '%';

    document.getElementById('editEventModal').classList.add('hidden');
}

function searchEvents() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#eventsTableBody tr');
    rows.forEach(row => {
        const title = row.querySelector('.font-bold.text-white').textContent.toLowerCase();
        row.style.display = title.includes(query) ? '' : 'none';
    });
}

function handleCreateEvent(event) {
    event.preventDefault();

    // Get values
    const title = document.getElementById('eventTitle').value;
    const loc = document.getElementById('eventLocation').value;
    const dtObj = new Date(document.getElementById('eventDate').value);
    const dateStr = dtObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Format time
    const timeRaw = document.getElementById('eventTime').value;
    let [hours, minutes] = timeRaw.split(':');
    hours = parseInt(hours);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const timeStr = `${hours}:${minutes} ${ampm}`;

    const capacity = document.getElementById('eventCapacity').value;
    const price = parseFloat(document.getElementById('eventPrice').value).toLocaleString();
    let img = document.getElementById('eventImageUrl').value;
    if (!img) {
        img = "https://lh3.googleusercontent.com/aida-public/AB6AXuAJIXqbFZrh7mVW5LcsPV_GADQWiSEYufpLfonQm80QqSdqxAxmktJvEmree4y5cA1naF9GHTnQ29DAtT9ian06FYH_irpLI4E4_7KUzNmV1MErpImtMu7gkcipcFC1vskuHj4Ja_ABvoJbE0lJPWzlkpAeY1XPpAGP3HzE8Un8IsAAwjFublSxTxPq_Qcb_J9WUogYeBUIsxN13211cvCR9fcdweSmNdAt28gVE7Ns-shUO3pJ0qgsmLCtsQlqCm2vRVMtwiHZdP8"; // placeholder
    }

    // Create row
    const rowIdx = document.querySelectorAll('#eventsTableBody tr').length;
    const tr = document.createElement('tr');
    tr.className = 'hover:bg-zinc-900/30 transition-colors';
    tr.innerHTML = `
        <td class="py-4 px-4">
            <div class="flex items-center gap-4">
                <img src="${img}" class="w-12 h-12 rounded-lg object-cover" alt="Thumb"/>
                <div>
                    <p class="font-bold text-white mb-0.5">${title}</p>
                    <p class="text-xs text-zinc-500">${loc}</p>
                </div>
            </div>
        </td>
        <td class="py-4 px-4">
            <p class="text-sm font-bold text-zinc-200">${dateStr}</p>
            <p class="text-xs text-zinc-500">${timeStr}</p>
        </td>
        <td class="py-4 px-4">
            <div class="flex items-center gap-2">
                <div class="w-full bg-zinc-800 rounded-full h-1.5 max-w-[100px]">
                    <div class="bg-violet-500 h-1.5 rounded-full" style="width: 0%"></div>
                </div>
                <span class="text-sm font-medium text-zinc-300">0/${capacity}</span>
            </div>
        </td>
        <td class="py-4 px-4 text-right">
            <button onclick="openEditEvent(${rowIdx})" class="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-all" title="Edit Event"><span class="material-symbols-outlined text-[20px]">edit</span></button>
            <button onclick="this.closest('tr').remove();" class="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all" title="Cancel/Delete Event"><span class="material-symbols-outlined text-[20px]">delete</span></button>
        </td>
    `;

    document.getElementById('eventsTableBody').prepend(tr);

    // Close and reset
    document.getElementById('createEventModal').classList.add('hidden');
    document.getElementById('createEventForm').reset();
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
