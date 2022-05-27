import styles from "./SurveyCard.module.css";

function SurveyCard(props) {
  return (
    <div className={styles.surveyCard}>
      <div className={styles.surveyCard__body}>
        <h2 className={styles.surveyCard__title}>{props.title}</h2>
        <p className={styles.surveyCard__description}>{props.description}</p>
      </div>
      <button className={styles.surveyCard__btn}>More information</button>
    </div>
  );
}

export default SurveyCard;
