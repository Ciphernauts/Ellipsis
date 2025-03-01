import React, { useState, useEffect, act } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './TimelineCalendar.module.css';
import ArrowIcon from '../components/icons/ArrowIcon';
import Button from '../components/Button';

// TimelineCalendar: Main component function.
// isPWA: Prop to determine if the component is used in a Progressive Web App.
// setPaneData: Function from context to set data in a parent component.
// calendarData: State to hold calendar data.
// currentDate: Current date object.
// month, year: State to track the current month and year.
// activeSelection: State to track the selected month or day.

export default function TimelineCalendar({ isPWA = false }) {
  const { setPaneData } = useOutletContext(); // Get setter from Layout
  const [calendarData, setCalendarData] = useState(null);

  const currentDate = new Date();
  const [month, setMonth] = useState(currentDate.getMonth());
  const [year, setYear] = useState(currentDate.getFullYear());

  const [activeSelection, setActiveSelection] = useState({
    month: isPWA ? null : month,
    day: null,
  });

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

  // Dynamically set handleFunctions based on activeSelection - Determines which navigation functions to use based on the active selection.
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

  // getMonthName: Returns the name of a month.
  // generateCalendarDays: Generates the days to display in the calendar.
  // isFutureMonth: Checks if a month is in the future.

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

  // handleMonthClick: Handles clicks on month names.
  // handleDayClick: Handles clicks on days.

  const handleMonthClick = (clickedMonth, isPrev = false, isNext = false) => {
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

    console.log('selected', clickedMonth);
    setActiveSelection({ month: clickedMonth, day: null });
  };

  const handleDayClick = (date) => {
    if (
      date.getFullYear() > currentDate.getFullYear() ||
      (date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() > currentDate.getMonth()) ||
      (date.getFullYear() === currentDate.getFullYear() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getDate() > currentDate.getDate())
    ) {
      console.log('Cannot select a future date:', date);
      return;
    }

    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

    console.log('selected ' + formattedDate);

    setActiveSelection({ month: null, day: formattedDate });
  };

  // Data Fetching and Effects
  // 
  // useEffect: Fetches placeholder data on mount and updates pane data when the active selection changes.

  // Placeholder data

  //  router.get('timeline/calendar/:month', controller.getStatsForMonth);

  useEffect(() => {
    const fetchedData = {
      month: {
        name: 'February',
        snapshots: [
          'https://i.postimg.cc/MK0CcsyR/Screenshot-2025-02-28-172929.png',
          'https://picsum.photos/300/200?random=2',
          'https://picsum.photos/300/200?random=3',
          'https://picsum.photos/300/200?random=4',
        ],
        safetyScore: 87.5, //avg of every compliance metric
        progress: '+6.5%', //from last month
        totalIncidents: 96, //1,1,0.5,0.5
        criticalIncidents: 1, //
        duration: {
          hours: 5,//
          minutes: 27,//
          seconds: 12,//
        },
        trends: [
          { date: '2025-02-01', score: 85.2 }, //
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
          scaffolding: 11.3, //
          guardrails: 23.1, //
          harness: 18.5, //
        },
        top3: {
          improvements: [
            {
              name: 'footwear',
              positive: true,
              value: 2.5,
            },
            {
              name: 'harness',
              positive: true,
              value: 1.5,
            },
            {
              name: 'scaffolding',
              positive: false,
              value: 1.3,
            },
          ],
          declinedMetrics: [
            {
              name: 'scaffolding',
              positive: false,
              value: 1.3,
            },
            {
              name: 'helmet',
              positive: false,
              value: 0.5,
            },
            {
              name: 'gloves',
              positive: false,
              value: 1.2,
            },
          ],
        },
      },
      days: [
        {
          date: '2025-02-01',
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
        },
        {
          date: '2025-02-02',
          safetyScore: 88,
          progress: '+4.7%',
          totalIncidents: 3,
          criticalIncidents: 0,
          duration: { hours: 7, minutes: 43, seconds: 12 },
          safetyScoreDistribution: {
            helmet: 15.0,
            footwear: 20.0,
            vest: 18.0,
            gloves: 14.0,
            scaffolding: 11.0,
            guardrails: 21.0,
            harness: 6.0,
          },
          top3: {
            improvements: [
              { name: 'vest', positive: true, value: 2.0 },
              { name: 'footwear', positive: true, value: 1.5 },
              { name: 'helmet', positive: true, value: 1.0 },
            ],
            declinedMetrics: [
              { name: 'scaffolding', positive: false, value: 0.5 },
              { name: 'harness', positive: false, value: 0.3 },
              { name: 'guardrails', positive: false, value: 0.4 },
            ],
          },
          trends: [
            { time: '3am', score: 86 },
            { time: '6am', score: 88 },
            { time: '9am', score: 90 },
            { time: '12pm', score: 89 },
            { time: '3pm', score: 87 },
            { time: '6pm', score: 88 },
            { time: '9pm', score: 90 },
          ],

          snapshots: [
            'https://picsum.photos/300/500?random=1',
            'https://picsum.photos/300/500?random=2',
            'https://picsum.photos/300/500?random=3',
            'https://picsum.photos/300/500?random=4',
          ],
        },
        {
          date: '2025-02-03',
          safetyScore: 90,
          progress: '+4.7%',
          totalIncidents: 1,
          criticalIncidents: 0,
          duration: { hours: 9, minutes: 5, seconds: 30 },
          safetyScoreDistribution: {
            helmet: 16.0,
            footwear: 21.0,
            vest: 19.0,
            gloves: 16.0,
            scaffolding: 12.0,
            guardrails: 20.0,
            harness: 7.0,
          },
          top3: {
            improvements: [
              { name: 'footwear', positive: true, value: 3.0 },
              { name: 'helmet', positive: true, value: 2.0 },
              { name: 'scaffolding', positive: false, value: 0.5 },
            ],
            declinedMetrics: [
              { name: 'gloves', positive: false, value: 0.4 },
              { name: 'guardrails', positive: false, value: 0.3 },
              { name: 'harness', positive: false, value: 0.2 },
            ],
          },
          trends: [
            { time: '3am', score: 89 },
            { time: '6am', score: 91 },
            { time: '9am', score: 90 },
            { time: '12pm', score: 92 },
            { time: '3pm', score: 91 },
            { time: '6pm', score: 90 },
            { time: '9pm', score: 92 },
          ],
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-04',
          safetyScore: 86,
          progress: '+4.7%',
          totalIncidents: 8,
          criticalIncidents: 1,
          duration: { hours: 7, minutes: 50, seconds: 10 },
          safetyScoreDistribution: {
            helmet: 14.5,
            footwear: 19.0,
            vest: 17.0,
            gloves: 13.0,
            scaffolding: 13.5,
            guardrails: 15.0,
            harness: 8.5,
          },
          top3: {
            improvements: [
              { name: 'vest', positive: true, value: 2.5 },
              { name: 'footwear', positive: true, value: 2.0 },
              { name: 'helmet', positive: false, value: 0.0 },
            ],
            declinedMetrics: [
              { name: 'scaffolding', positive: false, value: 0.5 },
              { name: 'guardrails', positive: false, value: 0.5 },
              { name: 'harness', positive: false, value: 0.2 },
            ],
          },
          trends: [
            { time: '3am', score: 85 },
            { time: '6am', score: 88 },
            { time: '9am', score: 87 },
            { time: '12pm', score: 89 },
            { time: '3pm', score: 88 },
            { time: '6pm', score: 90 },
            { time: '9pm', score: 91 },
          ],

          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-05',
          safetyScore: 89,
          progress: '+4.7%',
          totalIncidents: 5,
          criticalIncidents: 0,
          duration: { hours: 8, minutes: 0, seconds: 5 },
          safetyScoreDistribution: {
            helmet: 14.8,
            footwear: 22.5,
            vest: 18.0,
            gloves: 13.5,
            scaffolding: 10.0,
            guardrails: 19.2,
            harness: 8.0,
          },
          top3: {
            improvements: [
              { name: 'footwear', positive: true, value: 3.0 },
              { name: 'vest', positive: true, value: 2.0 },
              { name: 'helmet', positive: true, value: 1.5 },
            ],
            declinedMetrics: [
              { name: 'scaffolding', positive: false, value: 0.5 },
              { name: 'harness', positive: false, value: 0.3 },
              { name: 'guardrails', positive: false, value: 0.4 },
            ],
          },
          trends: [
            { time: '12am', score: 80 },
            { time: '1am', score: 82 },
            { time: '2am', score: 85 },
            { time: '3am', score: 83 },
            { time: '4am', score: 79 },
            { time: '5am', score: 80 },
            { time: '6am', score: 81 },
            { time: '7am', score: 82 },
            { time: '8am', score: 83 },
            { time: '9am', score: 82 },
            { time: '10am', score: 85 },
            { time: '11am', score: 86 },
            { time: '12pm', score: 84 },
            { time: '1pm', score: 85 },
            { time: '2pm', score: 84 },
            { time: '3pm', score: 83 },
            { time: '4pm', score: 81 },
            { time: '5pm', score: 82 },
            { time: '6pm', score: 80 },
            { time: '7pm', score: 79 },
            { time: '8pm', score: 81 },
          ],

          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-06',
          safetyScore: 83,
          progress: '+4.7%',
          totalIncidents: 20,
          criticalIncidents: 3,
          duration: {
            hours: 6,
            minutes: 50,
            seconds: 45,
          },
          safetyScoreDistribution: {
            helmet: 12.0,
            footwear: 18.5,
            vest: 21.0,
            gloves: 11.0,
            scaffolding: 14.5,
            guardrails: 19.5,
            harness: 7.5,
          },
          top3: {
            improvements: [
              {
                name: 'vest',
                positive: true,
                value: 4.5,
              },
              {
                name: 'guardrails',
                positive: true,
                value: 2.0,
              },
              {
                name: 'footwear',
                positive: false,
                value: 0.5,
              },
            ],
            declinedMetrics: [
              {
                name: 'helmet',
                positive: false,
                value: 1.0,
              },
              {
                name: 'scaffolding',
                positive: false,
                value: 0.5,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
            ],
          },
          trends: [
            { time: '12am', score: 85 },
            { time: '1am', score: 82 },
            { time: '2am', score: 83 },
            { time: '3am', score: 85 },
            { time: '4am', score: 81 },
            { time: '5am', score: 82 },
            { time: '6am', score: 80 },
            { time: '7am', score: 84 },
            { time: '8am', score: 86 },
            { time: '9am', score: 85 },
            { time: '10am', score: 87 },
            { time: '11am', score: 84 },
            { time: '12pm', score: 83 },
            { time: '1pm', score: 85 },
            { time: '2pm', score: 86 },
            { time: '3pm', score: 87 },
            { time: '4pm', score: 84 },
            { time: '5pm', score: 83 },
            { time: '6pm', score: 82 },
            { time: '7pm', score: 80 },
            { time: '8pm', score: 81 },
          ],

          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-07',
          safetyScore: 84,
          progress: '+4.7%',
          totalIncidents: 15,
          criticalIncidents: 2,
          duration: {
            hours: 7,
            minutes: 30,
            seconds: 10,
          },
          safetyScoreDistribution: {
            helmet: 14.3,
            footwear: 20.0,
            vest: 18.5,
            gloves: 14.5,
            scaffolding: 11.0,
            guardrails: 22.0,
            harness: 8.5,
          },
          top3: {
            improvements: [
              {
                name: 'guardrails',
                positive: true,
                value: 4.0,
              },
              {
                name: 'footwear',
                positive: true,
                value: 3.0,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
            ],
            declinedMetrics: [
              {
                name: 'helmet',
                positive: false,
                value: 1.0,
              },
              {
                name: 'scaffolding',
                positive: false,
                value: 0.5,
              },
              {
                name: 'vest',
                positive: false,
                value: 0.5,
              },
            ],
          },
          trends: [
            { time: '12am', score: 90 },
            { time: '1am', score: 92 },
            { time: '2am', score: 93 },
            { time: '3am', score: 94 },
            { time: '4am', score: 91 },
            { time: '5am', score: 89 },
            { time: '6am', score: 88 },
            { time: '7am', score: 91 },
            { time: '8am', score: 93 },
            { time: '9am', score: 95 },
            { time: '10am', score: 94 },
            { time: '11am', score: 92 },
            { time: '12pm', score: 91 },
            { time: '1pm', score: 92 },
            { time: '2pm', score: 90 },
            { time: '3pm', score: 92 },
            { time: '4pm', score: 91 },
            { time: '5pm', score: 90 },
            { time: '6pm', score: 92 },
            { time: '7pm', score: 93 },
            { time: '8pm', score: 94 },
          ],
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-08',
          safetyScore: 91,
          progress: '+4.7%',
          totalIncidents: 2,
          criticalIncidents: 0,
          duration: {
            hours: 8,
            minutes: 5,
            seconds: 20,
          },
          safetyScoreDistribution: {
            helmet: 18.0,
            footwear: 23.0,
            vest: 17.0,
            gloves: 14.0,
            scaffolding: 11.0,
            guardrails: 19.0,
            harness: 6.0,
          },
          top3: {
            improvements: [
              {
                name: 'footwear',
                positive: true,
                value: 5.0,
              },
              {
                name: 'helmet',
                positive: true,
                value: 3.0,
              },
              {
                name: 'scaffolding',
                positive: false,
                value: 1.0,
              },
            ],
            declinedMetrics: [
              {
                name: 'guardrails',
                positive: false,
                value: 1.0,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
              {
                name: 'vest',
                positive: false,
                value: 0.5,
              },
            ],
          },
          trends: [
            { time: '12am', score: 80 },
            { time: '1am', score: 82 },
            { time: '2am', score: 85 },
            { time: '3am', score: 83 },
            { time: '4am', score: 79 },
            { time: '5am', score: 80 },
            { time: '6am', score: 81 },
            { time: '7am', score: 82 },
            { time: '8am', score: 83 },
            { time: '9am', score: 82 },
            { time: '10am', score: 85 },
            { time: '11am', score: 86 },
            { time: '12pm', score: 84 },
            { time: '1pm', score: 85 },
            { time: '2pm', score: 84 },
            { time: '3pm', score: 83 },
            { time: '4pm', score: 81 },
            { time: '5pm', score: 82 },
            { time: '6pm', score: 80 },
            { time: '7pm', score: 79 },
            { time: '8pm', score: 81 },
          ],
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-09',
          safetyScore: 87,
          progress: '+4.7%',
          totalIncidents: 10,
          criticalIncidents: 1,
          duration: {
            hours: 7,
            minutes: 40,
            seconds: 5,
          },
          safetyScoreDistribution: {
            helmet: 15.0,
            footwear: 20.0,
            vest: 18.0,
            gloves: 14.0,
            scaffolding: 12.0,
            guardrails: 17.0,
            harness: 6.0,
          },
          top3: {
            improvements: [
              {
                name: 'vest',
                positive: true,
                value: 4.0,
              },
              {
                name: 'scaffolding',
                positive: true,
                value: 2.0,
              },
              {
                name: 'footwear',
                positive: false,
                value: 0.5,
              },
            ],
            declinedMetrics: [
              {
                name: 'helmet',
                positive: false,
                value: 0.5,
              },
              {
                name: 'guardrails',
                positive: false,
                value: 0.5,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
            ],
          },
          trends: [
            { time: '12am', score: 80 },
            { time: '1am', score: 82 },
            { time: '2am', score: 85 },
            { time: '3am', score: 83 },
            { time: '4am', score: 79 },
            { time: '5am', score: 80 },
            { time: '6am', score: 81 },
            { time: '7am', score: 82 },
            { time: '8am', score: 83 },
            { time: '9am', score: 82 },
            { time: '10am', score: 85 },
            { time: '11am', score: 86 },
            { time: '12pm', score: 84 },
            { time: '1pm', score: 85 },
            { time: '2pm', score: 84 },
            { time: '3pm', score: 83 },
            { time: '4pm', score: 81 },
            { time: '5pm', score: 82 },
            { time: '6pm', score: 80 },
            { time: '7pm', score: 79 },
            { time: '8pm', score: 81 },
          ],
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-10',
          safetyScore: 90,
          progress: '+4.7%',
          totalIncidents: 5,
          criticalIncidents: 1,
          duration: {
            hours: 6,
            minutes: 40,
            seconds: 20,
          },
          safetyScoreDistribution: {
            helmet: 19.0,
            footwear: 21.0,
            vest: 17.5,
            gloves: 14.0,
            scaffolding: 12.0,
            guardrails: 15.0,
            harness: 10.5,
          },
          top3: {
            improvements: [
              {
                name: 'helmet',
                positive: true,
                value: 3.0,
              },
              {
                name: 'footwear',
                positive: true,
                value: 2.0,
              },
              {
                name: 'scaffolding',
                positive: false,
                value: 1.0,
              },
            ],
            declinedMetrics: [
              {
                name: 'guardrails',
                positive: false,
                value: 1.0,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
              {
                name: 'vest',
                positive: false,
                value: 0.5,
              },
            ],
          },
          trends: [
            { time: '12am', score: 80 },
            { time: '1am', score: 82 },
            { time: '2am', score: 85 },
            { time: '3am', score: 83 },
            { time: '4am', score: 79 },
            { time: '5am', score: 80 },
            { time: '6am', score: 81 },
            { time: '7am', score: 82 },
            { time: '8am', score: 83 },
            { time: '9am', score: 82 },
            { time: '10am', score: 85 },
            { time: '11am', score: 86 },
            { time: '12pm', score: 84 },
            { time: '1pm', score: 85 },
            { time: '2pm', score: 84 },
            { time: '3pm', score: 83 },
            { time: '4pm', score: 81 },
            { time: '5pm', score: 82 },
            { time: '6pm', score: 80 },
            { time: '7pm', score: 79 },
            { time: '8pm', score: 81 },
          ],
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-11',
          safetyScore: 85,
          progress: '+4.7%',
          totalIncidents: 12,
          criticalIncidents: 2,
          duration: {
            hours: 7,
            minutes: 25,
            seconds: 15,
          },
          safetyScoreDistribution: {
            helmet: 17.0,
            footwear: 22.0,
            vest: 16.0,
            gloves: 13.5,
            scaffolding: 11.5,
            guardrails: 18.0,
            harness: 7.0,
          },
          top3: {
            improvements: [
              {
                name: 'footwear',
                positive: true,
                value: 3.0,
              },
              {
                name: 'helmet',
                positive: true,
                value: 2.0,
              },
              {
                name: 'scaffolding',
                positive: false,
                value: 1.0,
              },
            ],
            declinedMetrics: [
              {
                name: 'guardrails',
                positive: false,
                value: 0.5,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
              {
                name: 'vest',
                positive: false,
                value: 0.5,
              },
            ],
          },
          trends: [
            { time: '3am', score: 89 },
            { time: '6am', score: 91 },
            { time: '9am', score: 90 },
            { time: '12pm', score: 92 },
            { time: '3pm', score: 91 },
            { time: '6pm', score: 90 },
            { time: '9pm', score: 92 },
          ],
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-12',
          safetyScore: 88,
          progress: '+4.7%',
          totalIncidents: 8,
          criticalIncidents: 1,
          duration: {
            hours: 7,
            minutes: 50,
            seconds: 30,
          },
          safetyScoreDistribution: {
            helmet: 20.5,
            footwear: 19.0,
            vest: 15.0,
            gloves: 13.5,
            scaffolding: 12.0,
            guardrails: 14.5,
            harness: 7.5,
          },
          top3: {
            improvements: [
              {
                name: 'footwear',
                positive: true,
                value: 3.0,
              },
              {
                name: 'helmet',
                positive: true,
                value: 2.5,
              },
              {
                name: 'guardrails',
                positive: false,
                value: 0.5,
              },
            ],
            declinedMetrics: [
              {
                name: 'scaffolding',
                positive: false,
                value: 1.0,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
              {
                name: 'vest',
                positive: false,
                value: 0.5,
              },
            ],
          },
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
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
        {
          date: '2025-02-13',
          safetyScore: 93,
          progress: '+4.7%',
          totalIncidents: 3,
          criticalIncidents: 0,
          duration: {
            hours: 8,
            minutes: 10,
            seconds: 50,
          },
          safetyScoreDistribution: {
            helmet: 21.0,
            footwear: 24.0,
            vest: 17.0,
            gloves: 14.5,
            scaffolding: 11.0,
            guardrails: 18.0,
            harness: 8.5,
          },
          top3: {
            improvements: [
              {
                name: 'footwear',
                positive: true,
                value: 4.0,
              },
              {
                name: 'helmet',
                positive: true,
                value: 3.0,
              },
              {
                name: 'scaffolding',
                positive: false,
                value: 1.0,
              },
            ],
            declinedMetrics: [
              {
                name: 'guardrails',
                positive: false,
                value: 0.5,
              },
              {
                name: 'harness',
                positive: false,
                value: 0.5,
              },
              {
                name: 'vest',
                positive: false,
                value: 0.5,
              },
            ],
          },
          trends: [
            { time: '3am', score: 85 },
            { time: '6am', score: 88 },
            { time: '9am', score: 87 },
            { time: '12pm', score: 89 },
            { time: '3pm', score: 88 },
            { time: '6pm', score: 90 },
            { time: '9pm', score: 91 },
          ],
          snapshots: [
            'https://picsum.photos/300/200?random=1',
            'https://picsum.photos/300/200?random=2',
            'https://picsum.photos/300/200?random=3',
            'https://picsum.photos/300/200?random=4',
          ],
        },
      ],
    };
    setCalendarData(fetchedData);
  }, []);

  // FETCHING CODE DYNAMICALLY ABSED ON MONTH

  // useEffect(() => {
  //   if (!activeSelection || !activeSelection.month) return;

  //   const fetchDataForMonth = async () => {
  //     const fetchedData = await fetch(
  //       `/api/data?month=${activeSelection.month + 1}&year=${year}`
  //     )
  //       .then((res) => res.json())
  //       .catch((error) => console.log('Error fetching data:', error));

  //     setCalendarData(fetchedData);
  //   };

  //   fetchDataForMonth();
  // }, [activeSelection, year]);

  useEffect(() => {
    if (!activeSelection || !calendarData) return;

    let newData = null;

    if (activeSelection.month) {
      newData = { ...calendarData.month };
    } else if (activeSelection.day) {
      const selectedDay = calendarData.days.find(
        (day) => day.date === activeSelection.day
      );
      if (selectedDay) {
        newData = {
          ...selectedDay,
          name: new Date(selectedDay.date).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'long',
          }),
        };
      } else console.log('day not found');
    }

    if (newData) setPaneData({ ...newData, handleFunctions: handleFunctions });
  }, [activeSelection, calendarData]);

  // Render

  // Renders the calendar UI with month navigation, days of the week, and days grid.
  // isPWA: Adjusts the UI for Progressive Web App mode.
  // Button: Displays a button for month stats in PWA mode

  return (
    <div className={`${styles.timelineCalendar} ${isPWA ? styles.mobile : ''}`}>
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
