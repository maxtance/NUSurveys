import styles from "./HomePage.module.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import HomeBody from "../Body/HomeBody";

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
        <HomeBody />
      </div>
      <div className={styles.footer}></div>
    </div>
  );
}

export default HomePage;
