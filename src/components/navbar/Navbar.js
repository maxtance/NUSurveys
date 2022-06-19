import styles from "./Navbar.module.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import avatar from "../../assets/avatar.png";
import { useAuth } from "../../contexts/Auth";
import { supabaseClient } from "../../lib/client";
import { useEffect, useState } from "react";

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");

  const handleSignOut = async () => {
    // Ends user session
    const { data, error } = await signOut();

    if (error) {
      console.log(error);
    } else {
      console.log(data);
      navigate("/login");
    }
  };

  const getUserName = async () => {
    const { data, error } = await supabaseClient
      .from("users")
      .select("full_name")
      .eq("email", user.email);

    if (error) {
      console.log(error);
    } else {
      // console.log(data[0]);
      setUserName(data[0]["full_name"]);
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-white">
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
              to="/home"
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
                  My Surveys
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
              <span className="nav-link">
                <img className={styles.avatar} src={avatar} alt="" />
              </span>
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
                {userName}
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
                  <a className="dropdown-item" onClick={handleSignOut} href="#">
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
