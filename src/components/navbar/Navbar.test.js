import { render, screen } from "@testing-library/react";
import Navbar from "./Navbar";
import { BrowserRouter } from "react-router-dom";
//import AuthContext
import { AuthContext } from "../../contexts/Auth.js";

let mockValue = {
  signUp: () => {},
  signIn: () => {},
  signOut: () => {},
  user: {},
  userInfo: {},
  setChange: {},
};

describe("Tests for Navbar Component", () => {
  it("Renders Navbar component successfully without crashing", () => {
    renderNavbar(mockValue);
    const navBarComponent = screen.getByTestId("navbar");
    expect(navBarComponent).toBeInTheDocument();
  });

  it("Displays the right name and avatar", () => {
    const bucketUrl =
      "https://jgjrrlsygjzcftgerpje.supabase.co/storage/v1/object/public/avatar-images/";
    mockValue = {
      ...mockValue,
      userInfo: {
        avatar:
          "public/blob:http://localhost:3000/f8bc1506-d4f2-4d87-b86d-2f94bf9e803a",
        id: "1",
        full_name: "Anthony Peach",
        email: "apeach0@u.nus.edu",
        gender: "Male",
        ethnicity_id: "1",
        date_of_birth: "2009-11-17",
        created_at: "2022-05-15",
        notification: "true",
      },
    };
    renderNavbar(mockValue);
    const username = screen.getByTestId("username");
    expect(username).toHaveTextContent(mockValue.userInfo.full_name);
    const image = screen.getByTestId("avatar");
    expect(image).toHaveAttribute("src", bucketUrl + mockValue.userInfo.avatar);
  });

  it("Displays the right name and placeholder avatar", () => {
    mockValue = {
      ...mockValue,
      userInfo: {
        id: "1",
        full_name: "Anthony Peach",
        email: "apeach0@u.nus.edu",
        gender: "Male",
        ethnicity_id: "1",
        date_of_birth: "2009-11-17",
        created_at: "2022-05-15",
        avatar: "",
        notification: "true",
      },
    };
    renderNavbar(mockValue);
    const username = screen.getByTestId("username");
    expect(username).toHaveTextContent(mockValue.userInfo.full_name);
    const image = screen.getByTestId("placeholder");
    expect(image).toBeInTheDocument();
  });
});

function renderNavbar(mockValue) {
  render(
    <BrowserRouter>
      <AuthContext.Provider value={mockValue}>
        <Navbar />
      </AuthContext.Provider>
    </BrowserRouter>
  );
}
