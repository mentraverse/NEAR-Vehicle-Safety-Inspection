import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// sub-components
import RegisterVehicle from "./components/RegisterVehicle/RegisterVehicle";
import InspectVehicle from "./components/InspectVehicle/InspectVehicle";
import CheckVehicle from "./components/CheckVehicle/CheckVehicle";

// bootstrap
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Stack from "react-bootstrap/Stack";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// images
import logo from "./assets/near_vi_logo.png";

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  // wallet sign out
  const signOut = () => {
    wallet.signOut();
    // reload page
    window.location.replace(window.location.origin + window.location.pathname);
  };

  // wallet sign in
  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName);
  };

  return (
    // use React Fragment, <>, to avoid wrapping elements in unnecessary divs
    <>
      <main>
        <Router>
          <Container>
            <Stack gap={3}>
              {/* header div */}

              <div className="bg-light border p-3">
                <Stack direction="horizontal" gap={3}>
                  <div>
                    <img src={logo} alt="Logo" height={50} />
                  </div>
                  <div>
                    <b>NEAR Vehicle Safety Inspection</b>
                    <br />
                    <h5 className="mb-0">
                      {window.location.pathname === "/inspect" &&
                      wallet.isSignedIn()
                        ? "Vehicle Inspect & Report"
                        : window.location.pathname === "/check" &&
                          wallet.isSignedIn()
                        ? "Vehicle Inspection Check"
                        : wallet.isSignedIn()
                        ? "New Vehicle Registration"
                        : "Wallet Sign In"}
                    </h5>
                  </div>
                  <div className="ms-auto">
                    {wallet.isSignedIn() && (
                      <Button
                        style={{ float: "right" }}
                        variant="outline-danger"
                        size="lg"
                        onClick={signOut}
                      >
                        Sign out
                      </Button>
                    )}
                  </div>
                </Stack>
              </div>

              {/* body div */}

              <div className="bg-light border p-3">
                {/* if NOT signed in */}

                {!wallet.isSignedIn() && (
                  <Row>
                    <Col md={{ span: 6, offset: 3 }} className="pt-5 pb-5">
                      <div>
                        <div className="pb-4">
                          <center>
                            <h3>Welcome to NEAR Vehicle Safety Inspection!</h3>
                          </center>
                        </div>

                        <p>
                          Since our dApp lives on NEAR Protocol, you need
                          to sign in to make use of it. The button below will
                          sign you in using NEARWallet.
                        </p>
                        <p style={{ textAlign: "center", marginTop: "2.5em" }}>
                          <Button variant="primary" size="lg" onClick={signIn}>
                            Sign in
                          </Button>
                        </p>
                      </div>
                    </Col>
                  </Row>
                )}

                {/* if signed in */}

                {wallet.isSignedIn() && (
                  <Routes>
                    <Route
                      path="/"
                      exact
                      element={
                        <RegisterVehicle
                          contract={contract}
                          currentUser={currentUser}
                        />
                      }
                    ></Route>
                    <Route
                      path="/inspect"
                      element={<InspectVehicle contract={contract} />}
                    ></Route>
                    <Route
                      path="/check"
                      element={<CheckVehicle contract={contract} />}
                    ></Route>
                  </Routes>
                )}
              </div>

              <div className="bg-light border p-3">
                <center>
                  Jump to:{" "}
                  <a href="/" style={{ textDecoration: "none" }}>
                    Register
                  </a>{" "}
                  |{" "}
                  <a href="/inspect" style={{ textDecoration: "none" }}>
                    Inspect
                  </a>{" "}
                  |{" "}
                  <a href="/check" style={{ textDecoration: "none" }}>
                    Check
                  </a>
                </center>
              </div>
            </Stack>
          </Container>
        </Router>
      </main>
    </>
  );
};

export default App;
