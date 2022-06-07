import styles from "./Login.module.css"
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link } from "react-router-dom";

function LoginPage() {
    return(
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
                <h2 className={styles.formTitle}>Login</h2>
                    <form className='loginForm' 
                    //onSubmit={handleSubmit}
                    >
                        <label className={styles.email}>Email</label>
                        <br></br>
                        <small>This should be your NUS email ending with @u.nus.edu or @nus.edu.sg</small>
                        <div className='form-group'>
                            <input className='form-control'
                            type='email'
                            name='username'
                            value=""
                            //onChange={handleChange}
                            //onBlur={handleBlur}
                            />
                        </div>
                        <label className={styles.password}>Password</label>
                        <div className='form-group'>
                            <input className='form-control'
                            type='password'
                            name='password'
                            value=""
                            //onChange={handleChange}
                            //onBlur={handleBlur}
                            /> 
                        </div>
                        <Link to="/" className={styles.resetpwd}>
                            <p>Forgot password?</p>
                        </Link>
                        <br></br>
                        <div>
                            <small className={styles.signupBanner}>New to NUSurveys? <Link to="/" className={styles.signup}>Sign up here</Link></small>
                        </div>
                        <button type='submit' className='loginBtn btn btn-block' id={styles.login}>Login</button>
                    </form> 
            </div>
        </div>
    </div>)
}

export default LoginPage