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

export const dateToString = (date) => {
  const day = date.getDate();
  const month = date.getMonth();

  return `${months[month]} ${day}`;
};
