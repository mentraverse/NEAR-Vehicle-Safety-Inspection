import "regenerator-runtime/runtime";
import React from "react";
import TestRenderer from "react-test-renderer";
import App from "../../App";
const { act } = TestRenderer;

// declare stubs for contract, currentUser, walletConnection, and nearConfig
const contract = {
  account: {
    connection: {},
    accountId: "test.near",
  },
  contractId: "test.near",
  popVehicle: () => new Promise(() => {}),
  addVehicle: () => "",
  getQueueLength: () => new Promise(() => {}),
  saveInspectionReport: () => "",
  getInspectionReport: () => new Promise(() => {}),
};
const currentUser = {
  accountId: "test.near",
};
const walletConnection = {
  account: () => ({ _state: { amount: "1" + "0".repeat(25) } }),
  requestSignIn: () => null,
  signOut: () => null,
  isSignedIn: () => false,
  getAccountId: () => "test.near",
};
const nearConfig = {
  networkId: "testnet",
  nodeUrl: "https://rpc.testnet.near.org",
  contractName: "test.near",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://near-contract-helper.onrender.com",
};

// save current (default) route
const savedLocation = window.location;

// navigate to another route
const navigate = (subLocation) => {
  delete window.location;
  window.location = Object.assign(new URL(savedLocation + subLocation), {
    ancestorOrigins: "",
    assign: jest.fn(),
    reload: jest.fn(),
    replace: jest.fn(),
  });
};

// for UI tests, use pattern from: https://reactjs.org/docs/test-renderer.html
let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
  // sign out
  walletConnection.isSignedIn = () => false;
  // reset route
  navigate("");
});

//tests

test("wallet sign in page renders with proper title", () => {
  let testRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <App
        contract={contract}
        currentUser={currentUser}
        wallet={walletConnection}
        nearConfig={nearConfig}
      />
    );
  });
  const testInstance = testRenderer.root;

  expect(testInstance.findByType("h5").children).toEqual(["Wallet Sign In"]);
});

test("register vehicle page renders with proper title", () => {
  // to be signed in to see this page
  walletConnection.isSignedIn = () => true;

  let testRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <App
        contract={contract}
        currentUser={currentUser}
        wallet={walletConnection}
        nearConfig={nearConfig}
      />
    );
  });
  const testInstance = testRenderer.root;

  expect(testInstance.findByType("h5").children).toEqual([
    "New Vehicle Registration",
  ]);
});

test("inspect vehicle page renders with proper title", () => {
  // to be signed in to see this page
  walletConnection.isSignedIn = () => true;
  // navigate to route
  navigate("inspect");

  let testRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <App
        contract={contract}
        currentUser={currentUser}
        wallet={walletConnection}
        nearConfig={nearConfig}
      />
    );
  });
  const testInstance = testRenderer.root;

  expect(testInstance.findByType("h5").children).toEqual([
    "Vehicle Inspect & Report",
  ]);
});

test("check vehicle page renders with proper title", () => {
  // to be signed in to see this page
  walletConnection.isSignedIn = () => true;
  // navigate to route
  navigate("check");

  let testRenderer;
  act(() => {
    testRenderer = TestRenderer.create(
      <App
        contract={contract}
        currentUser={currentUser}
        wallet={walletConnection}
        nearConfig={nearConfig}
      />
    );
  });
  const testInstance = testRenderer.root;

  expect(testInstance.findByType("h5").children).toEqual([
    "Vehicle Inspection Check",
  ]);
});
