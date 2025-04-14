"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./types"), exports); // Exporting all shared types and interfaces
__exportStar(require("./timerManager"), exports); // Exporting the advanced TimerManager class
__exportStar(require("./timerFunctions"), exports); // Exporting core timer utility functions
