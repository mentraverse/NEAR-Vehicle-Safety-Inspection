import React, { useRef, useState } from "react";

// bootstrap
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

// sub-component
import ControlRow from "./ControlRow";

// control list json
import controlListData from "../../../ControlList.json";

const InspectionReport = (props) => {
  const licensePlate = props.vehicle.licensePlate;
  const owner = props.vehicle.sender;
  const [enteredOdo, setEnteredOdo] = useState(props.vehicle.odo);
  const [vin, setVin] = useState(props.vehicle.vin);
  const [isPassed, setIsPassed] = useState("N/A");
  const controlResults = useRef([]);

  // method returns lenght of control list
  const controlListLength = () => {
    var length = 0;
    controlListData.map((section) => {
      length = length + section.controls.length;
    });
    return length;
  };

  // handler for change of kilometer of vehicle input
  const odoChangeHandler = (event) => {
    const formattedVal = event.target.value.replace(/\D/, ""); // number input only
    setEnteredOdo(formattedVal);
  };

  // handler for change of vehicle identification number
  const vinChangeHandler = (event) => {
    const formattedVal = event.target.value.replace(/\s/g, "").toUpperCase(); // Remove spaces and convert to uppercase
    setVin(formattedVal);
  };

  // handler for change of control results
  // decode id of clicked radio and find clicked radio's control id and result
  const controlResultChangeHandler = (ratioId) => {
    const controlId = ratioId.slice(6).slice(0, 3);
    const testResult = ratioId.slice(7).slice(2);
    var i = 0;
    controlListData.map((section, sectionIndex) => {
      section.controls.map((control, controlIndex) => {
        if (control.id === controlId)
          controlResults.current[i] = {
            section: controlListData[sectionIndex].title,
            test: controlListData[sectionIndex].controls[controlIndex].name,
            result:
              testResult === "0"
                ? "PASS"
                : testResult === "1"
                ? "PASS (RA)"
                : "FAIL",
          };
        i++;
      });
    });
    // check if all controls are done and if any control failed, then overall result is fail
    if (
      controlListLength() ===
      controlResults.current.filter((res) => res !== null).length
    ) {
      const failCount = controlResults.current.filter(
        (res) => res.result === "FAIL"
      ).length;
      setIsPassed(failCount === 0 ? "PASS" : "FAIL");
    }
  };

  return (
    <div>
      {/* vehicle inspection form */}

      <Form
        onSubmit={props.submitHandler({
          odo: enteredOdo,
          vin: vin,
          controlResults: controlResults.current,
          overallResult: isPassed,
        })}
      >
        <div className="main-header mb-4">VEHICLE INSPECTION REPORT</div>
        <Stack direction="horizontal" gap={3} className="mb-3">
          <Form.Group className="col-2" controlId="registerVehicle_plate">
            <Form.Label>License Plate</Form.Label>
            <Form.Control type="text" value={licensePlate} disabled={true} />
          </Form.Group>

          <Form.Group className="col-2" controlId="registerVehicle_plate">
            <Form.Label>Owner</Form.Label>
            <Form.Control type="text" value={owner} disabled={true} />
          </Form.Group>

          <Form.Group className="col-2" controlId="registerVehicle_odo">
            <Form.Label>Odometer Reading</Form.Label>
            <Form.Control
              type="text"
              value={enteredOdo}
              onChange={odoChangeHandler}
              placeholder="ODO Reading"
            />
          </Form.Group>

          <Form.Group className="col-4" controlId="registerVehicle_vin">
            <Form.Label>VIN</Form.Label>
            <Form.Control
              type="text"
              value={vin}
              onChange={vinChangeHandler}
              placeholder="VIN"
              maxLength={17}
            />
          </Form.Group>
        </Stack>
        <Stack>
          <Stack direction="horizontal" className="mb-3" gap={3}>
            <div className="sample-box-ok"></div>
            <div className="me-auto">
              <b>CHECKED AND OK</b>
            </div>
            <div className="sample-box-mra"></div>
            <div className="me-auto">
              <b>MAY REQUIRE ATTENTION</b>
            </div>
            <div className="sample-box-ria"></div>
            <div className="me-auto">
              <b>REQUIRES IMMEDIDATE ATTENTION</b>
            </div>
          </Stack>
        </Stack>
        <Stack direction="vertical" gap={2}>
          {/* generation of section title and control result selection rows from controlListData  */}

          {controlListData.map((section, index) => (
            <div className="mb-3 form-div" key={index}>
              <div className="section-header">{section.title}</div>

              {section.controls.map((control, idx) => (
                <ControlRow
                  control={control}
                  onRadioChange={controlResultChangeHandler}
                  key={idx}
                />
              ))}
            </div>
          ))}

          {/* show overall result  */}

          <div className="overall-result form-div">
            Overall Result:{" "}
            <b
              style={{
                color:
                  isPassed === "PASS"
                    ? "green"
                    : isPassed === "FAIL"
                    ? "red"
                    : "grey",
              }}
            >
              {isPassed}
            </b>
          </div>

          {/* submit form */}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isPassed === "N/A" || props.loadingFlag}
          >
            Sign Report{" "}
            {props.loadingFlag && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </Button>
        </Stack>
      </Form>
    </div>
  );
};

export default InspectionReport;
