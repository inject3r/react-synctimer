import { useEffect, useRef } from "react";
import { TimerInfo } from "./types";

/**
 * Map to store all active timers and their associated metadata.
 */

const timers = new Map<number, TimerInfo>();

/**
 * Counter to generate unique timer IDs.
 */

let timerCounter = 1;

const setIntervalFn =
  typeof window !== "undefined" ? window.setInterval : setInterval;
const setTimeoutFn =
  typeof window !== "undefined" ? window.setTimeout : setTimeout;

/**
 * Creates a new timer and registers it in the internal timer collection.
 *
 * This function creates either a single-use timer (using `setTimeout`)
 * or a repeating timer (using `setInterval`), depending on the `repeating` flag.
 *
 * The timer is stored in an internal Map for management and control, allowing future
 * operations such as pause, resume, or cancellation.
 *
 * @param callback - The function to execute when the timer completes.
 * @param interval - The delay in milliseconds before the timer triggers.
 * @param repeating - (Optional) If `true`, creates a repeating timer (`setInterval`).
 * If `false` or omitted, creates a single-use timer (`setTimeout`).
 *
 * @returns A unique identifier (timer ID) that can be used to control or cancel the timer later.
 *
 * @example
 * // Create a one-time timer
 * const timerId = SetTimer(() => {
 *   console.log('This runs once after 2 seconds');
 * }, 2000);
 *
 * @example
 * // Create a repeating timer
 * const repeatingTimerId = SetTimer(() => {
 *   console.log('This runs every second');
 * }, 1000, true);
 */

export function SetTimer(
  callback: () => void,
  interval: number,
  repeating: boolean = false
): number {
  const id = timerCounter++;

  const timerId = repeating
    ? setIntervalFn(callback, interval)
    : setTimeoutFn(() => {
        callback();
        timers.delete(id);
      }, interval);

  timers.set(id, {
    id: timerId,
    repeating,
    callback,
    interval,
    paused: false,
    startTime: Date.now(),
  });

  return id;
}

/**
 * Creates a new advanced timer (Extended Timer) with arguments passed to the callback function.
 *
 * This function works similarly to `SetTimer`, but allows passing arguments to the callback function.
 * It's useful when the timer callback requires parameters.
 *
 * Internally, the timer is stored in a Map for easy management. You can control it later
 * (pause, kill, etc.) using the returned timer ID.
 *
 * @template T - The types of arguments to pass to the callback function.
 *
 * @param callback - The function to execute when the timer fires. Receives the provided arguments.
 * @param interval - The interval or delay in milliseconds before the timer triggers.
 * @param repeating - (Optional) If `true`, creates a repeating timer (`setInterval`).
 * If `false` or omitted, creates a single-use timer (`setTimeout`).
 * @param args - (Optional) Arguments to pass to the callback function upon execution.
 *
 * @returns A unique identifier (timer ID) for the newly created timer.
 *
 * @example
 * // Create a one-time extended timer with arguments
 * const timerId = SetTimerEx((name: string) => {
 *   console.log(`Hello, ${name}!`);
 * }, 2000, false, 'Alice');
 *
 * @example
 * // Create a repeating extended timer with multiple arguments
 * const repeatingTimerId = SetTimerEx(
 *   (name: string, count: number) => {
 *     console.log(`Hello, ${name}! Count: ${count}`);
 *   },
 *   1000,
 *   true,
 *   'Bob',
 *   5
 * );
 */

export function SetTimerEx<T extends any[]>(
  callback: (...args: T) => void,
  interval: number,
  repeating: boolean = false,
  ...args: T
): number {
  const id = timerCounter++;

  const handler = () => callback(...args);

  const timerId = repeating
    ? setIntervalFn(handler, interval)
    : setTimeoutFn(() => {
        handler();
        timers.delete(id);
      }, interval);

  timers.set(id, {
    id: timerId,
    repeating,
    callback: handler,
    interval,
    paused: false,
    originalArgs: args,
    startTime: Date.now(),
  });

  return id;
}

