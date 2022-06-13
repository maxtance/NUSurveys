import styles from "./ThankYou.module.css";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link } from "react-router-dom";

function ThankYou() {
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
                <h2 className={styles.title}>Thank you!</h2>
                <p className={styles.message}>Before you can start using NUSurveys, please confirm your email address by clicking on the link in the email we sent you. </p>
                <Link to="/login">
                    <button class={styles.button}>
                        Back to Login
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default ThankYou;