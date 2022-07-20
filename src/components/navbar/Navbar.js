import styles from "./Navbar.module.css";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import NUSurveysLogo from "../../assets/NUSurveysLogo.png";
import avatar from "../../assets/avatar.png";
import { useAuth } from "../../contexts/Auth";
import { useState, useEffect } from "react";
import { supabaseClient } from "../../lib/client";

function Navbar() {
  const { userInfo, signOut } = useAuth();
  const userName = userInfo.full_name;
  const [avatarURL, setAvatarURL] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    function GetAvatarURL(navigate) {
      const { publicURL, error } = supabaseClient.storage
        .from("avatar-images")
        .getPublicUrl(userInfo.avatar);

      if (error) {
        navigate("/error");
      }
      setAvatarURL(publicURL);
    }
    if (userInfo.avatar) {
      GetAvatarURL(navigate);
    } else {
      setAvatarURL("");
    }
  }, [userInfo.avatar]);

  const location = useLocation();
  const locationArray = location.pathname.split("/");
  const currPath = locationArray[locationArray.length - 1];

  const handleSignOut = async () => {
    // Ends user session
    const { data, error } = await signOut();

    if (error) {
      navigate("/error");
    } else {
      //console.log(data);
      navigate("/login");
    }
  };

  return (
    <nav
      data-testid="navbar"
      className="navbar navbar-expand-md navbar-light bg-white"
    >
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
                <a className="nav-link" href="/">
                  Home
                </a>
              </li>
            </NavLink>
            {/* <NavLink
              to="/mysurveys/published-surveys"
              className={({ isActive }) =>
                isActive ? styles.selectedNavItem : styles.unselectedNavItem
              }
            >
              <li className={`nav-item ${styles.navCenter}`}>
                <a className="nav-link" href="/mysurveys">
                  My Surveys
                </a>
              </li>
            </NavLink> */}

            <li className={`nav-item ${styles.navCenter}`}>
              <div className={styles.mySurveysDropdown}>
                <span
                  className={
                    currPath === "published-surveys" ||
                    currPath === "completed-surveys"
                      ? styles.selectedNavItem
                      : styles.unselectedNavItem
                  }
                >
                  <span className="nav-link">My Surveys</span>
                </span>
                <div className={styles.dropdownContent}>
                  <NavLink to="/mysurveys/published-surveys">
                    Published surveys
                  </NavLink>
                  <NavLink to="/mysurveys/completed-surveys">
                    Completed surveys
                  </NavLink>
                </div>
              </div>
            </li>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                isActive ? styles.selectedNavItem : styles.unselectedNavItem
              }
            >
              <li className={`nav-item ${styles.navCenter}`}>
                <a className="nav-link" href="/wishlist">
                  Wishlist
                </a>
              </li>
            </NavLink>
          </ul>
        </div>

        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <span className="nav-link">
                {avatarURL ? (
                  <img data-testid="avatar" className={styles.userAvatar} src={avatarURL} alt="" />
                ) : (
                  <img data-testid="placeholder" className={styles.avatar} src={avatar} alt="" />
                )}
              </span>
            </li>
            <li className="nav-item dropdown">
              <a
                data-testid="username"
                className="nav-link dropdown-toggle mt-2"
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
                <Link to="/profile" className={styles.profileLink}>
                  <li>
                    <a className="dropdown-item" href="#">
                      Profile
                    </a>
                  </li>
                </Link>

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
