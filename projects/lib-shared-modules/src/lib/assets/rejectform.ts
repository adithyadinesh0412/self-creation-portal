import { pattern } from "../constants/commonConstants"
export const rejectform = {
    "name": "title",
    "label": "Add a reason",
    "value": "",
    "class": "",
    "type": "text",
    "placeHolder": "Reason for reporting the content",
    "position": "floating",
    "errorMessage": {
      "required": "Enter a valid reason",
      "pattern": "Reason can only include alphanumeric characters with spaces, -, & and <>",
      "maxLength": "Reason must not exceed 256 characters"
    },
    "validators": {
      "required": false,
      "maxLength": 255,
      "pattern": pattern
    }
  }