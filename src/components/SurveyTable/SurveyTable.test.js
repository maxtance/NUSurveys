import { render, screen } from "@testing-library/react";
import { SurveyTable } from "./SurveyTable";
import { BrowserRouter } from "react-router-dom";

let mockKeyword = "";
let mockCompletedSurveys = [];

describe("Tests for Survey Table", () => {
  it("Renders Survey Table component successfully without crashing", () => {
    renderSurveyTable(mockKeyword, mockCompletedSurveys);
    const surveyTableComponent = screen.getByTestId("surveyTable");
    expect(surveyTableComponent).toBeInTheDocument();
  });

  it("Should contain the correct number of completed surveys", () => {
    mockKeyword = "";
    mockCompletedSurveys = populateCompletedSurveys();
    renderSurveyTable(mockKeyword, mockCompletedSurveys);
    const tableRows = screen.getAllByTestId("surveyRow");
    expect(tableRows.length).toBe(4);
  });

  it("Displays the correct survey title for all completed surveys", () => {
    mockKeyword = "";
    mockCompletedSurveys = populateCompletedSurveys();
    renderSurveyTable(mockKeyword, mockCompletedSurveys);
    mockCompletedSurveys.forEach((mockCompletedSurvey) => {
      const expectedTitle = mockCompletedSurvey.surveyTitle.title;
      const title = screen.getByRole("cell", {
        name: new RegExp(expectedTitle, "i"),
      });
      expect(title).toBeInTheDocument();
    });
  });

  it("Should contain the correct date completed for all completed surveys", () => {
    mockKeyword = "";
    mockCompletedSurveys = populateCompletedSurveys();
    renderSurveyTable(mockKeyword, mockCompletedSurveys);
    mockCompletedSurveys.forEach((mockCompletedSurvey) => {
      const expectedCompletedDate = mockCompletedSurvey.date_added
        .split("-")
        .reverse()
        .join("/");
      const completedDate = screen.getAllByRole("cell", {
        name: expectedCompletedDate,
      });
      expect(completedDate.length).toBe(4);
    });
  });

  it("Closed surveys should display '(CLOSED)' appended to the front of their title", () => {
    mockKeyword = "";
    mockCompletedSurveys = populateCompletedSurveys();
    renderSurveyTable(mockKeyword, mockCompletedSurveys);
    const survey3 = screen.getByRole("cell", {
      name: "(CLOSED) Survey test 3: closed",
    });
    expect(survey3).toBeInTheDocument();
    const survey4 = screen.getByRole("cell", {
      name: "(CLOSED) Survey test 4: closed",
    });
    expect(survey4).toBeInTheDocument();
  });

  it("Should contain only the surveys which contain the keyword", () => {
    mockKeyword = "normal";
    mockCompletedSurveys = populateCompletedSurveys();
    renderSurveyTable(mockKeyword, mockCompletedSurveys);
    const surveys = screen.getAllByTestId("surveyRow");
    expect(surveys.length).toBe(2);
  });
});

function renderSurveyTable(keyword, completedSurveys) {
  render(
    <BrowserRouter>
      <SurveyTable keyword={keyword} completedSurveys={completedSurveys} />
    </BrowserRouter>
  );
}

function populateCompletedSurveys() {
  const today = getTodaysDate();
  const yesterday = getYestDate();
  const tomorrow = getTmrDate();
  const survey1 = {
    date_added: today,
    surveyClosingDate: { closing_date: tomorrow },
    surveyTitle: { title: "Survey test 1: normal" },
    survey_id: "1",
  };

  const survey2 = {
    date_added: today,
    surveyClosingDate: { closing_date: tomorrow },
    surveyTitle: { title: "Survey test 2: normal" },
    survey_id: "2",
  };

  const survey3 = {
    date_added: today,
    surveyClosingDate: { closing_date: yesterday },
    surveyTitle: { title: "Survey test 3: closed" },
    survey_id: "3",
  };

  const survey4 = {
    date_added: today,
    surveyClosingDate: { closing_date: yesterday },
    surveyTitle: { title: "Survey test 4: closed" },
    survey_id: "4",
  };

  const surveys = [survey1, survey2, survey3, survey4];

  return surveys;

  function getTodaysDate() {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;
    return today;
  }

  function getTmrDate() {
    let today = new Date();
    let tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const dd = String(tomorrow.getDate()).padStart(2, "0");
    const mm = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const yyyy = tomorrow.getFullYear();
    tomorrow = yyyy + "-" + mm + "-" + dd;
    return tomorrow;
  }

  function getYestDate() {
    let today = new Date();
    let yest = new Date();
    yest.setDate(today.getDate() - 1);
    const dd = String(yest.getDate()).padStart(2, "0");
    const mm = String(yest.getMonth() + 1).padStart(2, "0");
    const yyyy = yest.getFullYear();
    yest = yyyy + "-" + mm + "-" + dd;
    return yest;
  }
}
