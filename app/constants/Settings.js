export const MAX_HEIGHT = 214;
export const MIN_HEIGHT = 122;

export const MIN_AGE_RANGE = 18;
export const MAX_AGE_RANGE = 60;

export const MIN_DISTANCE_RANGE = 1;
export const MAX_DISTANCE_RANGE = 100;

export const MAX_IMAGES = 9;

export const MAX_TEST_QUESTIONS = 3;

export const GENDER = [{
  label: 'Male',
  value: 1,
}, {
  label: 'Female',
  value: 2,
}];

export const ORIENTATION = [{
  label: 'Straight',
  value: 2,
}, {
  label: 'Gay',
  value: 3,
}, {
  label: 'Bisexual',
  value: 4,
}, {
  label: 'Prefer not to say',
  value: 1,
}];

export const GENDER_IDENTITY = [{
  label: 'Transgender',
  value: 'Transgender',
}];

export const LOOKING_FOR = [{
  label: 'Friendship',
  value: 3,
}, {
  label: 'Dating',
  value: 4,
}, {
  label: 'Something serious',
  value: 5,
}];


export const GENDER_CHOICE = [{
  label: 'Boy',
  value: 1,
}, {
  label: 'Girl',
  value: 2,
}];

export const SORTABLES = [{
  value: {
    property: 'distance',
    direction: 'ASC',
  },
  label: 'Nearest',
}, {
  value: {
    property: 'createdDate',
    direction: 'DESC',
  },
  label: 'Most recently joined',
}];

export const REPORT_REASONS = [{
  label: 'Bad behaviour',
  value: 1,
}, {
  label: 'Inappropriate photos',
  value: 2,
}, {
  label: 'Unauthorised use of photos',
  value: 3,
}, {
  label: 'Fake profile',
  value: 4,
}, {
  label: 'Scam',
  value: 5,
}, {
  label: 'Underage',
  value: 6,
}];

export const NOTIFICATION_TYPES = [{
  value: 'recommendations',
  label: 'Daily recommendations notifications',
}/* uncomment to allow users to toggle other recommendations, {
  value: 'other',
  label: 'Other notifications',
}*/];
