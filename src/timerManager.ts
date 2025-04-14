import { TimerInfo } from "./types";

/**
 * TimerManager class
 *
 * Provides advanced management and querying capabilities for all active timers.
 * This includes filtering between simple timers (SetTimer) and extended timers (SetTimerEx),
 * as well as retrieving individual timer details.
 *
 * Usage:
 * const manager = new TimerManager(timersMap);
 * console.log(manager.simpleTimers); // Array of simple timer IDs
 * console.log(manager.exTimers); // Array of extended timer IDs
 * console.log(manager.allTimers); // Array of all timer IDs
 * console.log(manager.getTimerById(1)); // TimerInfo object for timer ID 1
 */
export class TimerManager {
  /**
   * Map storing all active timers with their IDs and metadata.
   */
  private timers: Map<number, TimerInfo>;

  /**
   * Constructor for TimerManager
   *
   * @param timers - A Map containing timer IDs mapped to their corresponding TimerInfo.
   */
  constructor(timers: Map<number, TimerInfo>) {
    this.timers = timers;
  }

  /**
   * Retrieves an array of IDs for all simple timers (created using SetTimer).
   *
   * @returns Array of timer IDs representing simple timers.
   */
  get simpleTimers(): number[] {
    return this.filterTimers(false);
  }

  /**
   * Retrieves an array of IDs for all extended timers (created using SetTimerEx).
   *
   * @returns Array of timer IDs representing extended timers.
   */
  get exTimers(): number[] {
    return this.filterTimers(true);
  }

  /**
   * Retrieves an array of IDs for all active timers.
   *
   * @returns Array of all active timer IDs.
   */
  get allTimers(): number[] {
    return Array.from(this.timers.keys());
  }

  /**
   * Internal helper method to filter timers based on their type.
   *
   * @param isEx - Boolean indicating whether to filter for extended timers (true) or simple timers (false).
   * @returns Array of timer IDs matching the specified type.
   */
  private filterTimers(isEx: boolean): number[] {
    const result: number[] = [];
    this.timers.forEach((timer, id) => {
      if ((isEx && timer.originalArgs) || (!isEx && !timer.originalArgs)) {
        result.push(id);
      }
    });
    return result;
  }

  /**
   * Retrieves the TimerInfo object for a specific timer ID.
   *
   * @param id - The ID of the timer to retrieve.
   * @returns TimerInfo object if found, otherwise undefined.
   */
  getTimerById(id: number): TimerInfo | undefined {
    return this.timers.get(id);
  }
}
