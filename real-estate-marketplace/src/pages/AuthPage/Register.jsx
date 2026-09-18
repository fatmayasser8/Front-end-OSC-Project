import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [userRole, setUserRole] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const isPasswordValid =
  password.length >= 8 &&
  password.length <= 12 &&
  /[A-Z]/.test(password) &&
  /[0-9]/.test(password) &&
  /[!@#$%^&*(),.?":{}|<>_\-]/.test(password) &&
  !/\s/.test(password);

const isEmailValid =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isPhoneValid =
  /^01[0125][0-9]{8}$/.test(phoneNumber);

  const isConfirmPasswordValid =
  confirmPassword.length > 0 &&
  confirmPassword === password;


  const navigate = useNavigate();

const validate = () => {
  const newErrors = {};

  // Full Name
  if (!name.trim()) {
    newErrors.name = "Full name is required";
  }

  // Email
  if (!email.trim()) {
    newErrors.email = "Email is required";
  } else if (!isEmailValid) {
    newErrors.email = "Please enter a valid email address";
  }

  // Password
  if (!password) {
    newErrors.password = "Password is required";
  } else if (!isPasswordValid) {
    newErrors.password =
      "Please enter a valid password according to the requirements above";
  }

  // Confirm Password
  if (!confirmPassword) {
    newErrors.confirmPassword = "Please confirm your password";
  } else if (!isConfirmPasswordValid) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  // Phone
  if (!phoneNumber) {
    newErrors.phoneNumber = "Phone number is required";
  } else if (!isPhoneValid) {
    newErrors.phoneNumber =
      "Please enter a valid Egyptian phone number";
  }

  // Role
  if (!userRole) {
    newErrors.userRole = "Please select Seller or Buyer";
  }

  // Terms
  if (!termsAccepted) {
    newErrors.termsAccepted =
      "You must accept the terms and conditions";
  }

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};

  const handleRegister = async (e) => {
    e.preventDefault();

    
    if (!validate()) {
      return;
    }

    const userData = {
      fullName: name,
      email: email,
      password: password,
      phoneNumber: phoneNumber,
      userRole: userRole,
    };
setIsLoading(true);

try {
  const response = await fetch(
    "https://real-estate-market-place-api.vercel.app/api/v1/users/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: name,
        email: email,
        password: password,
        phoneNumber: phoneNumber,
        userRole: userRole,
      }),
    }
  );

  const data = await response.json();

  if (response.status === 201) {
    navigate("/validation", {
      state: {
        email: email,
      },
    });
  } else if (response.status === 400) {
    setIsLoading(false);

    setErrors({
      email: data.message || "Email already exists",
    });
  } else if (response.status === 409) {
    setIsLoading(false);

    setErrors({
      phoneNumber: data.message || "Phone number already exists",
    });
  } else {
    setIsLoading(false);
  }
} catch (error) {
  console.error("Registration error:", error);
  setIsLoading(false);
}
  };

  return (
<form
  onSubmit={handleRegister}
   className="auth-form max-sm:gap-[9px]"
>

      {/* Full Name */}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
      className=" max-sm:!py-2.5 max-sm:!px-3 max-sm:!text-[13px]"
        onChange={(e) => {
          setName(e.target.value);
          setErrors({ ...errors, name: "" });
        }}
      />

      {errors.name && (
        <p className="input-error">{errors.name}</p>
      )}


      {/* Email */}
<input
  type="email"
  placeholder="Email"
  value={email}
  className={`max-sm:!py-2.5 max-sm:!px-3 max-sm:!text-[13px] ${
    email.length === 0
      ? ""
      : isEmailValid
      ? "input-valid"
      : "input-invalid"
  }`}
  onChange={(e) => setEmail(e.target.value)}
/>

{errors.email && email.length === 0 && (
  <p className="input-error max-sm:text-xs">{errors.email}</p>
)}

{email.length > 0 && !isEmailValid && (
  <p className="input-warning max-sm:text-xs">
    Please enter a valid email address.
  </p>
)}


      {/* Password */}
<div className="password-container">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="Password"
    value={password}
    className={`max-sm:!py-2.5 max-sm:!px-3 max-sm:!text-[13px] max-sm:!pr-10 ${
      password.length === 0
        ? ""
        : isPasswordValid
        ? "input-valid"
        : "input-invalid"
    }`}
    onChange={(e) => setPassword(e.target.value)}
  />

  <i
    className={`fa-solid ${
      showPassword ? "fa-eye" : "fa-eye-slash"
    } eye-icon`}
    onClick={() => setShowPassword(!showPassword)}
  ></i>
</div>

{password.length > 0 && !isPasswordValid && (
  <p className="password-warning">
    Password must be 8–12 characters, contain at least one
    uppercase letter, one number, one special character, and
    no spaces.
  </p>
)}

{errors.password && password.length === 0 && (
  <p className="input-error">{errors.password}</p>
)}


      {/* Confirm Password */}
<div className="password-container">
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Confirm Password"
    value={confirmPassword}
    className={`max-sm:!py-2.5 max-sm:!px-3 max-sm:!text-[13px] max-sm:!pr-10${
      confirmPassword.length === 0
        ? ""
        : isConfirmPasswordValid
        ? "input-valid"
        : "input-invalid"
    }`}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />

  <i
    className={`fa-solid ${
      showConfirmPassword ? "fa-eye" : "fa-eye-slash"
    } eye-icon`}
    onClick={() =>
      setShowConfirmPassword(!showConfirmPassword)
    }
  ></i>
</div>

{confirmPassword.length > 0 && !isConfirmPasswordValid && (
  <p className="input-warning">
    Passwords do not match.
  </p>
)}

{errors.confirmPassword && confirmPassword.length === 0 && (
  <p className="input-error">
    {errors.confirmPassword}
  </p>
)}


      {/* Phone */}
<input
  type="tel"
  placeholder="Phone Number"
  value={phoneNumber}
  maxLength={11}
  className={`max-sm:!py-2.5 max-sm:!px-3 max-sm:!text-[13px] ${
    phoneNumber.length === 0
      ? ""
      : isPhoneValid
      ? "input-valid"
      : "input-invalid"
  }`}
  onChange={(e) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
  }}
