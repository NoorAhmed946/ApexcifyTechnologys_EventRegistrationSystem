// ==================== LOGIN PAGE JS ====================

// Sign In handler
function handleSignIn(e) {
    e.preventDefault();
    const role = document.querySelector('input[name="role"]:checked').value;
    window.location.href = role === 'organizer' ? 'admin-dashboard.html' : 'dashboard.html';
}

// Sign Up handler
function handleSignUp(e) {
    e.preventDefault();
    const role = document.querySelector('input[name="signupRole"]:checked').value;
    window.location.href = role === 'organizer' ? 'admin-dashboard.html' : 'dashboard.html';
}

// Tab switching between Sign In and Create Account
function switchAuthTab(tab) {
    const signinForm = document.getElementById('signinForm');
    const signupForm = document.getElementById('signupForm');
    const tabSignIn = document.getElementById('tabSignIn');
    const tabCreateAccount = document.getElementById('tabCreateAccount');

    if (tab === 'signin') {
        signinForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
        tabSignIn.classList.add('text-white', 'border-b-2', 'border-violet-500', '-mb-px');
        tabSignIn.classList.remove('text-zinc-500');
        tabCreateAccount.classList.remove('text-white', 'border-b-2', 'border-violet-500', '-mb-px');
        tabCreateAccount.classList.add('text-zinc-500');
    } else {
        signinForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        tabCreateAccount.classList.add('text-white', 'border-b-2', 'border-violet-500', '-mb-px');
        tabCreateAccount.classList.remove('text-zinc-500');
        tabSignIn.classList.remove('text-white', 'border-b-2', 'border-violet-500', '-mb-px');
        tabSignIn.classList.add('text-zinc-500');
    }
}

// Role card styling
function setupRoleCards(radioName) {
    const radios = document.querySelectorAll(`input[name="${radioName}"]`);
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            radios.forEach(r => {
                const label = r.closest('label');
                const icon = label.querySelector('.material-symbols-outlined');
                const text = label.querySelector('span:last-child');
                if (r.checked) {
                    label.classList.remove('border-zinc-800', 'bg-zinc-900/50');
                    label.classList.add('border-violet-500', 'bg-violet-500/10');
                    icon.classList.remove('text-zinc-400');
                    icon.classList.add('text-violet-400');
                    text.classList.remove('text-zinc-400');
                    text.classList.add('text-violet-100');
                } else {
                    label.classList.add('border-zinc-800', 'bg-zinc-900/50');
                    label.classList.remove('border-violet-500', 'bg-violet-500/10');
                    icon.classList.add('text-zinc-400');
                    icon.classList.remove('text-violet-400');
                    text.classList.add('text-zinc-400');
                    text.classList.remove('text-violet-100');
                }
            });
        });
    });
}
setupRoleCards('role');
setupRoleCards('signupRole');

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
