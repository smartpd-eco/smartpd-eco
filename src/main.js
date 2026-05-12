const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const data = Object.fromEntries(formData.entries());

    console.log('Form data:', data);
});