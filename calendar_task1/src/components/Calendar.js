import React, { useState, useEffect, useRef } from "react";
import "./Calendar.css";

const Calendar = () => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [currentMonth] = useState(new Date().getMonth());
  const [currentYear] = useState(new Date().getFullYear());
  const [clickCount, setClickCount] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const calendarRef = useRef(null);
  const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

  const firstDayOfMonth = (month, year) => {
    let firstDay = new Date(year, month, 1).getDay();
    firstDay = (firstDay === 0 ? 7 : firstDay) - 1;
    return firstDay;
  };

  const renderDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = firstDayOfMonth(currentMonth, currentYear);
    const prevMonthTotalDays = daysInMonth(currentMonth - 1, currentYear);
    let days = [];
    let dayCount = 0;
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      const date = new Date(
        currentYear,
        currentMonth - 1,
        prevMonthTotalDays - i
      );
      days.push(
        <button
          key={`prev-${i}`}
          className={`day non-current-month disabled`}
          onClick={() => handleDayClick(date)}
          disabled={true}
        >
          {prevMonthTotalDays - i}日
        </button>
      );
      dayCount++;
    }
    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const date = new Date(currentYear, currentMonth, d);
      const isSelected = selectedDates.some((selectedDate) =>
        isSameDate(date, selectedDate)
      );
      const isStart = startDate && isSameDate(date, startDate);
      const isBetween =
        startDate &&
        date > startDate &&
        date < selectedDates[selectedDates.length - 1];
      const isDisabled = isNonCurrentMonth(date);
      const isToday = isSameDate(date, new Date());
      days.push(
        <button
          key={d}
          className={`day ${isSelected ? "selected" : ""} ${
            isStart ? "start" : ""
          } ${isBetween ? "between" : ""} ${isDisabled ? "disabled" : ""} ${
            isToday ? "today" : ""
          }`}
          onClick={() => handleDayClick(date)}
          disabled={isDisabled}
        >
          {d}日
        </button>
      );
      dayCount++;
    }
    // Next month days
    const remainingDays = 35 - dayCount;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(currentYear, currentMonth + 1, i);
      days.push(
        <button
          key={`next-${i}`}
          className={`day non-current-month disabled`}
          onClick={() => handleDayClick(date)}
          disabled={true}
        >
          {i}日
        </button>
      );
    }
    // Remove extra days in last row
    while (days.length > 35) {
      days.pop();
    }
    return days;
  };

  const handleDayClick = (date) => {
    if (clickCount === 0) {
      setSelectedDates([date]);
      setStartDate(date);
      setClickCount(1);
    } else if (clickCount === 1) {
      if (date < startDate) {
        setSelectedDates([date, startDate]);
        setStartDate(date);
      } else {
        const selectedRange = getDatesInRange(startDate, date);
        setSelectedDates(selectedRange);
      }
      setClickCount(0);
    }
  };

  const getDatesInRange = (start, end) => {
    let dates = [];
    let currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const isSameDate = (date1, date2) => {
    return (
      date1 &&
      date2 &&
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const isNonCurrentMonth = (date) => {
    return date.getMonth() !== currentMonth;
  };

  const handleOutsideClick = (event) => {
    if (calendarRef.current && !calendarRef.current.contains(event.target)) {
      setSelectedDates([]);
      setStartDate(null);
      setClickCount(0);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="calendar" ref={calendarRef}>
      <div className="header">
        <button className="monthSelect">
          &lt;
        </button>
        <span>{`${currentYear}年${currentMonth + 1}月`}</span>
        <button className="monthSelect">
          &gt;
        </button>
      </div>
      <div className="days-grid">{renderDays()}</div>
    </div>
  );
};

export default Calendar;
