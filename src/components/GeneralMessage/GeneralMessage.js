import styles from "./GeneralMessage.module.css";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";

function GeneralMessage() {
  let { state } = useLocation();

  if (state === null) {
    state = {
      title: "Oops!",
      message: "An unknown error occurred. Please try again.",
    };
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
      <div className={styles.mainBody}>
        <h2 className={styles.title}>{state.title}</h2>
        <p className={styles.message}>{state.message}</p>
        <Link to="/home">
          <button class={styles.button}>Back</button>
        </Link>
      </div>
    </div>
  );
}

export default GeneralMessage;
