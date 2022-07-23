import styles from "./SurveyTable.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { isSurveyClosed } from "../../helpers/helperFunctions";

export const SurveyTable = ({ keyword, completedSurveys }) => {
  const navigate = useNavigate();
  const [localKeyword, setLocalKeyword] = useState("");

  //searching logic
  if (keyword !== "" && completedSurveys.length !== 0) {
    //console.log(completedSurveys);
    completedSurveys = completedSurveys.filter((survey) => {
      return survey.surveyTitle.title
        .toLowerCase()
        .includes(keyword.toLowerCase());
    });
  }

  return (
    <table data-testid="surveyTable">
      <thead>
        <tr>
          <th className={styles.surveyTitle}>Survey Title</th>
          <th className={styles.dateCompleted}>Date Completed</th>
        </tr>
      </thead>
      {completedSurveys.map((completedSurvey) => {
        const isClosed = isSurveyClosed(
          completedSurvey.surveyClosingDate.closing_date
        );
        return (
          <tr
            onClick={() => navigate("/surveys/" + completedSurvey.survey_id)}
            data-testid="surveyRow"
          >
            <td>
              <span className={styles.closedTitle}>
                {isClosed ? "(CLOSED) " : ""}
              </span>
              {completedSurvey.surveyTitle.title}
            </td>
            <td>{completedSurvey.date_added.split("-").reverse().join("/")}</td>
          </tr>
        );
      })}
    </table>
  );
};
