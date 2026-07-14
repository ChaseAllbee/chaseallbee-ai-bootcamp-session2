# Functional Requirements

## Overview

This document describes the functional requirements for the task management features of the application. These requirements define expected behavior for creating, editing, organizing, and managing tasks.

---

## FR-1: Add a Due Date to a Task

**Description**: Users can optionally assign a due date when creating a task, or add/update a due date on an existing task.

**Requirements**:
- The task creation form must include an optional date picker field for the due date.
- Due dates must be stored in `YYYY-MM-DD` format.
- If no due date is provided, the task is saved without one (due date is `null`).
- The due date must be displayed alongside the task name in the task list.
- Tasks with no due date should display a placeholder (e.g., "No due date").

**API**:
- `POST /api/items` — accepts an optional `due_date` field in the request body.
- `PUT /api/items/:id` — accepts an optional `due_date` field to add or update the due date on an existing task.

---

## FR-2: Edit a Task

**Description**: Users can edit the name and/or due date of an existing task.

**Requirements**:
- Each task in the list must have an "Edit" button or inline edit control.
- Clicking "Edit" puts the task into an editable state (e.g., the name becomes an input field and the due date becomes a date picker).
- The user must be able to confirm the edit (e.g., "Save" button) or cancel it (e.g., "Cancel" button or pressing Escape).
- Saving an edit sends a `PUT /api/items/:id` request with the updated fields.
- An empty task name must not be saved; an error message should be displayed.
- After a successful edit, the task list updates to reflect the new values without a full page reload.

**API**:
- `PUT /api/items/:id` — accepts `name` and/or `due_date` in the request body and returns the updated task.

---

## FR-3: Sort Tasks

**Description**: Tasks are sorted in a defined order so users can easily find and prioritize their work.

**Requirements**:
- The default sort order is: tasks with the earliest due date first, followed by tasks with no due date (sorted by creation date, newest first).
- Users can toggle the sort order between:
  - **Due date (ascending)** — soonest due date first.
  - **Due date (descending)** — latest due date first.
  - **Created date (newest first)** — default secondary sort.
- The active sort option must be visually indicated in the UI.
- Sorting is applied on the frontend; no additional API endpoint is required.
- Overdue tasks (due date is in the past) should be visually distinguished (e.g., red text or an icon).

---

## FR-4: Mark a Task as Complete

**Description**: Users can mark a task as complete, and completed tasks are visually differentiated from active tasks.

**Requirements**:
- Each task must have a checkbox or "Complete" button.
- Toggling completion sends a `PATCH /api/items/:id` request with `{ "completed": true/false }`.
- Completed tasks are displayed with a strikethrough style and moved to a "Completed" section below active tasks.
- Users can unmark a task as complete to return it to the active list.

**API**:
- `PATCH /api/items/:id` — accepts `{ "completed": boolean }` and returns the updated task.

---

## FR-5: Delete a Task

**Description**: Users can permanently delete a task from the list.

**Requirements**:
- Each task must have a "Delete" button.
- Clicking "Delete" should prompt the user for confirmation before removing the task.
- On confirmation, a `DELETE /api/items/:id` request is sent.
- After successful deletion, the task is removed from the UI without a full page reload.

**API**:
- `DELETE /api/items/:id` — removes the task and returns a `204 No Content` response.
