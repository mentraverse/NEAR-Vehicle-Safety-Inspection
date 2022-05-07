import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

// bootstap
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Accordion from "react-bootstrap/Accordion";
import Spinner from "react-bootstrap/Spinner";

// styling
import "./CheckVehicle.css";

// images
import pass_png from "/assets/pass.png";
import fail_png from "/assets/fail.png";

const CheckVehicle = ({ contract }) => {
  // API Key of https://timezonedb.com/ Register and ENTER YOUR OWN KEY HERE
  const TIMEZONEDB_KEY = "GSH3OFGJ15WK";

  // to read license plate from url
  const [searchParams, setSearchParams] = useSearchParams();

  // if license plate found at url, make it uppercase and set to enteredLicensePlate
  const [enteredLicensePlate, setEnteredLicensePlate] = useState(
    searchParams.get("lp") ? searchParams.get("lp").toUpperCase() : ""
  );

  // inspection validity period in years
  const INPECTION_VALIDITY_PERIOD = 1;

  // one year in seconds
  const YEAR_IN_SEC = 60 * 60 * 24 * 365;

  const [inspectionData, setInspectionData] = useState("");
  const [now, setNow] = useState(0);
  const [loadingFlag, setLoadingFlag] = useState(false);

  // handler for change of license plate input.
  const licensePlateChangeHandler = (event) => {
    // ignore spaces and convert input to uppercase
    const formattedVal = event.target.value.replace(/\s/g, "").toUpperCase();

    setEnteredLicensePlate(formattedVal);
  };

  // form submit handler
  const submitHandler = (event) => {
    event.preventDefault();
    setLoadingFlag(true);
    setInspectionData("");

    // read UTC time from https://timezonedb.com/
    fetch(
      "http://api.timezonedb.com/v2.1/get-time-zone?key=" +
        TIMEZONEDB_KEY +
        "&format=json&by=position&lat=0&lng=0"
    )
      .then((response) => response.json())
      .then((data) => {
        setNow(data.timestamp);

        // get inspection report from blokchain
        contract
          .getInspectionReport({
            licensePlate: enteredLicensePlate,
          })
          .then((report) => {
            setLoadingFlag(false);
            if (report !== null) setInspectionData(report);
            else setInspectionData("na");
          });
      })
      .catch((error) => console.error(error));
  };

  // return human readable inspection date
  const inspectionDateHR = () => {
    return new Date(
      Number(inspectionData.timestamp / 1000000)
    ).toLocaleDateString("tr-TR");
  };

  // calculate and return human readable inspection expire date
  const expireDateHR = () => {
    return new Date(
      Number(inspectionData.timestamp / 1000000) +
        INPECTION_VALIDITY_PERIOD * YEAR_IN_SEC * 1000
    ).toLocaleDateString("tr-TR");
  };

  // return is vehicle in approved status (inspection report has PASSED result and in validity period)
  const isPermitted = () => {
    return (
      inspectionData.overallResult === "PASS" &&
      Number(inspectionData.timestamp) +
        INPECTION_VALIDITY_PERIOD * YEAR_IN_SEC >=
        now
    );
  };

  return (
    <div className="pt-3 pb-3">
      {/* license plate input form */}

      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="registerVehicle_plate">
              <Form.Label>License Plate</Form.Label>
              <Form.Control
                type="text"
                value={enteredLicensePlate}
                onChange={licensePlateChangeHandler}
                placeholder="Licence Plate Number"
                size="lg"
                disabled={loadingFlag}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                variant="primary"
                type="submit"
                size="lg"
                disabled={loadingFlag || enteredLicensePlate === ""}
              >
                Search{" "}
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

      {/* if report found for this vehicle, show report status and details */}

      {inspectionData && inspectionData !== "na" && (
        <Row>
          <Col md={{ span: 10, offset: 1 }}>
            <Row className="mt-5 mb-5 vertical-center">
              <Col className="col-3 col-lg-2">
                <center>
                  {now && isPermitted() ? (
                    <img src={pass_png} alt="Pass" height={100} />
                  ) : (
                    <img src={fail_png} alt="Fail" height={100} />
                  )}
                </center>
              </Col>
              <Col>
                The vehicle with license plate{" "}
                <b className="text-blue">{inspectionData.licensePlate}</b>{" "}
                {now && isPermitted() ? "meets" : "does not meet"} the motor
                vehicle safety standards/regulations and it is{" "}
                {now && isPermitted() ? (
                  <b className="text-green"> PERMITTED </b>
                ) : (
                  <b className="text-red"> PROHIBITED </b>
                )}
                to be operated on public streets and highways.
              </Col>
            </Row>
            <Row>
              <Col>
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="1">
                    <Accordion.Header>
                      Click to show inspection report...
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row>
                        <Col>Inspection date:</Col>
                        <Col md="auto">{inspectionDateHR()}</Col>
                      </Row>
                      {inspectionData.overallResult === "PASS" && (
                        <Row>
                          <Col>Expire date: </Col>
                          <Col md="auto">{expireDateHR()}</Col>
                        </Row>
                      )}
                      <Row>
                        <Col>Vehicle owner: </Col>
                        <Col md="auto">{inspectionData.owner}</Col>
                      </Row>
                      <Row>
                        <Col>VIN:</Col>
                        <Col md="auto">{inspectionData.vin}</Col>
                      </Row>
                      <Row>
                        <Col>Odometer Reading:</Col>
                        <Col md="auto">{inspectionData.odo}</Col>
                      </Row>
                      <Row>
                        <Col>Overall Result:</Col>
                        <Col md="auto">{inspectionData.overallResult}</Col>
                      </Row>
                      <Row>
                        <Col>Inspector:</Col>
                        <Col md="auto">{inspectionData.sender}</Col>
                      </Row>
                      <Row>
                        <Col>
                          <hr />
                        </Col>
                      </Row>
                      {JSON.parse(inspectionData.controlResults).map(
                        (x, index) => {
                          return (
                            <Row key={index} className="pb-2">
                              <Col>{x.section}</Col>
                              <Col>{x.test}</Col>
                              <Col className="text-right">{x.result}</Col>
                            </Row>
                          );
                        }
                      )}
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Col>
            </Row>
          </Col>
        </Row>
      )}

      {/* if report not found for this vehicle, show message */}

      {inspectionData && inspectionData === "na" && (
        <Row>
          <Col md={{ span: 10, offset: 1 }} className="pt-5 pb-3 text-center">
            <b>No record found!</b>
            <br />
          </Col>
        </Row>
      )}
    </div>
  );
};

export default CheckVehicle;
