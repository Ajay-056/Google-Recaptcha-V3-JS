const eye = document.querySelector('.fa-eye');
const form = document.getElementById('loginForm');
const userName = document.getElementById('Username');
const password = document.getElementById('Password');
const hidden = document.getElementById('g-recaptcha-response');
const formGroup = document.querySelectorAll('.form-group');

userName.focus();

function isAnyEmpty(inputArray) {
  inputArray.forEach((input) => {
    input.value === ''
      ? showError(input, `${input.id} is required!`)
      : showSuccess(input);
  });
}

function showError(input, message) {
  input.parentNode.classList.remove('success');
  input.parentNode.classList.add('error');
  input.nextElementSibling.style.color = '#e74c3c';
  const small = input.parentNode.querySelector('small');
  small.innerText = message;
}

function showSuccess(input) {
  input.parentNode.classList.remove('error');
  input.parentNode.classList.add('success');
  input.nextElementSibling.style.color = '#2ecc71';
}

async function getResponseFromServer(Token) {
  const secretKey = '6LfUF3waAAAAALHV3UU6g5ZVgBGJTSSExNupqvRj';

  const URL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${Token}`;

  const alldata = await axios.post(URL);

  console.log(alldata.data.score);

  validateScoreAndCredentials(alldata.data.score);
}

function createAlert(message) {
  const alert = document.createElement('div');
  alert.className = 'alert';
  alert.style.display = 'flex';

  if (message === 'You are not a robot!') {
    alert.innerHTML = `<i class="fas fa-check-circle"></i>  ${message}`;
  } else {
    alert.innerHTML = `<i class="fas fa-times-circle"></i> ${message}`;
  }

  document.body.appendChild(alert);

  setTimeout(() => alert.remove(), 2000);
}

function validateScoreAndCredentials(score) {
  if (score > 0.5) {
    if (userName.value === 'admin' && password.value === '1234') {
      showSuccess(userName);
      showSuccess(password);
      createAlert('You are not a robot!');
    } else {
      showError(userName, '');
      showError(password, '');
      createAlert('Please check your credentials!');
    }
  } else {
    showError(userName, '');
    showError(password, '');
    createAlert('You are not a human!');
  }
}
setInterval(() => {
  grecaptcha.ready(function () {
    grecaptcha
      .execute('6LfUF3waAAAAAPKjsy3NC2h3jLrtb9SGaBHVw548', { action: 'submit' })
      .then(function (token) {
        hidden.value = token;
      });
  });
}, 3000);

eye.addEventListener('click', (e) => {
  const parentNode = e.target.parentNode;
  const targetInput = parentNode.querySelector('input');

  if (
    targetInput.id === 'Password' &&
    targetInput.getAttribute('type') === 'password'
  ) {
    targetInput.setAttribute('type', 'text');
    e.target.classList.toggle('fa-eye-slash');
  } else {
    targetInput.setAttribute('type', 'password');
    e.target.classList.toggle('fa-eye-slash');
  }
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  isAnyEmpty([userName, password]);

  getResponseFromServer(hidden.value);
});
