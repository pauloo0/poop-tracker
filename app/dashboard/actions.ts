'use server'

import { db } from '@/app/lib/firebase'
import { collection, query, where, getDocs } from 'firebase/firestore'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  parseISO,
  isAfter,
  isBefore,
} from 'date-fns'

function getMonthYearPoops(poopDates: string[]) {
  const currentDate = new Date()
  const poopMonthStart = format(startOfMonth(currentDate), 'yyyy-MM-dd')
  const poopMonthEnd = format(endOfMonth(currentDate), 'yyyy-MM-dd')
  const poopYearStart = format(startOfYear(currentDate), 'yyyy-MM-dd')
  const poopYearEnd = format(endOfYear(currentDate), 'yyyy-MM-dd')

  const month = poopDates.filter(
    (poopDate) =>
      isAfter(poopDate, poopMonthStart) && isBefore(poopDate, poopMonthEnd)
  ).length

  const year = poopDates.filter(
    (poopDate) =>
      isAfter(poopDate, poopYearStart) && isBefore(poopDate, poopYearEnd)
  ).length

  return { month, year }
}

function getDailyRecord(poopDates: string[]) {
  const poopLogsDates = poopDates.map((poopDate) =>
    format(poopDate, "MMM do',' yyyy")
  )

  const poopCounts: { date: string; count: number }[] = []
  poopLogsDates.forEach((poopDate) => {
    const tempPoop = poopLogsDates.filter((date) => date === poopDate)

    poopCounts.push({
      date: poopDate,
      count: tempPoop.length,
    })
  })

  poopCounts.sort((a, b) => b.count - a.count)

  return poopCounts[0]
}

function getStreaks(poopDates: string[]) {
  const uniqueDates = [...new Set(poopDates)]

  const today = format(new Date(), 'yyyy-MM-dd')
  const yesterday = format(addDays(today, -1), 'yyyy-MM-dd')

  let currentStreak = 0
  if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
    currentStreak = 1

    let expectedDate =
      uniqueDates[0] === today
        ? yesterday
        : format(addDays(parseISO(yesterday), -1), 'yyyy-MM-dd')

    for (let i = 1; i < uniqueDates.length; i++) {
      if (uniqueDates[i] === expectedDate) {
        currentStreak++
        expectedDate = format(addDays(parseISO(expectedDate), 1), 'yyyy-MM-dd')
      } else {
        break
      }
    }
  }

  let highestStreak = 0
  let highestStreakStart = ''
  let highestStreakEnd = ''
  let tempStreak = 1
  let streakStart = uniqueDates[uniqueDates.length - 1]
  let streakEnd = uniqueDates[uniqueDates.length - 1]

  for (let i = uniqueDates.length - 2; i >= 0; i--) {
    const currentDate = uniqueDates[i]
    const previousDate = uniqueDates[i + 1]

    const expectedNextDay = format(
      addDays(parseISO(previousDate), 1),
      'yyyy-MM-dd'
    )

    if (currentDate === expectedNextDay) {
      tempStreak++
      streakEnd = currentDate
    } else {
      // Streak is broken
      if (tempStreak > highestStreak) {
        highestStreak = tempStreak
        highestStreakStart = streakStart
        highestStreakEnd = streakEnd
      }

      // Start a new streak
      tempStreak = 1
      streakStart = currentDate
      streakEnd = currentDate
    }
  }

  // Check if the last streak is the highest
  if (tempStreak > highestStreak) {
    highestStreak = tempStreak
    highestStreakStart = streakStart
    highestStreakEnd = streakEnd
  }

  // If current streak is higher than the recorded highest streak
  if (currentStreak > highestStreak) {
    highestStreak = currentStreak
    highestStreakEnd = uniqueDates[0]
    highestStreakStart = format(
      addDays(parseISO(uniqueDates[0]), -(currentStreak - 1)),
      'yyyy-MM-dd'
    )
  }

  return {
    current: currentStreak,
    highest: highestStreak,
    highestDate: `From ${format(
      highestStreakStart,
      "MMM do',' yyyy"
    )} to ${format(highestStreakEnd, "MMM do',' yyyy")}`,
  }
}

export async function getDashboardData(userId: string) {
  if (!userId) throw new Error('UserID not provided.')

  try {
    const qry = query(collection(db, 'poopLogs'), where('userId', '==', userId))

    const querySnapshot = await getDocs(qry)
    const poopLogs = querySnapshot.docs
      .map((doc) => {
        const data = doc.data()
        return format(data.date, 'yyyy-MM-dd')
      })
      .sort((a, b) => {
        const dateA = parseISO(a).getTime()
        const dateB = parseISO(b).getTime()

        return dateB - dateA
      })

    if (poopLogs.length === 0) {
      return {
        success: false,
        data: {
          monthlyPoops: 0,
          yearlyPoops: 0,
          dailyRecord: 0,
          dailyRecordDate: '',
          currentStreak: 0,
          highestStreak: 0,
          highestStreakDate: '',
        },
      }
    }

    const monthAndYearPoops = getMonthYearPoops(poopLogs)
    const dailyRecord = getDailyRecord(poopLogs)
    const streaks = getStreaks(poopLogs)

    return {
      success: true,
      data: {
        monthlyPoops: monthAndYearPoops.month,
        yearlyPoops: monthAndYearPoops.year,
        dailyRecord: dailyRecord.count,
        dailyRecordDate: dailyRecord.date,
        currentStreak: streaks.current,
        highestStreak: streaks.highest,
        highestStreakDate: streaks.highestDate,
      },
    }
  } catch (error) {
    console.error('Error on getCurrentStreak: ', error)
    throw error
  }
}
