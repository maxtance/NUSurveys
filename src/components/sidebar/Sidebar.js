import NavBarWrapper from "../../helpers/NavBarWrapper";
import styles from "./Sidebar.module.css";
import { useForm } from "react-hook-form";
import filterIcon from "../../assets/filter_img.png";

function Sidebar() {
  // get setSurveys from HomeBody.js to set the changes when filter button is clicked
  // need to lift things up to HomePage since HomePage is the parent of Sidebar and HomeBody
  const { register, handleSubmit } = useForm();
  const onSubmit = (data) => console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <img className={styles.filterIcon} src={filterIcon} alt="" />
        Filter
      </div>
      <form className={styles.filter} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.filterEligibility}>
          <label for="eligibleSurveys">Only show eligible surveys: </label>
          <input
            type="checkbox"
            className={styles.eligibilityCheckbox}
            {...register("eligibleSurveys")}
          ></input>
        </div>
        <div className={styles.filterType}>
          <h6>Type</h6>
          <input
            type="checkbox"
            id="onlineSurvey"
            className={styles.checkbox}
            {...register("onlineSurvey")}
          />
          <label for="onlineSurvey">Online Survey</label> <br />
          <input
            type="checkbox"
            id="researchPhysical"
            className={styles.checkbox}
            {...register("researchPhysical")}
          />
          <label for="researchPhysical">Research Study Physical</label> <br />
          <input
            type="checkbox"
            id="researchRemote"
            className={styles.checkbox}
            {...register("researchRemote")}
          />
          <label for="researchRemote">Research Study Remote</label> <br />
        </div>
        <div className={styles.filterRemuneration}>
          <h6>Remuneration</h6>
          <input
            type="checkbox"
            id="cash"
            className={styles.checkbox}
            {...register("cash")}
          />
          <label for="cash">Cash</label> <br />
          <input
            type="checkbox"
            id="vouchers"
            className={styles.checkbox}
            {...register("vouchers")}
          />
          <label for="vouchers">Vouchers</label> <br />
          <input
            type="checkbox"
            id="na"
            className={styles.checkbox}
            {...register("na")}
          />
          <label for="na">N/A</label> <br />
        </div>
        <div className={styles.filterStatus}>
          <h6>Status</h6>
          <input
            type="checkbox"
            id="ongoing"
            className={styles.checkbox}
            {...register("ongoing")}
          />
          <label for="ongoing">Ongoing</label> <br />
          <input
            type="checkbox"
            id="closed"
            className={styles.checkbox}
            {...register("closed")}
          />
          <label for="closed">Closed</label> <br />
        </div>
        <button type="submit" className={styles.filterBtn}>
          Filter
        </button>
      </form>
    </div>
  );
}

export default Sidebar;
