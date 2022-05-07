import { RegisteredVehicle } from "../model";
import { VMContext } from "near-sdk-as";

function createVehicle(lp: string, odo: string): RegisteredVehicle {
  return new RegisteredVehicle(lp, odo);
}

// initials

const owner = "owner1";
const lp: string = "12TEST123";
const odo: string = "123456";
let vehicle: RegisteredVehicle;

// tests

describe("register vehicle", () => {
  it("should allow instantiation", () => {
    vehicle = createVehicle(lp, odo);
    expect(vehicle instanceof RegisteredVehicle).toBeTruthy();
  });

  it("should record sender automatically", () => {
    VMContext.setSigner_account_id(owner);
    vehicle = createVehicle(lp, odo);
    expect(vehicle.sender).toStrictEqual(owner);
  });
});
