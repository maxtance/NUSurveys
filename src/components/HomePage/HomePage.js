import styles from "./HomePage.module.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Body from "../Body/Body";

function HomePage() {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        <Body page="Home" />
      </div>
      <div className={styles.footer}></div>
    </div>
  );
}

export default HomePage;
