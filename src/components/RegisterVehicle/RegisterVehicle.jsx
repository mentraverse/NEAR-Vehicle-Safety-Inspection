import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

// bootstap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";

// library for decimal arithmetic
import Big from "big.js";

const RegisterVehicle = ({ contract, currentUser }) => {
  const [enteredLicensePlate, setEnteredLicensePlate] = useState("");
  const [enteredOdo, setEnteredOdo] = useState("");
  const [queueLength, setQueueLength] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loadingFlag, setLoadingFlag] = useState(false);

  const BOATLOAD_OF_GAS = Big(3)
    .times(10 ** 13)
    .toFixed();

  // transaction fee
  const INPECTION_PRICE = 5;

  // in YACTO
  const INPECTION_PRICE_YACTO = Big(INPECTION_PRICE)
    .times(10 ** 24)
    .toFixed();

  contract.getQueueLength().then((val) => setQueueLength(val));

  // handler for change of license plate input.
  const licensePlateChangeHandler = (event) => {
    // remove spaces and convert to uppercase
    const formattedVal = event.target.value.replace(/\s/g, "").toUpperCase();
    setEnteredLicensePlate(formattedVal);
  };

  // handler for change of odo input.
  const odoChangeHandler = (event) => {
    // numbers only
    const formattedVal = event.target.value.replace(/\D/, "");
    setEnteredOdo(formattedVal);
  };

  // returns http link of inspection report
  const getInspectionCheckLink = () => {
    const licensePlate = localStorage.getItem("lp");
    return (
      location.href.slice(0, location.href.lastIndexOf("/")) +
      "/check?lp=" +
      licensePlate
    );
  };

  //form submit handler
  const submitHandler = (event) => {
    event.preventDefault();
    setLoadingFlag(true);
    localStorage.setItem("lp", enteredLicensePlate);
    contract
      .addVehicle(
        { licensePlate: enteredLicensePlate, odo: enteredOdo },
        BOATLOAD_OF_GAS,
        INPECTION_PRICE_YACTO
      )
      .then(() => setLoadingFlag(false))
      .catch((err) => console.error(err));
  };

  // if first render of page (after form submit and redirect nearWallet, page renders secondly)
  if (searchParams.get("transactionHashes") === null)
    return (
      <div>
        <Row>
          <Col md={{ span: 6, offset: 3 }} className="pt-3 pb-3">
            <div className="pb-3">
              <Alert md={{ span: 6, offset: 3 }} variant="info">
                <Alert.Heading>Hello {currentUser.accountId}</Alert.Heading>
                <p>
                  Please add your vehicle to inspection queue by filling the
                  registration form bellow.
                </p>
                <hr />
                <p className="mb-0">
                  <strong>
                    Transaction fee which is {INPECTION_PRICE} NEAR will be
                    charged from your wallet balance.
                  </strong>
                </p>
              </Alert>
            </div>

            <Form onSubmit={submitHandler}>
              <Form.Group className="mb-3" controlId="registerVehicle_plate">
                <Form.Label>License Plate</Form.Label>
                <Form.Control
                  type="text"
                  value={enteredLicensePlate}
                  onChange={licensePlateChangeHandler}
                  placeholder="Licence Plate Number"
                  size="lg"
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="registerVehicle_odo">
                <Form.Label>Odometer Reading</Form.Label>
                <Form.Control
                  type="text"
                  value={enteredOdo}
                  onChange={odoChangeHandler}
                  placeholder="ODO Reading"
                  size="lg"
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button
                  variant="primary"
                  type="submit"
                  size="lg"
                  disabled={!(enteredLicensePlate && enteredOdo) || loadingFlag}
                >
                  Register...{" "}
                  {loadingFlag && (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  )}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </div>
    );

  // second render of page
  return (
    <div className="p-3">
      <center>
        <h5>
          Vehicle successfully registered to inspection queue at{" "}
          <b>
            {queueLength}
            {queueLength % 10 === 1
              ? "st "
              : queueLength % 10 === 2
              ? "nd "
              : queueLength % 10 === 3
              ? "rd "
              : "th "}
          </b>
          place.
          <br />
          <br />
          When inspection is complated, report will be available at
          <br />
          <a href={getInspectionCheckLink()}>{getInspectionCheckLink()}</a>
        </h5>
      </center>
    </div>
  );
};

export default RegisterVehicle;
