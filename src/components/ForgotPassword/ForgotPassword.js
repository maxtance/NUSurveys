import styles from "./ForgotPassword.module.css";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth.js";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { supabaseClient } from "../../lib/client";

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const checkmarkIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-check-circle"
      viewBox="0 0 16 16"
      id={styles.checkmarkIcon}
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
    </svg>
  );

  const xmarkIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      class="bi bi-x-circle"
      viewBox="0 0 16 16"
      id={styles.xmarkIcon}
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
    </svg>
  );

  const { user } = useAuth();
  const [emailSent, setEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const navigate = useNavigate();

  const emailRef = useRef();
  emailRef.current = watch("email");

  const onFormSubmit = async () => {
    setIsLoading(true);
    const email = emailRef.current;

    console.log(email);
    const { data, error } = await supabaseClient.auth.api.resetPasswordForEmail(
      email, 
    );

    if (error) {
      console.log(error);
      if (error.message === "User not found") {
        setErrorMsg(
          "This email is not registered with NUSurveys. Please try again."
        );
        setEmailSent(true);
        setIsLoading(false);
      }
    } else {
      console.log(data);
      setEmailSent(true);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/home");
    }
  }, [user]);

  return (
    <div className={styles.container}>
      <nav className="navbar navbar-expand-md navbar-light bg-white">
        <div className="container-fluid">
          <Link to="/">
            <img
              className={styles.NUSurveysLogo}
              src={NUSurveysLogo}
              alt="NUSurveys"
            />
          </Link>
        </div>
      </nav>
      <div className="row justify-content-center">
        <div className="col col-md-7" id={styles.formwrapper}>
          { !emailSent ? (
            <div></div>
          ) : errorMsg !== null ? (
            <div id={styles.errorMsg}>{xmarkIcon}{errorMsg}</div>
          ) : (
            <div id={styles.confirmationMsg}>
              {checkmarkIcon}
              We've sent an email to {emailRef.current}. Click the link in the
              email to reset your password.
            </div>
          )}
          <h2 className={styles.formTitle}>Forgot password?</h2>
          <p className={styles.formDesc}>
            That’s ok! Enter your email and we will send you a link to reset
            your password.
          </p>
          <form className="loginForm" onSubmit={handleSubmit(onFormSubmit)}>
            <label className={styles.email}>Email</label>
            <br></br>
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                name="email"
                {...register("email", {
                  required: "Please enter a valid email",
                })}
                onChange={(e) => {
                  setEmailSent(false);
                  register("email").onChange(e);
                }}
              />
            </div>
            <button
              type="submit"
              className="submitBtn btn btn-block"
              id={styles.submit}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
