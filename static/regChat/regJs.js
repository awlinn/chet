const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const { login, password, passwordRepeat } = registerForm;

  if (password.value !== passwordRepeat.value) {
    alert('Passwords do not match');
    return;
  }

  // Do something with the user information, like sending it to a server
  const user = {
    login: login.value,
    password: password.value,
    passwordRepeat: passwordRepeat.value,
  };

  // Continue with your code or send the user data to the server
  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/register');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(user));

  xhr.onload = () => alert(xhr.response);
});