/>

{errors.phoneNumber && phoneNumber.length === 0 && (
  <p className="input-error">
    {errors.phoneNumber}
  </p>
)}

{phoneNumber.length > 0 && !isPhoneValid && (
  <p className="input-warning">
    Please enter a valid Egyptian phone number (11 digits).
  </p>
)}


      {/* Role */}
<div className="role-options max-sm:gap-4">
<label
  htmlFor="seller"
  className="max-sm:text-[13px]"
>
          <input
            type="radio"
            id="seller"
            name="role"
            value="seller"
            checked={userRole === "seller"}
            onChange={(e) => {
              setUserRole(e.target.value);
              setErrors({ ...errors, userRole: "" });
            }}
          />
          Seller
        </label>

        <label htmlFor="buyer"   className="max-sm:text-[13px]">
          <input
            type="radio"
            id="buyer"
            name="role"
            value="buyer"
            checked={userRole === "buyer"}
            onChange={(e) => {
              setUserRole(e.target.value);
              setErrors({ ...errors, userRole: "" });
            }}
          />
          Buyer
        </label>
      </div>

      {errors.userRole && (
        <p className="input-error">{errors.userRole}</p>
      )}


      {/* Terms */}
      <div className="terms">
        <label htmlFor="register-checkbox"
          className="max-sm:gap-1.5 max-sm:text-[12px]"
        >
          <input
            type="checkbox"
            id="register-checkbox"
            checked={termsAccepted}
            onChange={(e) => {
              setTermsAccepted(e.target.checked);
              setErrors({ ...errors, termsAccepted: "" });
            }}
          />

          I agree to the terms and conditions
        </label>
      </div>

      {errors.termsAccepted && (
        <p className="input-error max-sm:text-xs">
          {errors.termsAccepted}
        </p>
      )}


      {/* General Error */}
      {errors.general && (
        <p className="input-error general-error max-sm:text-xs">
          {errors.general}
        </p>
      )}


<button
  type="submit"
  className="auth-button max-sm:mt-0 max-sm:py-2.5 max-sm:text-[14px]"
  disabled={isLoading}
>
  {isLoading ? (
    <>
      <span className="spinner"></span>
      Loading...
    </>
  ) : (
    "Create Account"
  )}
</button>

    </form>
  );
}

export default Register;