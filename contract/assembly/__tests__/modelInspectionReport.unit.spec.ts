import { InspectionReport } from "../model";
import { VMContext } from "near-sdk-as";

function createInspectionReport(
  lp: string,
  owner: string,
  odo: string,
  vin: string,
  controlResults: string
): InspectionReport {
  return new InspectionReport(
    lp,
    owner,
    odo,
    vin,
    controlResults
  );
}

// initials

const owner = "owner1";
const inspector = "inspector1";
const timestamp: u64 = 1651504986492;
const lp: string = "11TEST1111";
const odo: string = "111111";
const vin: string = "222222";
const controlResults: string = "[{\"section\":\"EXTERIOR\",\"test\":\"Body\",\"result\":\"FAIL\"}]";

VMContext.setSigner_account_id(inspector);
VMContext.setBlock_timestamp(timestamp);

const report = createInspectionReport(
  lp,
  owner,
  odo,
  vin,
  controlResults
);

// tests

describe("save inspection report", () => {
  test("should allow instantiation", () => {
    expect(report instanceof InspectionReport).toBeTruthy();
  });

  test("should record sender automatically", () => {
    expect(report.sender).toStrictEqual(inspector);
  });

  test("should record block timestamp automatically", () => {
    expect(report.timestamp).toStrictEqual(timestamp);
  });

  test("should overall inspection result setted automatically", () => {
    // we expect FAIL since our control string has failed test result
    expect(report.overallResult).toStrictEqual("FAIL");
  });
});
