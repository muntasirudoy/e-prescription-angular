// export const getDisableDate = (schedule: any[]) => {
//   const enableDayList = schedule
//     .map((item: any) =>
//       item.doctorScheduleDaySession.map((days: any) => days.scheduleDayofWeek)
//     )
//     .flat();

//   const dayToNumber = (days: any) => {
//     const daysOfWeek = [
//       'Sunday',
//       'Monday',
//       'Tuesday',
//       'Wednesday',
//       'Thursday',
//       'Friday',
//       'Saturday',
//     ];
//     return daysOfWeek.indexOf(days);
//   };
//   const days = [0, 1, 2, 3, 4, 5, 6];
//   const uniqueDaysAsNumbers = [...new Set(enableDayList)].map(dayToNumber);
//   let disabledDays = days.filter((day) => !uniqueDaysAsNumbers.includes(day));
//   return disabledDays;
// };

// export const dayFromDate = (date: string) => {
//   const getdate = new Date(date);
//   const dayOfWeek = getdate.getDay();
//   const dayNames = [
//     'Sunday',
//     'Monday',
//     'Tuesday',
//     'Wednesday',
//     'Thursday',
//     'Friday',
//     'Saturday',
//   ];
//   return dayNames[dayOfWeek];
// };

// export const max_min_Date = () => {
//   let minDate: Date;
//   let maxDate: Date;
//   const today = new Date();
//   const currentYear = today.getFullYear();
//   const currentMonth = today.getMonth();
//   const currentDate = today.getDate();
//   minDate = new Date(currentYear, currentMonth, currentDate);
//   const twoWeeksLater = new Date(today);
//   twoWeeksLater.setDate(today.getDate() + 30);
//   maxDate = twoWeeksLater;
//   return { minDate, maxDate };
// };
// export const dateFormater = (date: Date) => {
//   let formattedDate = date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'short',
//     day: '2-digit',
//   });
//   return formattedDate;
// };
export const getDisableDate = (schedule: any[]) => {
  const enableDayList = schedule
    .map((item: any) =>
      item.doctorScheduleDaySession.map((days: any) => days.scheduleDayofWeek)
    )
    .flat();

  const dayToNumber = (days: any) => {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek.indexOf(days);
  };

  const days = [0, 1, 2, 3, 4, 5, 6];
  const uniqueDaysAsNumbers = [...new Set(enableDayList)].map(dayToNumber);

  // Disabled days are those not in the schedule
  const disabledDays = days.filter((day) => !uniqueDaysAsNumbers.includes(day));

  return disabledDays;
};

export const max_min_Date = () => {
  let minDate: Date;
  let maxDate: Date;
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  minDate = new Date(currentYear, currentMonth, currentDate);
  const twoWeeksLater = new Date(today);
  twoWeeksLater.setDate(today.getDate() + 30);
  maxDate = twoWeeksLater;
  return { minDate, maxDate };
};

// Date formatter remains unchanged
export const dateFormater = (date: Date) => {
  let formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
  return formattedDate;
};
export const dayFromDate = (date: string) => {
  const getdate = new Date(date);
  const dayOfWeek = getdate.getDay();
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return dayNames[dayOfWeek];
};
