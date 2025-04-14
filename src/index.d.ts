/**
 * @license React-SyncTimer
 *
 * Copyright (c) Abolfazl Hosseini, Inc. and its affiliates.
 * Developed by Abolfazl Hosseini.
 *
 * This source code is licensed under the MIT license, which can be found in the
 * LICENSE file located in the root directory of this source tree.
 *
 *
 * This file acts as an entry point to export all timer-related functionalities,
 * ensuring a clean and centralized access point for external imports.
 *
 * Structure:
 * - types.ts:      Contains TypeScript type definitions used throughout the timer system.
 * - timerManager.ts: Provides the TimerManager class for advanced timer management,
 *                    including listing, filtering, and organizing timers.
 * - timerFunctions.ts: Includes utility functions for creating, controlling,
 *                      and querying timers (such as SetTimer, SetTimerEx, KillTimer, etc.).
 *
 * Usage Example:
 * import { SetTimer, TimerManager } from 'react-synctimer';
 */
export * from "./types";
export * from "./timerManager";
export * from "./timerFunctions";
