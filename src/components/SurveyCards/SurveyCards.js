import SurveyCard from "../SurveyCard/SurveyCard";
import styles from "./SurveyCards.module.css"; 

const SurveyCards = ({ surveys, userInfo }) => {
  return (
    <div className={styles.surveyListings}>
      {surveys.map((survey) => {
        return <SurveyCard survey={survey} userInfo={userInfo} />;
      })}
    </div>
  );
};

export default SurveyCards;
