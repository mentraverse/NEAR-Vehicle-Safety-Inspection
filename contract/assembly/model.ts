import { context, PersistentDeque, PersistentMap } from "near-sdk-as";

// exporting a new class RegisteredVehicle so it can be used outside of this file

@nearBindgen
export class RegisteredVehicle {
  sender: string;
  constructor(public licensePlate: string, public odo: string) {
    this.sender = context.sender;
  }
}

// exporting a new class InspectionReport so it can be used outside of this file

@nearBindgen
export class InspectionReport {
  sender: string;
  timestamp: u64;
  overallResult: string;
  constructor(
    public licensePlate: string,
    public owner: string,
    public odo: string,
    public vin: string,
    public controlResults: string
  ) {
    this.sender = context.sender;
    this.timestamp = context.blockTimestamp;
    this.overallResult = controlResults.indexOf('\"FAIL\"') === -1 ? "PASS" : "FAIL"; 
  }
}

// registered vehicles to inspection queue saved in the storage as persistent deque

export const vehicleQueue = new PersistentDeque<RegisteredVehicle>("m");

// final inspection reports saved in the storage as persistent map

export const inspectionReports = new PersistentMap<string, InspectionReport>(
  "m"
);