/**
 * Terminates and removes an active timer.
 *
 * This function stops a timer, whether it's a repeating timer (`setInterval`)
 * or a one-time timer (`setTimeout`). After killing, the timer is also removed
 * from the internal timer registry to free up memory and prevent leaks.
 *
 * @param timerId - The unique identifier of the timer to be killed.
 *
 * @returns Always returns `0`, indicating the operation is complete.
 *
 * @example
 * // Create a timer
 * const timerId = SetTimer(() => console.log('Timer fired!'), 1000);
 *
 * // Kill the timer before it fires
 * KillTimer(timerId);
 *
 * @remarks
 * - If the provided `timerId` does not exist, the function safely does nothing and returns `0`.
 * - It's good practice to kill timers when they are no longer needed to avoid memory leaks.
 */

export function KillTimer(timerId: number): number {
  const timer = timers.get(timerId);
  if (!timer) return 0;

  if (timer.repeating) {
    clearInterval(timer.id);
  } else {
    clearTimeout(timer.id);
  }

  timers.delete(timerId);
  return 0;
}

/**
 * Checks whether a timer with the given ID exists.
 *
 * This function verifies if a timer is currently active and registered
 * in the internal timer map.
 *
 * @param timerId - The unique identifier of the timer to check.
 *
 * @returns `true` if the timer exists and is active, otherwise `false`.
 *
 * @example
 * const timerId = SetTimer(() => console.log('Hello'), 1000);
 * console.log(IsValidTimer(timerId)); // true
 *
 * KillTimer(timerId);
 * console.log(IsValidTimer(timerId)); // false
 *
 * @remarks
 * - Useful for validating timer existence before performing operations.
 */

export function IsValidTimer(timerId: number): boolean {
  return timers.has(timerId);
}

/**
 * Determines whether a timer is a repeating timer (setInterval).
 *
 * This function checks if the specified timer was created as a repeating timer.
 * If the timer does not exist, it safely returns `false`.
 *
 * @param timerId - The unique identifier of the timer to check.
 *
 * @returns `true` if the timer is repeating, otherwise `false`.
 *
 * @example
 * const repeatingTimerId = SetTimer(() => console.log('Repeating'), 1000, true);
 * console.log(IsRepeatingTimer(repeatingTimerId)); // true
 *
 * const oneTimeTimerId = SetTimer(() => console.log('One-time'), 1000, false);
 * console.log(IsRepeatingTimer(oneTimeTimerId)); // false
 *
 * @remarks
 * - If the timer does not exist, returns `false` by default.
 */

export function IsRepeatingTimer(timerId: number): boolean {
  const timer = timers.get(timerId);
  return timer ? timer.repeating : false;
}

/**
 * Counts the number of currently running simple timers.
 *
 * Simple timers are those created using `SetTimer` without any additional arguments.
 * This function is useful for monitoring or debugging the number of active basic timers.
 *
 * @returns The total count of active simple timers.
 *
 * @example
 * SetTimer(() => console.log('Simple Timer'), 1000);
 * console.log(CountRunningTimers()); // 1
 *
 * @remarks
 * - Excludes timers created with `SetTimerEx`.
 * - Helps differentiate between simple and extended timers.
 */

export function CountRunningTimers(): number {
  let count = 0;
  timers.forEach((timer) => {
    if (!timer.originalArgs) {
      count++;
    }
  });
  return count;
}

/**
 * Counts the number of currently running extended timers.
 *
 * Extended timers are those created using `SetTimerEx`, which accept additional arguments.
 * This function helps in tracking the number of active advanced timers in the system.
 *
 * @returns The total count of active extended timers.
 *
 * @example
 * SetTimerEx((msg) => console.log(msg), 1000, false, 'Hello World');
 * console.log(CountRunningExTimers()); // 1
 *
 * @remarks
 * - Only counts timers created with `SetTimerEx`.
 * - Useful for profiling or diagnostics of extended timer usage.
 */

export function CountRunningExTimers(): number {
  let count = 0;
  timers.forEach((timer) => {
    if (timer.originalArgs) {
      count++;
    }
  });
  return count;
}

/**
 * Pauses a running timer by its ID.
 *
 * This function temporarily halts the execution of a timer, preserving its remaining time
 * (for non-repeating timers) or stopping its interval (for repeating timers).
 * Paused timers can be resumed later using the `ResumeTimer` function.
 *
 * @param timerId - The unique identifier of the timer to pause.
 * @returns `true` if the timer was successfully paused, `false` if the timer does not exist or is already paused.
 *
 * @example
 * const timerId = SetTimer(() => console.log('Hello'), 5000);
 * PauseTimer(timerId); // true
 *
 * @remarks
 * - If the timer is already paused, the function returns `false`.
 * - For non-repeating timers, the remaining time is calculated and stored for later resumption.
 * - Pausing a timer does not remove it from the internal timers map.
 */

