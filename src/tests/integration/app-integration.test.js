import "regenerator-runtime/runtime";

// set jest timeout to 30 seconds
jest.setTimeout(30000);

let near;
let contract;
let accountId;

beforeAll(async function () {
  near = await nearlib.connect(nearConfig);
  accountId = nearConfig.contractName;
  contract = await near.loadContract(nearConfig.contractName, {
    viewMethods: ["getQueueLength", "getInspectionReport"],
    changeMethods: ["addVehicle", "popVehicle", "saveInspectionReport"],
    sender: accountId,
  });
});

beforeEach(async function () {
  // register one vehicle to queue as default
  await contract.addVehicle({ licensePlate: "11TEST1111", odo: "111111" });
});

//tests

test("pop one vehicle from registered vehicles queue", async () => {
  //pop a vehicle
  const vehicle = await contract.popVehicle();

  const expectedResult = {
    licensePlate: "11TEST1111",
    sender: accountId,
    odo: "111111",
  };

  expect(vehicle).toEqual(expectedResult);
});

test("pop one vehicle, store its inspection report then retrieve it", async function () {
  // pop
  const vehicle = await contract.popVehicle();

  // store inspection report
  await contract.saveInspectionReport({
    licensePlate: vehicle.licensePlate,
    owner: vehicle.sender,
    odo: vehicle.odo,
    vin: "TESTVIN",
    controlResults: '[{"section":"EXTERIOR","test":"Body","result":"FAIL"}]',
  });

  // retrieve inspection report
  const report = await contract.getInspectionReport({
    licensePlate: vehicle.licensePlate,
  });

  const expectedResult = {
    licensePlate: vehicle.licensePlate,
    owner: vehicle.sender,
    odo: vehicle.odo,
    vin: "TESTVIN",
    overallResult: "FAIL",
    controlResults: '[{"section":"EXTERIOR","test":"Body","result":"FAIL"}]',
    sender: accountId,
  };

  expect(report).toMatchObject(expectedResult);
});

test("add random number of vehicles to inspection que, then get lenght of it", async function () {
  //register random chosen number of vehicles to queue (btw 0-5)
  let vehiclesToAdd = Math.floor(Math.random() * 5);

  // add 1 for registered vehicle in beforeEach method
  const expectedResult = vehiclesToAdd + 1;

  while (vehiclesToAdd !== 0) {
    //register new vehicles to inspecion queue with different license plates
    await contract.addVehicle({
      licensePlate: "11TEST1110" + vehiclesToAdd.toString(),
      odo: "111111",
    });
    vehiclesToAdd--;
  }

  const length = await contract.getQueueLength();
  expect(length).toEqual(expectedResult);
});
