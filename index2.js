const form = document.getElementById('validationForm');
const alerts = document.getElementById('alert');
const submit = document.getElementById('submit');

let formData = {
    nameCheck: false,
    usernameCheck: false,
    emailCheck: false,
    phoneCheck: false,
    passwordCheck: false,
    conformPasswordCheck: false,
    dobCheck: false,
    profileCheck: false,
    genderCheck: false,
    educationCheck: false,
    addrCheck: false,
    cityCheck: false,
    stateCheck: false,
    zipCheck: false,
    panCheck: false,
};

function updateValidation(element, isValid, message = '') {
    if (isValid) {
        element.classList.add("is-valid");
        element.classList.remove("is-invalid");
        element.nextElementSibling.textContent = "";
    } else {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
        element.nextElementSibling.textContent = message;
    }
}

  document.addEventListener("DOMContentLoaded", function () {
    fetch("options.json").then(response => response.json()).then(data => {
        populateDropdown(document.getElementById("inputEducation"), data.education, "Select Education");
        populateDropdown(document.getElementById("inputState"), data.states, "Select State");
      })
      .catch(error => console.error("Error fetching dropdown data:", error));
  });

  function populateDropdown(dropdown, options, defaultText) {
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultText;
    defaultOption.disabled = true;
    defaultOption.hidden = true;
    dropdown.appendChild(defaultOption);

    options.forEach(option => {
      const opt = document.createElement("option");
      opt.value = option;
      opt.textContent = option;
      dropdown.appendChild(opt);
    });

    dropdown.selectedIndex = 0;
  } 

function validateAndEncodeProfile() {
    const profile = document.getElementById('inputProfile');
    const file = profile.files[0];
    const maxSize = 2 * 1024 * 1024;
    
    let isValid = true;
    let message = '';

    if (!file) {
        isValid = false;
        message = "Please upload a profile picture!";
    } 
    else if (file.size > maxSize) {
        isValid = false;
        message = "File size should be less than 2MB!";
    }

    formData.profileCheck = isValid;
    updateValidation(profile, isValid, message);
}

function validateConfirmPassword() {
    const password = document.getElementById('inputPassword');
    const confirmPassword = document.getElementById('inputConformPassword');

    const isValid = confirmPassword.value === password.value;
    formData.conformPasswordCheck = isValid;
    updateValidation(confirmPassword, isValid, "Passwords don't match!");
}

function validateDob() {
    const dob = document.getElementById('inputDateOfBirth');
    const dobValue = new Date(dob.value);
    const today = new Date();

    const minDate = new Date('1950-01-01');
    const maxDate = new Date('2010-12-31');

    const isValid = dobValue instanceof Date &&
        !isNaN(dobValue) &&
        dobValue >= minDate &&
        dobValue <= maxDate;

    formData.dobCheck = isValid;
    updateValidation(dob, isValid, "Date of Birth must be between 1950 and 2010!");
}


function validateField(input, regex, checkVar, uniqueCheck, message) {
    const value = input.value.trim();
    const isValid = regex.test(value) && (uniqueCheck ? !uniqueCheck(value) : true);
    formData[checkVar] = isValid;

    if (isValid) {
        updateValidation(input, true);
    } else {
        updateValidation(input, false, message);
    }
}