export function PauseTimer(timerId: number): boolean {
  const timer = timers.get(timerId);
  if (!timer || timer.paused) return false;

  const elapsed = Date.now() - (timer.startTime || 0);

  if (timer.repeating) {
    clearInterval(timer.id);
  } else {
    clearTimeout(timer.id);
    timer.remaining = timer.interval - elapsed;
  }

  timer.paused = true;
  timers.set(timerId, timer);

  return true;
}

/**
 * Resumes a previously paused timer by its ID.
 *
 * This function restarts the execution of a paused timer, continuing from where it left off.
 * For repeating timers, a new interval is scheduled. For non-repeating timers, the remaining
 * time is used to set a new timeout.
 *
 * @param timerId - The unique identifier of the paused timer to resume.
 * @returns `true` if the timer was successfully resumed, `false` if the timer does not exist or is not paused.
 *
 * @example
 * const timerId = SetTimer(() => console.log('Hello'), 5000);
 * PauseTimer(timerId);
 * ResumeTimer(timerId); // true
 *
 * @remarks
 * - If the timer is not paused or does not exist, the function returns `false`.
 * - Resuming a repeating timer starts a new interval with the original interval time.
 * - Resuming a one-time timer uses the saved remaining time before it triggers.
 */

export function ResumeTimer(timerId: number): boolean {
  const timer = timers.get(timerId);
  if (!timer || !timer.paused) return false;

  timer.paused = false;
  timer.startTime = Date.now();

  if (timer.repeating) {
    const newId = setIntervalFn(timer.callback, timer.interval);
    timer.id = newId;
  } else {
    const newId = setTimeoutFn(() => {
      timer.callback();
      timers.delete(timerId);
    }, timer.remaining || timer.interval);
    timer.id = newId;
  }

  timers.set(timerId, timer);

  return true;
}

/**
 * Custom hook for setting a timer in a React component.
 *
 * This hook allows setting up a timer with a callback function, interval, and an optional
 * `repeating` flag. It cleans up the timer when the component unmounts or the `interval`
 * or `repeating` values change.
 *
 * @param callback - The callback function to be called when the timer expires.
 * @param interval - The time interval (in milliseconds) between each callback call.
 * @param repeating - If true, the timer will repeat at the specified interval (default is false).
 *
 * @returns void
 *
 * @example
 * useTimer(() => console.log("Timer expired!"), 1000, true);
 *
 * @remarks
 * - The timer is cleared when the component is unmounted or `interval`/`repeating` changes.
 */

export function useTimer(
  callback: () => void,
  interval: number,
  repeating: boolean = false
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const id = SetTimer(() => callbackRef.current(), interval, repeating);
    return () => {
      KillTimer(id);
    };
  }, [interval, repeating]);
}

/**
 * Custom hook for setting a timer with arguments in a React component.
 *
 * This hook allows setting up a timer with a callback function that accepts arguments,
 * an interval, and an optional `repeating` flag. It cleans up the timer when the component
 * unmounts or the `interval`, `repeating`, or `args` values change.
 *
 * @param callback - The callback function that takes arguments to be called when the timer expires.
 * @param interval - The time interval (in milliseconds) between each callback call.
 * @param repeating - If true, the timer will repeat at the specified interval (default is false).
 * @param args - The arguments to be passed to the callback function.
 *
 * @returns void
 *
 * @example
 * useTimerEx((msg: string) => console.log(msg), 1000, true, "Repeating message!");
 *
 * @remarks
 * - The timer is cleared when the component is unmounted or `interval`, `repeating`, or `args` changes.
 */

export function useTimerEx<T extends any[]>(
  callback: (...args: T) => void,
  interval: number,
  repeating: boolean = false,
  ...args: T
) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    const id = SetTimerEx(
      (...params: T) => callbackRef.current(...params),
      interval,
      repeating,
      ...args
    );
    return () => {
      KillTimer(id);
    };
  }, [interval, repeating, ...args]);
}

export { timers };
