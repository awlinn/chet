const registerForm = document.getElementById('registerForm');
const lofinForm = document.getElementById('loginForm');
const body = document.body;
const container = document.querySelector('.container');

function toggleTheme() {
  body.classList.toggle('dark-theme');
  container.classList.toggle('dark-theme');
}
registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const login = document.getElementById("registUsername").value;
  const password = document.getElementById("registPassword").value;
  const passwordRepeat = document.getElementById("registconfirmPassword").value;

  if (password !== passwordRepeat) {
    return alert('Passwords do not match');
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: login,
        password: password,
        passwordRepeat: passwordRepeat,
      }),
    });

    if (response.ok) {
      window.location.href = '/chat.html';
    } else {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error during registration:', error);
  }
});



lofinForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const login = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  console.log(login, password);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        login: login,
        password: password
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      //successful
    } else {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        console.log(`Error: ${errorData.message}`);
      } else {
        console.log(`Error: ${response.statusText}`);
      }
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
});

