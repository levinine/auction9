import { FormGroup } from "@angular/forms";
import * as moment from 'moment';

export const minStartTimeValidator = (group: FormGroup): { [key: string]: boolean } => {
  const startDate = group.get('dateGroup.startDate').value;
  const startTime = group.get('startTime').value;

  if (startTime !== '') {
    // If start date is todays date, user can't choose min time in the past.
    if (moment(startDate).format("YYYY-MM-DD") == moment(new Date()).format("YYYY-MM-DD")) {
      if (startTime < moment(new Date()).format("hh:mm")) {
        return { startTimeIsNotInThePast: true }
      }
    }
  }
  return null;
};


