import {
  SetTimer,
  KillTimer,
  PauseTimer,
  ResumeTimer,
  CountRunningTimers,
  IsRepeatingTimer,
} from "../src/index";
import assert from "assert";

describe("Timers", () => {
  it("returns valid timer ID for set timers", () => {
    const id = SetTimer(() => console.log("Test Timer"), 1000);
    assert.equal(typeof id, "number");
    KillTimer(id);
  });

  it("does not return valid ID for an invalid timer", () => {
    const invalidId = 99999;
    assert.equal(KillTimer(invalidId), 0);
  });

  it("correctly counts the number of running timers", () => {
    const initialCount = CountRunningTimers();
    const id1 = SetTimer(() => console.log("Timer 1"), 1000);
    const id2 = SetTimer(() => console.log("Timer 2"), 2000);

    assert.equal(CountRunningTimers(), initialCount + 2);

    KillTimer(id1);
    KillTimer(id2);
  });

  it("pauses and resumes timers correctly", () => {
    const id = SetTimer(() => console.log("Timer to pause"), 1000);

    assert.equal(PauseTimer(id), true);
    assert.equal(ResumeTimer(id), true);

    KillTimer(id);
  });

  it("correctly handles non-repeating timers", () => {
    const id = SetTimer(() => console.log("Single execution timer"), 1000);
    assert.equal(IsRepeatingTimer(id), false);
    KillTimer(id);
  });

  it("correctly handles repeating timers", () => {
    const id = SetTimer(() => console.log("Repeating timer"), 1000, true);
    assert.equal(IsRepeatingTimer(id), true);
    KillTimer(id);
  });

  it("does not resume paused timers twice", () => {
    const id = SetTimer(() => console.log("Pause test"), 1000);
    assert.equal(PauseTimer(id), true);
    assert.equal(PauseTimer(id), false);
    KillTimer(id);
  });
});
