import React, { useState } from "react";

// bootstrap
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// styling
import "./ControlRow.css";

const ControlRow = (props) => {
  const [val, setVal] = useState("");

  // all possible results
  const testResults = ["PASS", "PASS (RA)", "FAIL"];

  // handler for ratio click
  const radioChangeHandler = (event) => {
    setVal(event.target.value);
    props.onRadioChange(event.target.id);
  };

  return (
    <div className="ratio-row">
      <Row>
        <Col sm="auto">
          {/* first column - radios for each possible result */}

          {testResults.map((result, index) => (
            <Form.Check
              inline
              label=""
              key={"radio-".concat(props.control.id.concat(index))}
              name={"group".concat(props.control.id)}
              type="radio"
              value={result}
              id={"radio-".concat(props.control.id.concat(index))}
              onChange={radioChangeHandler}
              className={
                result === "PASS" ? "co" : result === "PASS (RA)" ? "ra" : "ri"
              }
            />
          ))}
        </Col>

        {/* second column - write control name */}

        <Col className="test-name">{props.control.name}</Col>

        {/* third column - write the value of selected radio as result of control */}

        <Col>
          <div className="result-text">
            <div
              className={
                val === "PASS"
                  ? "result-text-passed"
                  : val === "PASS (RA)"
                  ? "result-text-passed-ra"
                  : "result-text-failed"
              }
            >
              {val}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ControlRow;
