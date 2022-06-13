import styles from "./Welcome.module.css";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link } from "react-router-dom";

function Welcome() {
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
            <div className={styles.mainBody}>
                <h2 className={styles.title}>Welcome to NUSurveys!</h2>
                <p className={styles.message}>Your email address has been confirmed. You may now log in to NUSurveys.</p>
                <Link to="/login">
                    <button class={styles.button}>
                        Login
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default Welcome;