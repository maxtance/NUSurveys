import styles from "./Login.module.css";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/Auth.js";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm();

  const emailRef = useRef();
  const passwordRef = useRef();

  emailRef.current = watch("email");
  passwordRef.current = watch("password");

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

  const onFormSubmit = async (e) => {
    //sign-in logic
    const email = emailRef.current;
    const password = passwordRef.current;

    const { data, error } = await signIn({ email, password });

    if (error) {
      console.log(error);
      if (error.message === "Email not confirmed") {
        setError("password", {
          type: "custom",
          message:
            error.message +
            ". Please try again after clicking on the confirmation link that was sent to your email",
        });
      }
      if (error.message === "Invalid login credentials") {
        setError("password", {
          type: "custom",
          message: error.message + ". Please try again",
        });
      }
    } else {
      // Redirect user to Dashboard
      navigate("/home");
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
          <h2 className={styles.formTitle}>Login</h2>
          <form className="loginForm" onSubmit={handleSubmit(onFormSubmit)}>
            <label className={styles.email}>Email</label>
            <br></br>
            <small>
              This should be your NUS email ending with @u.nus.edu or
              @nus.edu.sg
            </small>
            <div className="form-group">
              <input
                className="form-control"
                type="email"
                name="email"
                {...register("email", {
                  required: "Please enter a valid NUS email",
                })}
                onChange={(e) => {
                  register("email").onChange(e);
                }}
              />
              {errors?.email ? renderErrorMsg("email") : null}
            </div>
            <label className={styles.password}>Password</label>
            <div className="form-group">
              <input
                className="form-control"
                type="password"
                name="password"
                {...register("password", {
                  required: "Please enter your password",
                })}
                onChange={(e) => {
                  register("password").onChange(e);
                }}
              />
              {errors?.password ? renderErrorMsg("password") : null}
            </div>
            {/* <Link to="/" className={styles.resetpwd}>
              <p>Forgot password?</p>
            </Link> */}
            <br></br>
            <div>
              <small className={styles.signupBanner}>
                New to NUSurveys?{" "}
                <Link to="/register" className={styles.signup}>
                  Sign up here
                </Link>
              </small>
            </div>
            <button
              type="submit"
              className="loginBtn btn btn-block"
              id={styles.login}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
