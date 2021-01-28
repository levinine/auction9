import { FormGroup } from "@angular/forms";

export const timeValidator = (group: FormGroup): { [key: string]: boolean } => {
  const startDate = group.get('dateGroup.startDate').value;
  const endDate = group.get('dateGroup.endDate').value;

  // No need for validation unless the user has chosen same day for start and end date
  // or the user has not chosen the start and end dates at all.
  if ((startDate === '' || endDate === '') || new Date(startDate).valueOf() !== new Date(endDate).valueOf()) {
    return null;
  }

  const startTime = group.get('startTime').value;
  const endTime = group.get('endTime').value;

  if (startTime !== '' && endTime !== '') {
    if (startTime >= endTime) {
      return { startTimeLessThanEndTime: true };
    }
  }

  return null;
};


