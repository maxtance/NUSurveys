import { render, screen } from "@testing-library/react";
import SurveyHeader from "./SurveyHeader";

describe("Tests for SurveyHeader Component", () => {
  it("Renders without crashing", () => {
    render(<SurveyHeader />);
    const surveyHeaderComponent = screen.queryByTestId("header");
    expect(surveyHeaderComponent).toBeInTheDocument();
  });

  it("Renders the right header for wishlist page", () => {
    render(<SurveyHeader page={"Wishlist"} />);
    const surveyHeaderComponent = screen.queryByTestId("header");
    expect(surveyHeaderComponent).toHaveTextContent(/in your wishlist/i);
  });

  it("Renders the right header for home page", () => {
    render(<SurveyHeader page={"Home"} />);
    const surveyHeaderComponent = screen.queryByTestId("header");
    expect(surveyHeaderComponent).toHaveTextContent(/showing/i) &&
      expect(surveyHeaderComponent).toHaveTextContent(/survey listing/i);
  });

  it("Displays the right survey quantity", () => {
    const numSurveys = 10;
    render(<SurveyHeader page={"Home"} numSurveys={numSurveys} />);
    const surveyHeaderComponent = screen.queryByTestId("header");
    expect(surveyHeaderComponent).toHaveTextContent(numSurveys);
  })
});
