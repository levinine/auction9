// Enumerator we will use in other components
export enum statuses {
  inactive = 'inactive',
  active = 'active',
  finished = 'finished',
  realized = 'realized'
};

// Setting default values for stopped and realized
export function getStatus(start, end, stopped = false, realized = false) {
  let startDate = new Date(start).valueOf();
  let endDate = new Date(end).valueOf();

  // If 'stop' filed is true, auction is inactive
  if (stopped) {
    return statuses.inactive;
  }
  // If 'realized' field is true, auction is realized
  else if (realized) {
    return statuses.realized;
  }
  // For other cases, we compare start and end date to each other/current date
  else {
    const currentDate = Date.now();
    // If start date is in the future, the auction is inactive
    if (startDate > Date.now()) {
      return statuses.inactive;
    }
    // If start date is in the past and end date in the future, the auction is active
    else if (startDate < currentDate && endDate > currentDate) {
      return statuses.active;
    }
    // If both, start and end dates have passed, the auction has finished
    else if (startDate < currentDate && endDate < currentDate) {
      return statuses.finished;
    }
  }
}
