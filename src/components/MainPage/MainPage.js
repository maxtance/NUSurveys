import styles from "./MainPage.module.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Body from "../Body/Body";

function MainPage() {
  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.mainContent}>
        <Body />
      </div>
      <div className={styles.footer}>footer</div>
    </div>
  );
}

export default MainPage;
