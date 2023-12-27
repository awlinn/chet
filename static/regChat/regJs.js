const registerForm = document.getElementById('registerForm');
const lofinForm = document.getElementById('loginForm');
const body = document.body;
const container = document.querySelector('.container');

function toggleTheme() {
  body.classList.toggle('dark-theme');
  container.classList.toggle('dark-theme');
}

//lofinForm
lofinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const login = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/api/login', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = function () {
    if (xhr.status >= 200) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xhr.responseText, 'application/xml');
      const errorNode = xmlDoc.querySelector('error'); // Adjust this selector based on your XML structure

      if (errorNode) {
        const errorMessage = errorNode.textContent;
        console.log(`Error: ${errorMessage}`);
      } else {
        console.log('Login successful');
        window.location.assign('/index.html');  // successful 
      }
    } else {
      console.log(`Error: ${xhr.statusText}`);
    }
  };

  xhr.onerror = function () {
    console.error('Error during login:', xhr.statusText);
  };

  xhr.send(JSON.stringify({
    login: login,
    password: password
  }));
  document.getElementById("loginUsername").value = "";
  document.getElementById("loginPassword").value = "";
});

//registerForm
registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const login = document.getElementById("registUsername").value;
  const password = document.getElementById("registPassword").value;
  const registConfirmPassword = document.getElementById("registConfirmPassword").value;

  if (password !== registConfirmPassword) {
    alert("Password is not equal to Confirm Password")
  } else {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', "/api/register", true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status <= 300) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xhr.responseText, 'application/xml');
        const errorNode = xmlDoc.querySelector('error'); // Adjust this selector based on your XML structure

        if (errorNode) {
          const errorMessage = errorNode.textContent;
          console.log(`Error: ${errorMessage}`);
        } else {
          console.log('regist successful');
          window.location.assign('/index.html');  // successful 
        }
      } else {
        console.log(`Error: ${xhr.statusText}`);
      }
    };

    xhr.onerror = function () {
      console.error('Error during regist:', xhr.statusText);
    };

    xhr.send(JSON.stringify({
      login: login,
      password: password,
      registConfirmPassword: registConfirmPassword
    }));

    document.getElementById("registUsername").value = "";
    document.getElementById("registPassword").value = "";
    document.getElementById("registConfirmPassword").value = "";
  }
});



function toggleForm(dataSwitch) {
  const registerFormSwitch = document.getElementById("registerForm");
  const loginFormSwitch = document.getElementById("loginForm");

  if (dataSwitch === "loginForm") {
    loginFormSwitch.style.display = "none";
    registerFormSwitch.style.display = "block";
  } else if (dataSwitch === "registerForm") {
    registerFormSwitch.style.display = "none";
    loginFormSwitch.style.display = "block";
  }
}




