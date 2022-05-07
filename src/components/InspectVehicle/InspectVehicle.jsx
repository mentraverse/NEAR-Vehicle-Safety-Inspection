import React, { useState, useRef } from "react";

// bootstrap
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Stack from "react-bootstrap/Stack";
import Alert from "react-bootstrap/Alert";

// sub-component
import InspectionReport from "./components/InspectionReport";

// styling
import "./InspectVehicle.css";

const InspectVehicle = ({ contract }) => {
  // check if any vehicles waiting in inspection quene periodically
  const AUTO_RETRY_TIME = 30; //seconds
  const intervalId = useRef(null);

  const [vehicleData, setVehicleData] = useState({
    licensePlate: "",
    sender: "",
    odo: "",
    vin: "",
  });
  const [loadingFlag, setLoadingFlag] = useState(false);
  const [retryFlag, setRetryFlag] = useState(false);
  const [saveSuccess, setSaveSucccess] = useState("");
  const [submitButtonText, setSubmitButtonText] = useState("Get vehicle");

  // get vehicle button clicked
  const inspectVehicleHandler = () => {
    setLoadingFlag(true);

    // check if and vehicles in queue
    contract.getQueueLength().then((count) => {
      // if found, get first one and check if it has stored reports from past
      if (count > 0) {
        setSubmitButtonText("Fetching data");
        contract
          .popVehicle()
          .then((vehicle) => {
            contract
              .getInspectionReport({ licensePlate: vehicle.licensePlate })
              .then((pastData) => {
                // if stored report found, read its VIN
                vehicle.vin = pastData ? pastData.vin : "";
                setVehicleData(vehicle);
                setLoadingFlag(false);
                setSubmitButtonText("Get vehicle");
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => console.error(err));
      } else {
        // if queue is empty and can't get vehicle data, auto-retry
        setLoadingFlag(false);

        var timer = AUTO_RETRY_TIME;
        setRetryFlag(true);
        setSubmitButtonText(
          "No vehicles in queue, auto-retry in " + timer + " seconds"
        );
        timer--;
        intervalId.current = setInterval(() => {
          setSubmitButtonText(
            "No vehicles in queue, auto-retry in " + timer + " seconds"
          );
          timer--;
          if (timer === -1) {
            clearInterval(intervalId.current);
            inspectVehicleHandler();
            setRetryFlag(false);
          }
        }, 1000);
      }
    });
  };

  // stop auto-retry
  const resetHandler = () => {
    clearInterval(intervalId.current);
    setSubmitButtonText("Get vehicle");
    setRetryFlag(false);
    setSaveSucccess("");
  };

  // submit inspection report
  const submitHandler = (signedData) => (event) => {
    event.preventDefault();
    saveInspectionReport({
      licensePlate: vehicleData.licensePlate,
      owner: vehicleData.sender,
      ...signedData,
    });
  };

  // store report on blockchain
  const saveInspectionReport = (reportData) => {
    setLoadingFlag(true);
    contract
      .saveInspectionReport({
        licensePlate: reportData.licensePlate,
        owner: reportData.owner,
        odo: reportData.odo,
        vin: reportData.vin,
        controlResults: JSON.stringify(reportData.controlResults),
      })
      .then(() => {
        setVehicleData({
          licensePlate: "",
          sender: "",
          odo: "",
        });
        setLoadingFlag(false);
        setSaveSucccess(reportData.licensePlate);
      });
  };

  return (
    <div className="pt-3 pb-3">
      {/* storing successful message */}

      {saveSuccess && (
        <Alert variant="success">
          Inspection report of vehicle with license plate <b>{saveSuccess}</b>{" "}
          has been signed and stored on NEAR blockchain successfully!
        </Alert>
      )}

      {/* if no vehicle data fetched */}
      {vehicleData.licensePlate === "" ? (
        <Stack direction="horizontal" gap={3}>
          {/* show get vehicle and reset buttons*/}

          <div className="block">
            <Button
              variant="primary"
              onClick={inspectVehicleHandler}
              disabled={loadingFlag || retryFlag}
              size="lg"
              className="block"
            >
              {submitButtonText}{" "}
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
          <div className="vr" />
          <Button
            variant="secondary"
            onClick={resetHandler}
            size="lg"
            disabled={!retryFlag}
          >
            Reset
          </Button>
          {/* if vehicle data fetched show inspection report */}
        </Stack>
      ) : (
        <InspectionReport
          vehicle={vehicleData}
          loadingFlag={loadingFlag}
          submitHandler={submitHandler}
        />
      )}
    </div>
  );
};

export default InspectVehicle;
