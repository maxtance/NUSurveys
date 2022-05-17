import styles from "./Sidebar.module.css";

function Sidebar() {
  return (
    <>
      <div className={styles.flexboxWrapper}>
        <div className={styles.flexboxSidebar}>
          <div className={styles.filter}>
            <img width="13" height="13" src="https://loremflickr.com/15/15" />
            Filter
          </div>
          <div className={styles.filterEligible}>
            <p>Only show eligible surveys:</p>
          </div>
          <hr />
          <div className={styles.filterType}>
            <form className>
              <p>Type (dropdown)</p>
              <input type="checkbox" name="onlineSurvey" />
              <label for="onlineSurvey">Online Survey</label> <br />
              <input type="checkbox" name="researchStudyPhysical" />
              <label for="researchStudyPhysical">Research Study Physical</label>
              <br />
              <input type="checkbox" name="researchStudyRemote" />
              <label for="researchStudyRemote">Research Study Remote</label>
              <br />
            </form>
          </div>
          <hr />
          <div className={styles.filterRenumeration}>
            <form>
              <p>Renumeration (dropdown)</p>
              <input type="checkbox" name="cash" />
              <label for="cash">Cash</label> <br />
              <input type="checkbox" name="vouchers" />
              <label for="vouchers">Vouchers</label> <br />
              <input type="checkbox" name="na" />
              <label for="na">N/A</label> <br />
            </form>
          </div>
          <hr />
          <div className={styles.filterStatus}>
            <form>
              <p>Status (dropdown)</p>
              <input type="checkbox" name="ongoing" />
              <label for="ongoing">Ongoing</label> <br />
              <input type="checkbox" name="closed" />
              <label for="closed">Closed</label> <br />
            </form>
          </div>
        </div>
        <div className={styles.bodyContent}>
          <h1>RANDOM BODY</h1>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
