import {
  addVehicle,
  popVehicle,
  getQueueLength,
  saveInspectionReport,
  getInspectionReport,
} from "../index";

import {
  RegisteredVehicle,
  vehicleQueue,
  InspectionReport,
  inspectionReports,
} from "../model";

class registerForm {
  constructor(public licenseplate: string, public odo: string) {}
}

class inspectionForm {
  constructor(
    public lp: string,
    public owner: string,
    public odo: string,
    public vin: string,
    public controlResults: string
  ) {}
}

function createVehicle(data: registerForm): RegisteredVehicle {
  return new RegisteredVehicle(data.licenseplate, data.odo);
}

function createInspectionReport(data: inspectionForm): InspectionReport {
  return new InspectionReport(
    data.lp,
    data.owner,
    data.odo,
    data.vin,
    data.controlResults
  );
}

// initials

const vehicle1Data = new registerForm("11TEST1111", "111111");
const vehicle2Data = new registerForm("22TEST2222", "222222");

const vehicle1 = createVehicle(vehicle1Data);
const vehicle2 = createVehicle(vehicle2Data);

const inspectionForm1Data = new inspectionForm(
  vehicle1.licensePlate,
  vehicle1.sender,
  vehicle1.odo,
  "VIN0TEST111111",
  "[{\"section\":\"EXTERIOR\",\"test\":\"Body\",\"result\":\"FAIL\"}]"
);

const inspectionReport1 = createInspectionReport(inspectionForm1Data);

// tests

describe("tests related registration queue", () => {
  beforeEach(() => {
    addVehicle(vehicle1.licensePlate, vehicle1.odo);
  });

  afterEach(() => {
    while (vehicleQueue.length > 0) popVehicle();
  });

  test("should register new vehicle", () => {
    expect(vehicleQueue.length).toBe(1, "should only contain one vehicle");
    expect(vehicleQueue[0]).toStrictEqual(vehicle1, "should be same");
  });

  test("should pop first vehicle from queue (first in first out)", () => {
    addVehicle(vehicle2.licensePlate, vehicle2.odo);
    expect(vehicleQueue.length).toBe(2, "should  contain two vehicles");

    const poppedVehicle: RegisteredVehicle = popVehicle();
    expect(poppedVehicle).toStrictEqual(vehicle1, "should be same");
    expect(vehicleQueue.length).toBe(1, "should only contain one vehicle");
  });

  test("should get length of the vehicle queune", () => {
    expect(getQueueLength()).toBe(1, "should only contain one vehicle");
  });
});

describe("tests related inspection report", () => {
  beforeEach(() => {
    saveInspectionReport(
      inspectionForm1Data.lp,
      inspectionForm1Data.owner,
      inspectionForm1Data.odo,
      inspectionForm1Data.vin,
      inspectionForm1Data.controlResults
    );
  });

  test("should save inspection report", () => {
    expect(inspectionReports.get(vehicle1.licensePlate)).toStrictEqual(
      inspectionReport1,
      "should be same"
    );
  });

  test("should retrieve inspection report", () => {
    const inspectionReport2 = getInspectionReport(vehicle1.licensePlate);
    expect(inspectionReport2).toStrictEqual(
      inspectionReport1,
      "should be same"
    );
  });

  test("should indicate if no inspection report found", () => {
    const licensePlate = "some-unregistered-plate";
    const inspectionReport2 = getInspectionReport(licensePlate);
    expect(inspectionReport2).toBe(null, "should be null");
  });
});
