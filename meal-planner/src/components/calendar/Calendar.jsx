import "./Calendar.css";
export default function Calendar() {
  const date = new Date();
  const currentDay = date.getDay();
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  console.log(currentDay);
  return (
    <div className="calendar-container">
      {days.map((day, index) => (
        // id corresponds to current day # (1-7)
        <div key={index}>
          <div
            style={index + 1 === currentDay ? { backgroundColor: "green" } : {}}
            key={index}
          >
            {day}
          </div>
          <div className="day-info">Meal INFO</div>
        </div>
      ))}
    </div>
  );
}
