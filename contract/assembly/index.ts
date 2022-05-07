import {
  RegisteredVehicle,
  vehicleQueue,
  InspectionReport,
  inspectionReports,
} from "./model";

//
// to add new vehicle to inspection queue.
//

export function addVehicle(licensePlate: string, odo: string): void {
  const vehicle = new RegisteredVehicle(licensePlate, odo);
  vehicleQueue.pushBack(vehicle);
}

//
// to get first vehicle from inspection queue.
//

export function popVehicle(): RegisteredVehicle {
  return vehicleQueue.popFront();
}

//
// to get lenght of inspection queue.
//

export function getQueueLength(): number {
  return vehicleQueue.length;
}

//
// to store inspection report to NEAR blockchain.
//

export function saveInspectionReport(
  licensePlate: string,
  owner: string,
  odo: string,
  vin: string,
  controlResults: string
): void {
  const report = new InspectionReport(
    licensePlate,
    owner,
    odo,
    vin,
    controlResults
  );
  inspectionReports.set(licensePlate, report);
}

//
// to get inspection report of vehicle with entered license plate.
//

export function getInspectionReport(
  licensePlate: string
): InspectionReport | null {
  return inspectionReports.get(licensePlate);
}
