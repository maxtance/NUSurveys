import styles from "./SurveyHeader.module.css";

const SurveyHeader = ({ page, numSurveys }) => {
  return page === "Home" ? (
    <div data-testid="header" className={styles.pageHeader}>
      Showing <span className={styles.numSurveysColor}>{numSurveys}</span>{" "}
      Survey Listing
      {numSurveys > 1 ? "s" : ""}
    </div>
  ) : (
    <div data-testid="header" className={styles.pageHeader}>
      You have <span className={styles.numSurveysColor}>{numSurveys}</span>{" "}
      Survey
      {numSurveys === 1 ? " " : "s "}
      in your Wishlist
    </div>
  );
};

export default SurveyHeader;
