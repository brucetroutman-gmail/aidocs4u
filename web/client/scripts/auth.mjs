const signinForm = document.getElementById('signinForm');
const signupForm = document.getElementById('signupForm');
const showSignup = document.getElementById('showSignup');
const showSignin = document.getElementById('showSignin');

// Toggle between signin and signup forms
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    signinForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

showSignin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.add('hidden');
    signinForm.classList.remove('hidden');
});

// Handle signin
signinForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    
    try {
        const response = await fetch('/api/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.location.href = '/download';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Sign in failed. Please try again.');
    }
});

// Handle signup
signupForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Account created successfully! Please sign in.');
            signupForm.classList.add('hidden');
            signinForm.classList.remove('hidden');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Sign up failed. Please try again.');
    }
});
