/**
 * TimerInfo keeps track of both basic and extended (Ex) timers,
 * including essential details such as its unique identifier, type (repeating or one-shot),
 * timing information, pause state, and any original arguments passed to the callback.
 */
export type TimerInfo = {
    /**
     * System-assigned unique identifier for the timer.
     * Used to manage and reference the timer instance.
     */
    id: number | NodeJS.Timeout;
    /**
     * Indicates whether the timer is repeating (interval) or single-use (timeout).
     * - true: The timer repeats at the specified interval.
     * - false: The timer executes only once.
     */
    repeating: boolean;
    /**
     * The function to be executed when the timer triggers.
     * For extended timers (SetTimerEx), this will include argument handling.
     */
    callback: () => void;
    /**
     * The interval duration for the timer in milliseconds.
     * Defines the delay for the initial execution or repetition cycle.
     */
    interval: number;
    /**
     * (Optional) Time remaining in milliseconds when the timer is paused.
     * Used for resuming the timer accurately after a pause.
     */
    remaining?: number;
    /**
     * (Optional) Timestamp in milliseconds indicating when the timer was started.
     * Useful for calculating elapsed or remaining time dynamically.
     */
    startTime?: number;
    /**
     * Indicates whether the timer is currently paused.
     * - true: The timer is paused and will not execute until resumed.
     * - false: The timer is active or has completed its lifecycle.
     */
    paused: boolean;
    /**
     * (Optional) Original arguments passed to the timer's callback function.
     * Primarily used in extended timers (SetTimerEx) to maintain argument context.
     */
    originalArgs?: any[];
};
