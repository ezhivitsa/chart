const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const days = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

export const dateToString = (date) => {
  const dateTime = date instanceof Date ? date : new Date(date);

  const day = dateTime.getDate();
  const month = dateTime.getMonth();

  return `${months[month]} ${day}`;
};

export const dateToInfoString = (date) => {
  const dateTime = date instanceof Date ? date : new Date(date);

  const dayOfWeek = dateTime.getDay();
  const day = dateTime.getDate();
  const month = dateTime.getMonth();

  return `${days[dayOfWeek]}, ${months[month]} ${day}`;
};