submit.addEventListener("click", function (e) {
    e.preventDefault();

    console.log("Form Data Validation States:", formData);

    if (Object.values(formData).every(value => value === true)) {
        const names = document.getElementById('inputName');
        const username = document.getElementById('inputUsername');
        const email = document.getElementById('inputEmail');
        const phoneNumber = document.getElementById('inputPhoneNumber');
        const password = document.getElementById('inputPassword');
        const dob = document.getElementById('inputDateOfBirth');
        const profile = document.getElementById('inputProfile');
        const gender = document.getElementById('inputGender');
        const education = document.getElementById('inputEducation');
        const addr = document.getElementById('inputAddress');
        const city = document.getElementById('inputCity');
        const state = document.getElementById('inputState');
        const zip = document.getElementById('inputZip');
        const pan = document.getElementById('inputPan');

        const file = profile.files[0];
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64Image = event.target.result;

            const formDataToSave = {
                name: names.value.trim(),
                username: username.value.trim(),
                email: email.value.trim(),
                phoneNumber: phoneNumber.value.trim(),
                password: password.value.trim(),
                dob: dob.value.trim(),
                profile: base64Image, 
                fileName: file ? file.name : "",
                fileSize: file ? file.size : 0,
                gender: gender.value.trim(),
                education: education.value.trim(),
                address: addr.value.trim(),
                city: city.value.trim(),
                state: state.value.trim(),
                zip: zip.value.trim(),
                pan: pan.value.trim(),
            };

            let storedData = JSON.parse(localStorage.getItem("formData")) || [];
            storedData.push(formDataToSave);
            localStorage.setItem("formData", JSON.stringify(storedData));

            alerts.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show text-center p-4 fw-bold fs-5" role="alert" style="border: 2px solid #28a745; box-shadow: 0px 0px 15px rgba(40, 167, 69, 0.5);">
                    <strong>Success!</strong> Your form has been submitted successfully.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`;

            form.reset();
            resetForm();
        };

        if (file) {
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a profile image.');
        }
    } else {
        alerts.innerHTML = `
            <div class="alert alert-danger alert-dismissible fade show text-center p-4 fw-bold fs-5" role="alert" style="border: 2px solid #dc3545; box-shadow: 0px 0px 15px rgba(220, 53, 69, 0.5);">
                <strong>Error!</strong> Please fill in all the required fields correctly.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>`;
    }

    setTimeout(() => {
        alerts.innerHTML = "";
    }, 3000);
});


function resetForm() {
    form.reset();

    formData = {
        nameCheck: false,
        usernameCheck: false,
        emailCheck: false,
        phoneCheck: false,
        passwordCheck: false,
        conformPasswordCheck: false,
        dobCheck: false,
        profileCheck: false,
        genderCheck: false,
        educationCheck: false,
        addrCheck: false,
        cityCheck: false,
        stateCheck: false,
        zipCheck: false,
        panCheck: false,
    };

    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
        if (input.nextElementSibling) {
            input.nextElementSibling.textContent = "";
        }
    });

    form.querySelectorAll('input, select').forEach(input => {
        const event = new Event('input');
        input.dispatchEvent(event); 
    });
}

form.addEventListener('input', function (e) {
    const { target } = e;

    switch (target.id) {
        case 'inputProfile':
            validateAndEncodeProfile();
            break;
        case 'inputName':
            validateField(target, /^([a-zA-Z ]){1,20}$/, 'nameCheck', null, "Please enter a valid name!");
            break;
        case 'inputUsername':
            validateField(target, /^[a-zA-Z0-9_]{4,20}$/, 'usernameCheck', usernameTaken, "Please enter a valid and unique username (4-20 alphanumeric characters)!");
            break;
        case 'inputEmail':
            validateField(target, /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'emailCheck', emailTaken, "Please enter a valid email!");
            break;
        case 'inputPhoneNumber':
            validateField(target, /^([0-9]){10}$/, 'phoneCheck', phoneTaken, "Please enter a valid phone number!");
            break;
        case 'inputPassword':
            validateField(target, /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, 'passwordCheck', null, "Please enter a valid password!");
            break;
        case 'inputConformPassword':
            validateConfirmPassword();
            break;
        case 'inputDateOfBirth':    
            validateDob();
            break;
        case 'inputAddress':
            validateField(target, /^.{6,}$/, 'addrCheck',null,"Please enter a valid address!");
            break;
        case 'inputCity':
            validateField(target, /^[a-zA-Z\s]{2,}$/, 'cityCheck', null, "Please enter a valid city!");
            break;
        case 'inputGender':
            formData.genderCheck = target.value !== '';
            updateValidation(target, formData.genderCheck, "Please select your Gender!");
            break;
        case 'inputEducation':
            formData.educationCheck = target.value !== '';
            updateValidation(target, formData.educationCheck, "Please select your Education!");
            break;
        case 'inputState':
            formData.stateCheck = target.value !== '';
            updateValidation(target, formData.stateCheck, "Please select your State!");
            break;
        case 'inputZip':
            validateField(target, /^\d{6}$/, 'zipCheck', null, "Please enter a valid ZIP code!");
            break;
        case 'inputPan':
            validateField(target, /^[A-Z]{5}[0-9]{4}[A-Z]$/, 'panCheck', panTaken, "Invalid PAN number or it's already taken!");
            break;
    }
});

function emailTaken(email) {
    const storedData = JSON.parse(localStorage.getItem("formData")) || [];
    return storedData.some(item => item.email === email);
}

function phoneTaken(phone) {
    const storedData = JSON.parse(localStorage.getItem("formData")) || [];
    return storedData.some(item => item.phoneNumber === phone);
}

function panTaken(panNumber) {
    const storedData = JSON.parse(localStorage.getItem("formData")) || [];
    return storedData.some(item => item.pan === panNumber);
}

function usernameTaken(username) {
    const storedData = JSON.parse(localStorage.getItem("formData")) || [];
    return storedData.some(item => item.username === username);
}


function redirectToSearch() {
    window.location.href = "search2.html";
}