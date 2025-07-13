// === LOGIN/SIGN-UP TOGGLE ===
const signUpBtn = document.getElementById("signUp");
const signInBtn = document.getElementById("signIn");
const container = document.getElementById("container");

signUpBtn?.addEventListener("click", () => container?.classList.add("right-panel-active"));
signInBtn?.addEventListener("click", () => container?.classList.remove("right-panel-active"));

// === TOGGLE PASSWORD VISIBILITY ===
function togglePasswordVisibility(fieldId) {
    const input = document.getElementById(fieldId);
    const icon = input?.nextElementSibling?.querySelector("i");
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    icon?.classList.toggle("fa-eye", !isPassword);
    icon?.classList.toggle("fa-eye-slash", isPassword);
}

// === PASSWORD STRENGTH METER ===
const signupPassword = document.getElementById("signup-password");
const meterInner = document.getElementById("meter-inner");
const pwdDesc = document.getElementById("pwd-desc");

signupPassword?.addEventListener("input", () => {
    const val = signupPassword.value;
    const strength = [
        val.length >= 8,
        val.length >= 12,
        /[A-Z]/.test(val),
        /[0-9]/.test(val),
        /[^A-Za-z0-9]/.test(val)
    ].filter(Boolean).length;

    const meterStyles = [
        { width: "20%", color: "red", text: "Very Weak" },
        { width: "40%", color: "orange", text: "Weak" },
        { width: "60%", color: "gold", text: "Moderate" },
        { width: "80%", color: "yellowgreen", text: "Strong" },
        { width: "100%", color: "limegreen", text: "Excellent" },
    ];

    const current = meterStyles[Math.min(strength - 1, 4)] || {};
    meterInner.style.width = current.width || "0%";
    meterInner.style.backgroundColor = current.color || "transparent";
    pwdDesc.textContent = current.text || "";
});

// === VALIDATION SETUP ===
const signupForm = document.getElementById("signup-form");
const [nameField, dobField, emailField, passwordField] = [
    "signup-name",
    "signup-dob",
    "signup-email",
    "signup-password"
].map(id => document.getElementById(id));

const [nameError, dobError, emailError, passwordError] = [
    "name-error",
    "dob-error",
    "email-error",
    "password-error"
].map(id => document.getElementById(id));

const submitBtn = signupForm?.querySelector("button[type='submit']");

const validateName = () => {
    const valid = /^[A-Za-z\s]{3,}$/.test(nameField.value.trim());
    nameError.textContent = valid ? "" : "Enter a valid name (min 3 letters)";
    return valid;
};

const validateDOB = () => {
    const dob = new Date(dobField.value);
    const valid = dobField.value && dob <= new Date();
    dobError.textContent = !dobField.value
        ? "Date of birth is required."
        : dob > new Date()
        ? "DOB cannot be in the future."
        : "";
    return valid;
};

const validateEmail = () => {
    const valid = /\S+@\S+\.\S+/.test(emailField.value);
    emailError.textContent = valid ? "" : "Enter a valid email.";
    return valid;
};

const validatePassword = () => {
    const valid = passwordField.value.length >= 8;
    passwordError.textContent = valid ? "" : "Password must be at least 8 characters.";
    return valid;
};

const validateAll = () => {
    const allValid = [validateName(), validateDOB(), validateEmail(), validatePassword()].every(Boolean);
    if (submitBtn) submitBtn.disabled = !allValid;
    return allValid;
};

signupForm?.addEventListener("input", validateAll);

// === FORM SUBMISSION ===
signupForm?.addEventListener("submit", (e) => {
    if (!validateAll()) {
        e.preventDefault();
        signupForm.classList.add("shake");
        setTimeout(() => signupForm.classList.remove("shake"), 500);
    } else {
        localStorage.setItem("savedEmail", emailField.value);
        alert("Form submitted!");
        signupForm.reset();
        meterInner.style.width = "0";
        pwdDesc.textContent = "";
        [nameError, dobError, emailError, passwordError].forEach(el => el.textContent = "");
        submitBtn.disabled = true;
    }
});

// === CAPS LOCK WARNING ===
passwordField?.addEventListener("keyup", (e) => {
    let warning = document.getElementById("caps-lock-warning");
    if (!warning) {
        warning = document.createElement("div");
        warning.id = "caps-lock-warning";
        warning.style.cssText = "color: orange; font-size: 0.8rem; margin-top: 5px;";
        passwordField.insertAdjacentElement("afterend", warning);
    }
    warning.textContent = e.getModifierState("CapsLock") ? "Caps Lock is ON" : "";
});

// === REMEMBER EMAIL ===
window.addEventListener("DOMContentLoaded", () => {
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) emailField.value = savedEmail;
});

// === FLATPICKR DATE PICKER ===
flatpickr("#signup-dob", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
    maxDate: "today",
    allowInput: true,
    theme: "dark"
});

// === SUBMIT ON ENTER ===
signupForm?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        signupForm.requestSubmit();
    }
});

// === TYPING ANIMATION ===
function typeEffect(element, speed = 50) {
    if (!element) return;
    const text = element.textContent;
    element.textContent = "";
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i++);
        } else {
            clearInterval(timer);
        }
    }, speed);
}

window.addEventListener("load", () => {
    typeEffect(document.querySelector(".overlay-left h1"), 75);
    typeEffect(document.querySelector(".overlay-right h1"), 75);
});
