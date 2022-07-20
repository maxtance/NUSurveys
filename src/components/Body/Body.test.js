import { render, screen } from "@testing-library/react";
import Body from "./Body";
import { BrowserRouter } from "react-router-dom";
//import AuthContext
import { AuthContext } from "../../contexts/Auth.js";

describe("Tests for Body Component (Dashboard)", () => {
  it("Renders Body component successfully without crashing", () => {
    renderBody();
    const bodyComponent = screen.getByTestId("surveyBody");
    expect(bodyComponent).toBeInTheDocument();
  });

//   it("Displays the right number of listings", () => {

//   });

  // it("Rendered body", () => {
  //     const { getByTestId } = render(<Body page={"Home"}/>);
  //     const header = getByTestId("header");
  // })
});

function renderBody() {
  const mockValue = {
    signUp: () => {},
    signIn: () => {},
    signOut: () => {},
    user: {},
    userInfo: {},
    setChange: {},
  };

  render(
    <BrowserRouter>
      <AuthContext.Provider value={mockValue}>
        <Body />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
