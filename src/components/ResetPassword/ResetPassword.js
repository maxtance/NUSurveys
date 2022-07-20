import styles from "./ResetPassword.module.css";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/Auth.js";
import { useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { supabaseClient } from "../../lib/client";

function ResetPassword() {
  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const { state } = useLocation();
  const navigate = useNavigate();

  if (state === null) {
    navigate("/error");
  }

  const { signOut } = useAuth();

  const warningIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      fill="currentColor"
      class="bi bi-exclamation-triangle-fill"
      id={styles.warningIcon}
      viewBox="0 0 16 16"
    >
      <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
    </svg>
  );

  const renderErrorMsg = (component) => {
    return (
      <div class={styles.validation}>
        {warningIcon}
        <p class={styles.errorMsg}>{errors[component].message}</p>
      </div>
    );
  };

  const passwordRef = useRef();
  passwordRef.current = watch("password");

  const onFormSubmit = async (e) => {
    if (state.type === "recovery" && state.access_token) {
      const { error, data } = await supabaseClient.auth.api.updateUser(
        state.access_token,
        { password: passwordRef.current }
      );

      if (error) {
        navigate("/error", {
          title: "Oops!",
          message: "There was an error updating your password. Please try again."
        });
      } else if (data) {
        navigate("/success", {
          state: {
            title: "Password Changed",
            message: "Your password has been updated successfully.",
          },
        });
      }
    }
  };

  const logUserOut = async () => {
    await signOut();
  };

  useEffect(() => {
    logUserOut();
    //console.log(state);
  }, []);

  const samePassword = (password) =>
    password === passwordRef.current
      ? true
      : "Passwords do not match. Please check and try again";

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
          <h2 className={styles.formTitle}>Reset password</h2>
          <form className="resetPwdForm" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="form-group">
              <label for="password" className={styles.fieldName}>
                Password
              </label>
              <input
                className={`form-control ${styles.field}`}
                type="password"
                name="password"
                {...register("password", {
                  minLength: {
                    value: 6,
                    message:
                      "Password is too short. Please choose a password that is no less than 6 characters",
                  },
                  required: "Please enter a password no less than 6 characters",
                })}
                onChange={(e) => {
                  register("password").onChange(e);
                }}
              />
              {errors?.password ? renderErrorMsg("password") : null}
            </div>
            <div className="form-group">
              <label for="password2" className={styles.fieldName}>
                Confirm Password
              </label>
              <input
                className={`form-control ${styles.field}`}
                type="password"
                name="password2"
                {...register("password2", {
                  required: "Please enter your password again",
                  validate: samePassword,
                })}
                onChange={(e) => {
                  register("password2").onChange(e);
                }}
              />
              {errors?.password2 ? renderErrorMsg("password2") : null}
            </div>
            <button
              type="submit"
              className="submitBtn btn btn-block"
              id={styles.submit}
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
