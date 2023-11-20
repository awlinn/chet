const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const { login, password, passwordRepeat } = registerForm;

  if (password.value !== passwordRepeat.value) {
    alert('Passwords do not match');
    return;
  }

 
  const user = {
    login: login.value,
    password: password.value,
    passwordRepeat: passwordRepeat.value,
  };

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/register');
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(user));

  xhr.onload = () => alert(xhr.response);
});

function toggleForm(dataSwitch) {
  console.log(dataSwitch);

  let formContainer = document.getElementById("formContainer");

  if (dataSwitch === "loginForm") {
    formContainer.innerHTML = `
      <form id="registerForm">
        <h2>Register</h2>
        <p>Username</p>
        <input type="text" id="username" autocomplete="username">
        <p>Password</p>
        <input type="password" id="password" autocomplete="new-password">
        <p>Confirm Password</p>
        <input type="password" id="confirmPassword" autocomplete="new-password">
        <input type="submit" value="Register">
        <button type="button" onclick="toggleForm('registerForm')">Switch to Login</button>
      </form>`;
  } else if (dataSwitch === "registerForm") {
    formContainer.innerHTML = `
      <form id="loginForm">
        <h2>Login</h2>
        <p>Username</p>
        <input type="text" id="loginUsername" autocomplete="username">
        <p>Password</p>
        <input type="password" id="loginPassword" autocomplete="current-password">
        <input type="submit" value="Login">
        <button type="button" onclick="toggleForm('loginForm')">Switch to Register</button>
      </form>`;
  }
}