// NOTE: jest-dom adds handy assertions to Jest and it is recommended, but not required.
import "@testing-library/jest-dom";

import { render, fireEvent, screen } from "@testing-library/svelte";

import App from "./App.svelte";

// This is a stupid test:)
test("App renders", async () => {
  render(App);
  // if this goes trough, then app is rendered ...
  const text = screen.getByText("TickoaTTwo");
});
