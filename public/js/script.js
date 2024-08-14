function dateTime() {
    const currentDate = new Date();
    document.getElementById('dateTime').innerHTML = currentDate;
}
dateTime();
setInterval(dateTime, 1000);

function validateFormFind(event) {
    var isValid = true;
    document.getElementById('petTypeError').textContent = '';
    document.getElementById('breedError').textContent = '';
    document.getElementById('ageError').textContent = '';
    document.getElementById('genderError').textContent = '';
    document.getElementById('getAlongError').textContent = '';

    var radioOption = document.getElementsByName("catdog");
    if (!(radioOption[0].checked || radioOption[1].checked)) {
        document.getElementById('petTypeError').textContent = 'Please select your preferred pet.';
        isValid = false;
    }

    if (document.querySelector('input[name="catdog"]:checked')?.value === 'cat' && !findForm.catbreed.value) {
        document.getElementById('breedError').textContent = 'Please select your preferred breed.';
        isValid = false;
    }

    if (document.querySelector('input[name="catdog"]:checked')?.value === 'dog' && !findForm.dogbreed.value) {
        document.getElementById('breedError').textContent = 'Please select your preferred breed.';
        isValid = false;
    }

    if (!findForm.age.value) {
        document.getElementById('ageError').textContent = 'Please select your preferred age.';
        isValid = false;
    }

    if (!findForm.gender.value) {
        document.getElementById('genderError').textContent = 'Please select your preferred gender.';
        isValid = false;
    }

    var checkboxOption = document.getElementsByName("getAlongWith");
    if (![...checkboxOption].some(checkbox => checkbox.checked)) {
        document.getElementById('getAlongError').textContent = 'Please select at least one option.';
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }
    return isValid;
}

function validateFormAdoption(event){
    var isValid = true;

    document.getElementById('petTypeError').textContent = '';
    document.getElementById('breedError').textContent = '';
    document.getElementById('ageError').textContent = '';
    document.getElementById('genderError').textContent = '';
    document.getElementById('fnameError').textContent = '';
    document.getElementById('lnameError').textContent = '';
    document.getElementById('emailError').textContent = '';
    document.getElementById('commentError').textContent = '';
    document.getElementById('getAlongError').textContent = '';

    var radioOption = document.getElementsByName("catdog");
    if (!(radioOption[0].checked || radioOption[1].checked)) {
        document.getElementById('petTypeError').textContent = 'Please select your preferred pet.';
        isValid = false;
    } 
    
    var giveawayForm = document.getElementById('giveawayForm');

    if (giveawayForm.catbreed.value=="" && giveawayForm.dogbreed.value=="") {
        document.getElementById('breedError').textContent = 'Please select your preferred breed.';
        isValid = false;

    }
    if (giveawayForm.age.value=="") {
        document.getElementById('ageError').textContent = 'Please select your preferred age.';
        isValid = false;

    }
    if (giveawayForm.gender.value=="") {
        document.getElementById('genderError').textContent = 'Please select your preferred gender.';
        isValid = false;

    }
    var fname = giveawayForm.fname.value.trim();
  if (fname == "") {
    document.getElementById('fnameError').textContent = 'Please enter your first name.';
        isValid = false;
  }
  var lname = giveawayForm.lname.value.trim();
  if (lname == "") {
    document.getElementById('lnameError').textContent = 'Please enter your last name.';
        isValid = false;
  }
  var email = giveawayForm.email.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email == "") {
    document.getElementById('emailError').textContent = 'Please enter your E-mail address.';
        isValid = false;
  }
  if (emailRegex.test(email)) {
    document.getElementById('emailError').textContent = ""; 
  } else {
    document.getElementById('emailError').textContent = "Please enter a valid email address.";
  }
  var comment = giveawayForm.comment.value.trim();
  if (comment == "") {
      document.getElementById('commentError').textContent = 'Please enter a comment about what you love the most about your pet.';
      isValid = false;
  }
  var checkboxOption = document.getElementsByName("getAlongWith");
  if (!(checkboxOption[0].checked || checkboxOption[1].checked || checkboxOption[2].checked || checkboxOption[3].checked)) {
    document.getElementById('getAlongError').textContent = 'Please select at least one option.';
    isValid = false;
} 
if (!isValid) {
    event.preventDefault(); 
}
return isValid;
}
function validateCreateAccountForm(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const usernameError = document.getElementById('usernameError');
    const passwordError = document.getElementById('passwordError');
    let isValid = true;

    usernameError.textContent = '';
    passwordError.textContent = '';

    if (!/^[a-zA-Z0-9]+$/.test(username)) {
        usernameError.textContent = 'Username can only contain letters and digits.';
        isValid = false;
    }

    if (password.length < 4 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
        passwordError.textContent = 'Password must be at least 4 characters long and contain at least one letter and one digit.';
        isValid = false;
    }

    if (!isValid) {
        event.preventDefault();
    }

    return isValid;
}
function validateRegistrationForm(event) {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const usernamePattern = /^[a-zA-Z0-9]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,}$/;

    let isValid = true;

    if (!usernamePattern.test(username)) {
        document.getElementById('usernameError').innerText = 'Username can only contain letters and digits.';
        isValid = false;
    } else {
        document.getElementById('usernameError').innerText = '';
    }

    if (!passwordPattern.test(password)) {
        document.getElementById('passwordError').innerText = 'Password must be at least 4 characters long and contain at least one letter and one digit.';
        isValid = false;
    } else {
        document.getElementById('passwordError').innerText = '';
    }

    if (!isValid) {
        event.preventDefault();
    }

    return isValid;
}
document.addEventListener('DOMContentLoaded', () => {
    fetch('/session-info')
    .then(response => response.json())
    .then(data => {
        const username = data.username;
        if (username) {
            document.getElementById('usernameDisplay').textContent = `Logged in as: ${username}`;
        } else {
            document.getElementById('usernameDisplay').textContent = 'Not logged in';
        }
    });

    document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            window.location.href = '/'; 
        }
    });

    document.getElementById('createAccountForm')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const response = await fetch('/create-account', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        });
        const result = await response.json();
        document.getElementById('message').innerText = result.message; 
        
    });
    

    document.getElementById('logoutLink')?.addEventListener('click', async () => {
        const response = await fetch('/logout', {
            method: 'POST'
        });
        const result = await response.json();
        alert(result.message);
        if (result.success) {
            window.location.href = '/';
        }
    });
});


const privacyLink = document.getElementById("privacy");
privacyLink.addEventListener("click", function(){
    alert("We promise not to sell or misuse your information. We are not liable for any incorrect information posted by pet owners.")
});





