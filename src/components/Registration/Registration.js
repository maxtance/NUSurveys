import styles from "./Registration.module.css";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/Auth.js";
import { supabaseClient } from "../../lib/client";
import { getDate } from "../createSurvey/CreateSurvey"

function Registration() {
    const validEmail = (email) => email.endsWith("@u.nus.edu") || email.endsWith("nus.edu.sg") ? true : "Not a valid NUS email. Please try again";
    const checkDuplicateEmail = async (email) => {
        const { data, error } = await supabaseClient
                .from("users")
                .select()
                .eq("email", email);
        return data.length === 0 ? true : "An account with this email already exists. Please try logging in instead"
    }

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        dob: "",
        ethnicity: "",
        email: "",
        password: ""
    })

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();

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

    const emailRef = useRef();
    const passwordRef = useRef();

    emailRef.current = watch("email");
    passwordRef.current = watch("password");
    const samePassword = (password) => password === passwordRef.current ? true : "Passwords do not match. Please check and try again";

    const { signUp } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const renderErrorMsg = (component) => {
        return (
          <div class={styles.validation}>
            {warningIcon}
            <p class={styles.errorMsg}>{errors[component].message}</p>
          </div>
        );
    };

    const onFormSubmit = async (e) => {
        //sign-up logic
        const email = emailRef.current;
        const password = passwordRef.current;

        const { data: userObj, error } = await signUp(
            { email, password }
        );

        if (error) {
            console.log(error);
        } else {
            const { data, error } = await supabaseClient
                .from("users")
                .insert({
                    full_name: user.firstName + " " + user.lastName,
                    email: email,
                    gender: user.gender,
                    ethnicity_id: user.ethnicity,
                    date_of_birth: user.dob,
                    created_at: getDate(0)
                 });

            if (error) {
                console.log(error);
            } else {
                // Redirect user to Thank You page
                console.log(data);
                navigate('/thank-you')
            }
          }
    }

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
            <div className='row justify-content-center'>
            <div className='col col-md-7' id={styles.formwrapper}>
                <h2 className={styles.formTitle}>Registration</h2>
                    <form className='form-horizontal registrationForm' 
                    onSubmit={handleSubmit(onFormSubmit)}
                    >
                        <div class="row">
                            <div class="col-md-5">
                                <div className='form-group'>
                                    <label for="firstName" className={styles.fieldName}>First Name</label>
                                        <input 
                                        class={`form-control ${styles.field}`}
                                        name='firstName'
                                        {...register("firstName", {
                                            required: "Please enter your first name (given name)",
                                        })}
                                        value={user.firstName}
                                        onChange={(e) => {
                                            register("firstName").onChange(e);
                                            handleInputChange(e);
                                        }}
                                        />
                                    {errors?.firstName ? renderErrorMsg("firstName") : null}
                                </div>
                            </div>
                            <div class="col-md-5 offset-md-1">
                                <div className='form-group'>
                                    <label for="lastName" className={styles.fieldName}>Last Name</label>
                                        <input 
                                        className={`form-control ${styles.field}`}
                                        name='lastName'
                                        {...register("lastName", {
                                            required: "Please enter your last name (surname)",
                                        })}
                                        value={user.lastName}
                                        onChange={(e) => {
                                            register("lastName").onChange(e);
                                            handleInputChange(e);
                                        }}
                                        />
                                    {errors?.lastName ? renderErrorMsg("lastName") : null}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <div className='form-group'>
                                    <label for="gender" className={styles.fieldName}>Gender</label>
                                    <select 
                                    class={`form-select ${styles.field}`} 
                                    name="gender"
                                    value={user.gender}
                                    {...register("gender", {
                                        required: "Please select your gender",
                                    })}
                                    onChange={(e) => {
                                        register("gender").onChange(e);
                                        handleInputChange(e);
                                    }}>
                                        <option selected value="">-</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                    {errors?.gender ? renderErrorMsg("gender") : null}
                                </div>
                            </div>
                            <div class="col-md-5 offset-md-1">
                                <div className='form-group'>
                                    <label for="dob" className={styles.fieldName}>Date of Birth</label>
                                    <br></br>
                                    <input
                                        className={`form-control ${styles.field}`}
                                        type="date"
                                        name="dob"
                                        value={user.dob}
                                        {...register("dob", {
                                            required: "Please select your date of birth",
                                        })}
                                        onChange={(e) => {
                                            register("dob").onChange(e);
                                            handleInputChange(e);
                                        }}
                                        max={new Date().toISOString().split("T")[0]}
                                        id={styles.closingDate}
                                    />
                                    {errors?.dob ? renderErrorMsg("dob") : null}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <div className='form-group'>
                                    <label for="ethnicity" className={styles.fieldName}>Ethnicity</label>
                                    <select 
                                        name="ethnicity" 
                                        class={`form-select ${styles.field}`}
                                        value={user.ethnicity}
                                        {...register("ethnicity", {
                                            required: "Please select your ethnicity",
                                        })}
                                        onChange={(e) => {
                                            register("ethnicity").onChange(e);
                                            handleInputChange(e);
                                        }}>
                                        <option selected value="">-</option>
                                        <option value="1">Chinese</option>
                                        <option value="2">Malay</option>
                                        <option value="3">Indian</option>
                                        <option value="4">Others</option>
                                    </select>
                                    {errors?.ethnicity ? renderErrorMsg("ethnicity") : null}
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div className='form-group col-md-8'>
                                <label for="email" className={`${styles.fieldName} ${styles.email}`}>Email</label>
                                <br></br>
                                <small>This should be your NUS email ending with @u.nus.edu or @nus.edu.sg</small>
                                <input 
                                className={`form-control ${styles.field}`}
                                type='email'
                                name='email'
                                {...register("email", {
                                    required: "Please enter a valid NUS email",
                                    validate: {
                                        //validateEmail: validEmail,
                                        checkDuplicate: checkDuplicateEmail
                                    }}
                                )}
                                onChange={(e) => {
                                    register("email").onChange(e);
                                }}
                                />
                                {errors?.email ? renderErrorMsg("email") : null}
                            </div>
                        </div>
                        <div class="row">
                            <div className='form-group col-md-8'>
                                <label for="password" className={styles.fieldName}>Password</label>
                                <input 
                                className={`form-control ${styles.field}`}
                                type='password'
                                name='password'
                                {...register("password", {
                                    required: "Please enter a password no less than 6 characters",
                                })}
                                onChange={(e) => {
                                    register("password").onChange(e);
                                }}
                                /> 
                                {errors?.password ? renderErrorMsg("password") : null}
                            </div>
                        </div>
                        <div class="row">
                            <div className='form-group col-md-8'>
                            <label for="password2" className={styles.fieldName}>Confirm Password</label>
                                <input 
                                className={`form-control ${styles.field}`}
                                type='password'
                                name='password2'
                                {...register("password2", {
                                    required: "Please enter your password again",
                                    validate: samePassword
                                })}
                                onChange={(e) => {
                                    register("password2").onChange(e);
                                }}
                                />
                                {errors?.password2 ? renderErrorMsg("password2") : null} 
                            </div>
                        </div>
                        <button type='submit' className='btn btn-block' id={styles.register}>Sign up</button>
                    </form> 
            </div>
            </div>
        </div>
    )
}

export default Registration;