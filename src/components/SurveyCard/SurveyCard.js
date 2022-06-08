import styles from "./SurveyCard.module.css";
import { useNavigate } from "react-router-dom";

function SurveyCard(props) {
  const navigate = useNavigate();

  return (
    <div className={styles.surveyCard}>
      <div className={styles.surveyCard__body}>
        <h2 className={styles.surveyCard__title}>{props.survey.title}</h2>
        <p className={styles.surveyCard__description}>
          {props.survey.description}
        </p>
      </div>
      <button
        className={styles.surveyCard__btn}
        onClick={() => navigate("/surveys/" + props.survey.id)}
      >
        More information
      </button>
    </div>
  );
}

export default SurveyCard;
