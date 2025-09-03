# EventBuilder Context Readme

## Overview

This document defines the requirements and structure for the **EventBuilder** page, which is designed to create and manage "events" for your game. The EventBuilder allows users to construct simple flowcharts, where each node represents an event, opportunity, or question that may occur in the game. The flowchart supports logic branching and conditional flows, making it suitable for complex narrative or gameplay scenarios.

---

## Main Features

- **Flowchart Interface**: Users can visually create and connect nodes, representing the flow of events.
- **Node Types**: Each node can represent an event, opportunity, or question.
- **Node Details**: Nodes have customizable properties and can store complex conditional logic.
- **Connections**: Nodes can be linked with conditions or set to always follow specific nodes.
- **Options with Logic**: Each node can present the player with multiple options, each having its own conditions and results.
- **Export as YAML**: The entire flowchart structure can be exported as a YAML file for use in the game engine or as content data.

---

## Node Structure

Each node in the flowchart should have the following structure:

```yaml
- name: string                # Display name of the node
  id: string                  # Unique identifier for the node
  type: string                # Node type (e.g., "event", "opportunity", "question")
  condition:                  # List of conditions for node activation (can be null)
    - condition_object
  always_after: string|null   # ID of another node that this node always follows (optional, null if not used)
  options:                    # List of option objects presented to the user
    - text: string              # Text shown for this option
      condition:                # List of conditions for this option (can be null)
        - condition_object
      formula: string|null      # Formula associated with this option (optional)
      options:                  # (Nested) Object containing result formulas and possible results
        formula: string           # Formula to compute the result (optional)
        results:                 # List of possible result objects
          - text: string           # Outcome text to display
            value: object           # Arbitrary value/object representing the outcome
```

**Notes:**
- `condition_object` is a placeholder for your game's condition format (e.g., stat checks, flags, etc.).
- All fields marked as `null` are optional.
- The UI should provide dropdowns or auto-complete for references such as `always_after` to reduce errors.

---

## Page Functional Requirements

1. **Node Creation & Editing**
    - Add, edit, and delete nodes.
    - Edit all properties (name, id, type, etc.).
2. **Flowchart Visualization**
    - Drag-and-drop interface to visualize and connect nodes.
    - Visual indication for conditional flows.
3. **Option Management**
    - Add, edit, and delete options for each node.
    - Nested options/results support.
4. **Conditions & Formulas**
    - Form-based or code editor input for conditions and formulas.
    - Support complex logic for conditions and result computation.
5. **Export**
    - Export the full event flowchart as a YAML file matching the structure above.

---

## Example Node (YAML)

```yaml
- name: "Find a Hidden Door"
  id: "event_001"
  type: "opportunity"
  condition:
    - stat: "perception"
      operator: ">="
      value: 5
  always_after: "event_start"
  options:
    - text: "Try to open the door"
      condition: null
      formula: "character.strength > 3"
      options:
        formula: "roll_dice(1,6) + character.luck"
        results:
          - text: "You open the door easily."
            value: { success: true }
          - text: "The door won't budge."
            value: { success: false }
    - text: "Ignore the door"
      condition: null
      formula: null
      options:
        formula: null
        results:
          - text: "You walk away."
            value: { ignored: true }
```

---

## UI Suggestions

- **Node Editor Drawer/Modal**: For editing node properties.
- **Dropdown for `always_after`**: List all existing node IDs and names.
- **Collapsible Options UI**: Nested UI for options/results.
- **Code/Formula Input**: Syntax highlighting for formulas and conditions.
- **Real-time YAML Preview**: Option to see the YAML as you build.

---

## Export

The page should provide an **Export** button to download the current flowchart as a YAML file, preserving all nodes, connections, options, and logic for import into the game engine or content management system.

---

## (Optional) Additional Features

- Import previously exported YAML to continue editing.
- Validation: Ensure all IDs are unique, required fields are filled, and references are valid.
- Search/filter nodes by name, type, or property.

---

_Last updated: 2025-09-03_