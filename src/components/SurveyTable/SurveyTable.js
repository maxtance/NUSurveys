import styles from "./SurveyTable.module.css";
import { Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isSurveyClosed } from "../../helpers/helperFunctions";

export const SurveyTable = ({ keyword, completedSurveys }) => {
  const navigate = useNavigate();
  const [localKeyword, setLocalKeyword] = useState("");

  //searching logic
  if (keyword != "") {
    //console.log(completedSurveys);
    completedSurveys = completedSurveys.filter((survey) => {
      return survey.surveys.title.toLowerCase().includes(keyword.toLowerCase());
    });
  }

  return (
    <table>
      <tr>
        <th className={styles.surveyTitle}>Survey Title</th>
        <th className={styles.dateCompleted}>Date Completed</th>
      </tr>
      {completedSurveys.map((completedSurvey) => {
        const isClosed = isSurveyClosed(
          completedSurvey.surveyClosingDate.closing_date
        );
        return (
          <tr onClick={() => navigate("/surveys/" + completedSurvey.survey_id)}>
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
