import NavBarWrapper from "../../helpers/NavBarWrapper";
import styles from "./Sidebar.module.css";
import filterIcon from "../../assets/filter_img.png";
import { useState } from "react";

function Sidebar({
  type,
  handleTypeChange,
  remuneration,
  handleRemunerationChange,
  status,
  handleStatusChange,
  filterCriteria,
  setFilterCriteria,
  eligibility,
  handleEligibilityChange,
  clearFilter
}) {
  // get setSurveys from HomeBody.js to set the changes when filter button is clicked
  // need to lift things up to HomePage since HomePage is the parent of Sidebar and HomeBody
  const temp = {
    survey_categories: [],
    remuneration_categories: [],
    status: [],
    eligibility: false,
  };

  const addCriterion = (criteria, criterion) => {
    temp[criteria] = [...temp[criteria], criterion];
  };

  const addCriteria = (criteria, criteriaString) => {
    for (var key in criteria) {
      if (criteria[key]) {
        addCriterion(criteriaString, key);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCriteria(type, "survey_categories");
    addCriteria(remuneration, "remuneration_categories");
    addCriteria(status, "status");
    temp["eligibility"] = eligibility;
    setFilterCriteria({ ...filterCriteria, ...temp });
  };

  const filterPressed = () => {
    return (
      eligibility ||
      criteriaChecked(type) ||
      criteriaChecked(remuneration) ||
      criteriaChecked(status)
    );
  };

  const criteriaChecked = (cat) => {
    for (let key in cat) {
      if (cat[key]) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.filterIcon} src={filterIcon} alt="" />
        Filter
      </div>
      <form className={styles.filter} onSubmit={handleSubmit}>
        <div className={styles.filterEligibility}>
          <label for="eligibleSurveys">Only show eligible surveys: </label>
          <input
            type="checkbox"
            className={styles.eligibilityCheckbox}
            value={eligibility}
            checked={eligibility}
            onChange={handleEligibilityChange}
          />
        </div>
        <div className={styles.filterType}>
          <h6>Type</h6>
          <input
            type="checkbox"
            name="1"
            className={styles.checkbox}
            value={type[1]}
            checked={type[1]}
            onChange={handleTypeChange}
          />
          <label for="onlineSurvey">Online Survey</label> <br />
          <input
            type="checkbox"
            name="2"
            className={styles.checkbox}
            value={type[2]}
            checked={type[2]}
            onChange={handleTypeChange}
          />
          <label for="researchPhysical">Research Study (Remote)</label> <br />
          <input
            type="checkbox"
            name="3"
            className={styles.checkbox}
            value={type[3]}
            checked={type[3]}
            onChange={handleTypeChange}
          />
          <label for="researchRemote">Research Study (On-site)</label> <br />
        </div>
        <div className={styles.filterRemuneration}>
          <h6>Remuneration</h6>
          <input
            type="checkbox"
            name="1"
            className={styles.checkbox}
            value={remuneration[1]}
            checked={remuneration[1]}
            onChange={handleRemunerationChange}
          />
          <label for="cash">Cash</label> <br />
          <input
            type="checkbox"
            name="2"
            className={styles.checkbox}
            value={remuneration[2]}
            checked={remuneration[2]}
            onChange={handleRemunerationChange}
          />
          <label for="vouchers">Vouchers</label> <br />
          <input
            type="checkbox"
            name="3"
            className={styles.checkbox}
            value={remuneration[3]}
            checked={remuneration[3]}
            onChange={handleRemunerationChange}
          />
          <label for="na">N/A</label> <br />
        </div>
        <div className={styles.filterStatus}>
          <h6>Status</h6>
          <input
            type="checkbox"
            name="ongoing"
            className={styles.checkbox}
            value={status.ongoing}
            checked={status.ongoing}
            onChange={handleStatusChange}
          />
          <label for="ongoing">Ongoing</label> <br />
          <input
            type="checkbox"
            name="closed"
            className={styles.checkbox}
            value={status.closed}
            checked={status.closed}
            onChange={handleStatusChange}
          />
          <label for="closed">Closed</label> <br />
        </div>
        <button type="submit" className={styles.filterBtn}>
          Filter
        </button>
        <button
          className={styles.cancelBtn}
          disabled={!filterPressed()}
          onClick={clearFilter}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default Sidebar;
