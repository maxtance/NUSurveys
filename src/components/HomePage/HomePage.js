import styles from "./HomePage.module.css";
import Navbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Body from "../Body/Body";
import { useEffect, useState } from "react";

function HomePage() {
  const [filterCriteria, setFilterCriteria] = useState({
    survey_categories: [],
    remuneration_categories: [],
    status: [],
    eligibility: false,
  });

  const [type, setType] = useState({
    1: false,
    2: false,
    3: false,
  });

  const [remuneration, setRemuneration] = useState({
    1: false,
    2: false,
    3: false,
  });

  const [eligibility, setEligibility] = useState(false);

  const [status, setStatus] = useState({
    ongoing: false,
    closed: false,
  });

  const handleTypeChange = (e) => {
    const { name, checked } = e.target;
    setType({ ...type, [name]: checked });
  };

  const handleRemunerationChange = (e) => {
    const { name, checked } = e.target;
    setRemuneration({ ...remuneration, [name]: checked });
  };

  const handleStatusChange = (e) => {
    const { name, checked } = e.target;
    setStatus({ ...status, [name]: checked });
  };

  const handleEligibilityChange = (e) => {
    const { checked } = e.target;
    setEligibility(checked);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <Navbar />
      </div>
      <div className={styles.sidebar}>
        <Sidebar
          type={type}
          handleTypeChange={handleTypeChange}
          remuneration={remuneration}
          handleRemunerationChange={handleRemunerationChange}
          status={status}
          handleStatusChange={handleStatusChange}
          filterCriteria={filterCriteria}
          setFilterCriteria={setFilterCriteria}
          eligibility={eligibility}
          handleEligibilityChange={handleEligibilityChange}
        />
      </div>
      <div className={styles.mainContent}>
        <Body
          page="Home"
          filterCriteria={filterCriteria}
          eligibility={eligibility}
        />
      </div>
      <div className={styles.footer}></div>
    </div>
  );
}

export default HomePage;
