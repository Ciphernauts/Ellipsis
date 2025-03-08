import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './TimelineCalendar.module.css';
import ArrowIcon from '../components/icons/ArrowIcon';
import Button from '../components/Button';
import axios from 'axios';

export default function TimelineCalendar({ isPWA = false }) {
  const { setPaneData } = useOutletContext();
  const [calendarData, setCalendarData] = useState(null);

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const [activeSelection, setActiveSelection] = useState({
    month: isPWA ? null : month,
    day: null,
  });

  // Placeholder data for a month
  const monthPlaceholderData = {
    name: 'March',
    safetyScore: 87.5,
    progress: '+6.5%',
    totalIncidents: 96,
    criticalIncidents: 1,
    duration: { hours: 5, minutes: 27, seconds: 12 },
    trends: [
      { date: '2025-02-01', score: 85.2 },
      { date: '2025-02-02', score: 86.5 },
      { date: '2025-02-03', score: 84.3 },
      { date: '2025-02-04', score: 85.7 },
      { date: '2025-02-05', score: 87.9 },
      { date: '2025-02-06', score: 86.2 },
      { date: '2025-02-07', score: 88.1 },
      { date: '2025-02-08', score: 87.3 },
      { date: '2025-02-09', score: 85.9 },
      { date: '2025-02-10', score: 86.8 },
      { date: '2025-02-11', score: 88.0 },
      { date: '2025-02-12', score: 84.7 },
      { date: '2025-02-13', score: 87.5 },
    ],
    safetyScoreDistribution: {
      helmet: 14.1,
      footwear: 22.9,
      vest: 16.2,
      gloves: 12.4,
      scaffolding: 11.3,
      guardrails: 23.1,
      harness: 18.5,
    },
    top3: {
      improvements: [
        { name: 'footwear', positive: true, value: 2.5 },
        { name: 'harness', positive: true, value: 1.5 },
        { name: 'scaffolding', positive: false, value: 1.3 },
      ],
      declinedMetrics: [
        { name: 'scaffolding', positive: false, value: 1.3 },
        { name: 'helmet', positive: false, value: 0.5 },
        { name: 'gloves', positive: false, value: 1.2 },
      ],
    },
  };

  // Placeholder data for a single day
  const dayPlaceholderData = {
    date: '2025-03-01',
    safetyScore: 85,
    progress: '+4.7%',
    totalIncidents: 12,
    criticalIncidents: 1,
    duration: { hours: 8, minutes: 15, seconds: 40 },
    safetyScoreDistribution: {
      helmet: 13.0,
      footwear: 18.0,
      vest: 20.0,
      gloves: 15.0,
      scaffolding: 12.5,
      guardrails: 14.0,
      harness: 7.5,
    },
    top3: {
      improvements: [
        { name: 'vest', positive: true, value: 4.0 },
        { name: 'footwear', positive: true, value: 2.0 },
        { name: 'helmet', positive: false, value: 0.0 },
      ],
      declinedMetrics: [
        { name: 'scaffolding', positive: false, value: 0.5 },
        { name: 'harness', positive: false, value: 0.5 },
        { name: 'guardrails', positive: false, value: 0.4 },
      ],
    },
    trends: [
      { time: '3am', score: 85 },
      { time: '6am', score: 86 },
      { time: '9am', score: 84 },
      { time: '12pm', score: 85 },
      { time: '3pm', score: 83 },
      { time: '6pm', score: 86 },
      { time: '9pm', score: 87 },
    ],
    snapshots: [
      'https://picsum.photos/400/300?random=1',
      'https://picsum.photos/400/300?random=2',
      'https://picsum.photos/400/300?random=3',
      'https://picsum.photos/400/300?random=4',
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!isPWA) {
        try {
          const monthData = await fetchMonthData(month, year);
          setPaneData(monthData.month_data);
        } catch (error) {
          console.error('Error fetching month data:', error);
        }
      }
    };

    fetchData();
  }, [isPWA]);

  // Navigation Handlers - Functions to navigate between months and days.

  const handlePrev = () => {
    const newMonth = month - 1;
    if (newMonth < 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(newMonth);
    }
  };

  const handleNext = () => {
    const newMonth = month + 1;
    if (newMonth > 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(newMonth);
    }
  };

  const handleDayNext = () => {
    if (!activeSelection.day) return;

    const currentDate = new Date(activeSelection.day);
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);

    const formattedDate = `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${nextDate.getDate().toString().padStart(2, '0')}`;

    setActiveSelection({ month: null, day: formattedDate });
  };

  const handleDayPrev = () => {
    if (!activeSelection.day) return;

    const currentDate = new Date(activeSelection.day);
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);

    const formattedDate = `${prevDate.getFullYear()}-${(prevDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${prevDate.getDate().toString().padStart(2, '0')}`;

    setActiveSelection({ month: null, day: formattedDate });
  };

  // Dynamically set handleFunctions based on activeSelection
  const handleFunctions = activeSelection.day
    ? {
        next: handleDayNext,
        prev: handleDayPrev,
      }
    : {
        next: () => {
          handleNext();
          handleMonthClick((month + 1) % 12, false, true);
        },
        prev: () => {
          handlePrev();
          handleMonthClick((month - 1 + 12) % 12, true);
        },
      };

  const getMonthName = (m) => {
    return new Date(year, m, 1).toLocaleString('default', { month: 'long' });
  };

  // Utility Functions

  const generateCalendarDays = () => {
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 (Sunday) - 6 (Saturday)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Total days in current month
    const daysInPrevMonth = new Date(year, month, 0).getDate(); // Total days in previous month

    const startDay = (firstDayOfMonth - 1 + 7) % 7; // Convert Sunday (0) to last position
    let days = [];

    // Previous month trailing days
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: daysInPrevMonth - i,
        currentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
      });
    }

    // Next month leading days
    while (days.length % 7 !== 0) {
      days.push({
        day: days.length - (startDay + daysInMonth) + 1,
        currentMonth: false,
      });
    }

    // Determine if 5 rows are sufficient
    const totalRows = days.length / 7;
    if (totalRows === 6) {
      const lastRow = days.slice(-7);
      const hasOnlyNextMonth = lastRow.every((day) => !day.currentMonth);
      if (hasOnlyNextMonth) {
        days = days.slice(0, -7); // Trim to 5 rows
      }
    }

    return days;
  };

  const isFutureMonth = (clickedMonth, targetYear) => {
    return (
      targetYear > currentDate.getFullYear() ||
      (targetYear === currentDate.getFullYear() &&
        clickedMonth > currentDate.getMonth())
    );
  };

  // Event Handlers

  // Fetch month data
  const fetchMonthData = async (month, year) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/timeline/calendar/month/${month + 1}/${year}`
      );
      if (response.data) {
        return response.data;
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Error fetching month data:', error);
      return monthPlaceholderData;
    }
  };

  // Fetch day data
  const fetchDayData = async (day, month, year) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/timeline/calendar/day/${day}/${month + 1}/${year}`
      );
      if (response.data) {
        return response.data; // Return fetched day data
      } else {
        throw new Error('No data returned from API');
      }
    } catch (error) {
      console.error('Error fetching day data:', error);
      // Fallback to day placeholder data
      return dayPlaceholderData;
    }
  };

  // Handle month click
  const handleMonthClick = async (
    clickedMonth,
    isPrev = false,
    isNext = false
  ) => {
    const targetYear =
      isPrev && clickedMonth === 11
        ? year - 1
        : isNext && clickedMonth === 0
          ? year + 1
          : year;

    if (isFutureMonth(clickedMonth, targetYear)) {
      console.log('Cannot select a future month:', clickedMonth);
      return;
    }

    if (activeSelection.month === clickedMonth && activeSelection.day === null)
      return;

    // Fetch month data
    const monthData = await fetchMonthData(clickedMonth, targetYear);

    // Update activeSelection and pane data
    setActiveSelection({ month: clickedMonth, day: null });
    setPaneData(monthData.month_data);
  };

  // Handle day click
  const handleDayClick = async (date) => {
    if (date > currentDate) {
      console.log('Cannot select a future date:', date);
      return;
    }

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    if (activeSelection.day === formattedDate) return;

    // Fetch day data
    const dayData = await fetchDayData(
      date.getDate(),
      date.getMonth(),
      date.getFullYear()
    );

    // Update activeSelection and pane data
    setActiveSelection({ month: null, day: formattedDate });
    setPaneData({
      ...dayData.day_data,
      name: new Date(dayData.day_data.date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
      }),
      handleFunctions: handleFunctions,
    });
  };

  // Render

  // Renders the calendar UI with month navigation, days of the week, and days grid.
  // isPWA: Adjusts the UI for Progressive Web App mode.
  // Button: Displays a button for month stats in PWA mode

  return (
    <div className={`${styles.timelineCalendar} ${isPWA ? styles.mobile : ''}`}>
      {/* {loading && <div className={styles.loadingOverlay}>Loading...</div>} */}
      <h1>Calendar</h1>
      <div className={styles.calendarContent}>
        <div className={styles.monthSelector}>
          <div className={styles.year}>{year}</div>
          <div className={styles.months}>
            <button onClick={handlePrev} className={styles.arrowButton}>
              <ArrowIcon className={styles.prevArrow} />
            </button>

            {!isPWA && (
              <span
                className={`${styles.month} ${!isPWA && activeSelection.month === (month - 1 + 12) % 12 ? styles.active : ''}`}
                onClick={() => {
                  handlePrev();
                  !isPWA && handleMonthClick((month - 1 + 12) % 12, true);
                }}
              >
                {getMonthName((month - 1 + 12) % 12)}
              </span>
            )}

            <span
              className={`${styles.month} ${styles.selected} ${!isPWA && activeSelection.month === month ? styles.active : ''}`}
              onClick={() => !isPWA && handleMonthClick((month + 12) % 12)}
            >
              {getMonthName(month)}
            </span>

            {!isPWA && (
              <span
                className={`${styles.month} ${!isPWA && activeSelection.month === (month + 1) % 12 ? styles.active : ''}`}
                onClick={() => {
                  handleNext();
                  !isPWA && handleMonthClick((month + 1) % 12, false, true);
                }}
              >
                {getMonthName((month + 1) % 12)}
              </span>
            )}

            <button onClick={handleNext} className={styles.arrowButton}>
              <ArrowIcon />
            </button>
          </div>
        </div>

        {/* Days of the Week */}
        <div className={styles.daysOfWeek}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>

        {/* Days Grid */}
        <div className={styles.days}>
          {generateCalendarDays().map((date, index) => (
            <span
              key={index}
              className={`${styles.day} ${
                date.currentMonth ? styles.currentMonth : styles.otherMonth
              } ${
                date.currentMonth &&
                date.day === currentDate.getDate() &&
                month === currentDate.getMonth() &&
                year === currentDate.getFullYear()
                  ? styles.today
                  : ''
              } ${
                (date.currentMonth &&
                  date.day > currentDate.getDate() &&
                  month === currentDate.getMonth() &&
                  year === currentDate.getFullYear()) ||
                (month > currentDate.getMonth() &&
                  year === currentDate.getFullYear()) ||
                year > currentDate.getFullYear()
                  ? styles.yet
                  : ''
              } ${
                !isPWA &&
                activeSelection.day ===
                  `${year}-${(month + 1).toString().padStart(2, '0')}-${date.day
                    .toString()
                    .padStart(2, '0')}`
                  ? styles.active
                  : ''
              }`}
              onClick={() => handleDayClick(new Date(year, month, date.day))}
            >
              {date.day}
            </span>
          ))}
        </div>
      </div>
      {isPWA && (
        <Button
          text='Month Stats'
          icon2={<ArrowIcon />}
          onClick={() => handleMonthClick((month + 12) % 12)}
          className={styles.monthStats}
        />
      )}
    </div>
  );
}
