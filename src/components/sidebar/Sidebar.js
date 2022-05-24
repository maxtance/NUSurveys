import NavBarWrapper from "../../helpers/NavBarWrapper";
import styles from "./Sidebar.module.css";
import { useState } from "react";
import filterIcon from "../../assets/filter_img.png";

function Sidebar() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.filterIcon} src={filterIcon} alt="" />
        Filter
      </div>
      <form className={styles.filter}>
        <div className={styles.filterEligibility}>
          <label for="eligibleSurveys">Only show eligible surveys: </label>
          <input type="checkbox" className={styles.eligibilityCheckbox}></input>
        </div>
        <div className={styles.filterType}>
          <h6>Type</h6>
          <input
            type="checkbox"
            id="onlineSurvey"
            className={styles.checkbox}
          />
          <label for="onlineSurvey">Online Survey</label> <br />
          <input
            type="checkbox"
            id="researchPhysical"
            className={styles.checkbox}
          />
          <label for="researchPhysical">Research Study Physical</label> <br />
          <input
            type="checkbox"
            id="researchRemote"
            className={styles.checkbox}
          />
          <label for="researchRemote">Research Study Remote</label> <br />
        </div>
        <div className={styles.filterRenumeration}>
          <h6>Renumeration</h6>
          <input type="checkbox" id="cash" className={styles.checkbox} />
          <label for="cash">Cash</label> <br />
          <input type="checkbox" id="vouchers" className={styles.checkbox} />
          <label for="vouchers">Vouchers</label> <br />
          <input type="checkbox" id="na" className={styles.checkbox} />
          <label for="na">N/A</label> <br />
        </div>
        <div className={styles.filterStatus}>
          <h6>Status</h6>
          <input type="checkbox" id="ongoing" className={styles.checkbox} />
          <label for="ongoing">Ongoing</label> <br />
          <input type="checkbox" id="closed" className={styles.checkbox} />
          <label for="closed">Closed</label> <br />
        </div>
        <button type="btn" className={styles.filterBtn}>
          Filter
        </button>
      </form>
    </div>
  );
}

export default Sidebar;
