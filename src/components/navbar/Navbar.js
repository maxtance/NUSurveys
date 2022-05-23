import styles from "./Navbar.module.css";
import { Link, NavLink } from "react-router-dom";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import notifIcon from "../../assets/notification.png";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <div className="container-fluid">
        <Link to="/">
          <img
            className={styles.NUSurveysLogo}
            src={NUSurveysLogo}
            alt="NUSurveys"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? styles.selectedNavItem : styles.unselectedNavItem
              }
            >
              <li className={`nav-item ${styles.navCenter}`}>
                <a className="nav-link" href="#">
                  Home
                </a>
              </li>
            </NavLink>
            <NavLink
              to="/mysurveys"
              className={({ isActive }) =>
                isActive ? styles.selectedNavItem : styles.unselectedNavItem
              }
            >
              <li className={`nav-item ${styles.navCenter}`}>
                <a className="nav-link" href="#">
                  My surveys
                </a>
              </li>
            </NavLink>
            <li className={`nav-item ${styles.navCenter}`}>
              <a className="nav-link" href="#">
                Wishlist
              </a>
            </li>
          </ul>
        </div>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <img className={styles.notifIcon} src={notifIcon} alt="notif" />
              </a>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownMenuLink"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Henry Wong
              </a>
              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="navbarDropdownMenuLink"
              >
                <li>
                  <a className="dropdown-item" href="#">
                    Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Log out
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
