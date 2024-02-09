"use strict";

const form = document.querySelector(".form");
const dayInput = document.getElementById("day");
const monthInput = document.getElementById("month");
const yearInput = document.getElementById("year");
const ageOverview = document.querySelector(".age-overview");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent the default behavior of a form that reloads the page when a form is submitted

  let hasEmptyField = false;

  if (dayInput.value === "") {
    dayInput.closest(".input-wrapper").classList.remove("error-invalid");
    dayInput.closest(".input-wrapper").classList.add("error-required");
    focus(dayInput);
    hasEmptyField = true;
    resetAgeOverview();
  } else {
    dayInput.closest(".input-wrapper").classList.remove("error-required");
  }

  if (monthInput.value === "") {
    monthInput.closest(".input-wrapper").classList.remove("error-invalid");
    monthInput.closest(".input-wrapper").classList.add("error-required");
    focus(monthInput);
    hasEmptyField = true;
    resetAgeOverview();
  } else {
    monthInput.closest(".input-wrapper").classList.remove("error-required");
  }

  if (yearInput.value === "") {
    yearInput.closest(".input-wrapper").classList.remove("error-invalid");
    yearInput.closest(".input-wrapper").classList.add("error-required");
    focus(yearInput);
    hasEmptyField = true;
    resetAgeOverview();
  } else {
    yearInput.closest(".input-wrapper").classList.remove("error-required");
  }

  if (hasEmptyField) {
    return; // terminates the function if there is at least one empty field
  }

  //   Get input values
  const day = parseInt(dayInput.value);
  const month = parseInt(monthInput.value);
  const year = parseInt(yearInput.value);

  // Determine number of days in current month
  const daysInMonth = new Date(year, month, 0).getDate(); // to determine the number of days in the current month. JS represents months using zero-based indexing and so, the date constructor function when 0 is passed in as an argument for day to it, it returns the number of days that the previous month has in total.

  let hasInvalidInput = false;
  //   Validate input fields
  if (isNaN(day) || day < 1 || day > 31 || day > daysInMonth) {
    dayInput.closest(".input-wrapper").classList.add("error-invalid");
    dayInput.value = "";
    focus(dayInput);
    hasInvalidInput = true;
    resetAgeOverview();
  } else {
    dayInput.closest(".input-wrapper").classList.remove("error-invalid");
  }

  if (isNaN(month) || month < 1 || month > 12) {
    monthInput.closest(".input-wrapper").classList.add("error-invalid");
    monthInput.value = "";
    focus(monthInput);
    hasInvalidInput = true;
    resetAgeOverview();
  } else {
    monthInput.closest(".input-wrapper").classList.remove("error-invalid");
  }

  if (isNaN(year) || year < 1000) {
    yearInput.closest(".input-wrapper").classList.add("error-invalid");
    yearInput.value = "";
    focus(yearInput);
    hasInvalidInput = true;
    resetAgeOverview();
  } else {
    yearInput.closest(".input-wrapper").classList.remove("error-invalid");
  }

  // Checks for input validity
  if (hasInvalidInput) {
    return; // halts execution if any of the inputs are invalid
  }

  // Validation for future dates
  if (new Date(year, month - 1, day) > new Date()) {
    dayInput.closest(".input-wrapper").classList.add("error-past");
    monthInput.closest(".input-wrapper").classList.add("error-past");
    yearInput.closest(".input-wrapper").classList.add("error-past");
    resetAgeOverview();
    return;
  } else {
    dayInput.closest(".input-wrapper").classList.remove("error-past");
    monthInput.closest(".input-wrapper").classList.remove("error-past");
    yearInput.closest(".input-wrapper").classList.remove("error-past");
  }

  //   Additional validation i.e., checking for valid day / month ranges, future ranges, etc.
  // Calculate age & display
  // Calculate the remaining days after subtracting the years & months
  const currentDate = new Date();
  const birthDate = new Date(year, month - 1, day);
  const ageInMilliseconds = currentDate - birthDate;
  const ageInYears = ageInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  // ageInMilliseconds represents the difference of the current date and the birth date in timestamp (milliseconds) and is divided by the representation of one year i.e., 1000 milliseconds in one second, 60 seconds in one minute, 60 minutes in one hour, 24 hours in one day, 365.25 days in one year

  const wholeYears = Math.floor(ageInYears); // to obtain the integer of ageInYears

  // Months
  const remainingMonths = (ageInYears - wholeYears) * 12; // Multiplying the remainder of the ageInYears by 12 to get the remaining months
  const wholeMonths = Math.floor(remainingMonths);

  // Determine the number of days in the current month
  const nextMonthDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1
  );
  const lastDayCurrentMonth = new Date(nextMonthDate - 1).getDate();

  // Calculate remaining days in the current month
  const remainingDaysInCurrentMonth = Math.round(
    (remainingMonths - wholeMonths) * lastDayCurrentMonth
  );
  const wholeDaysInCurrentMonth = Math.floor(remainingDaysInCurrentMonth);

  let yearsCounter = 0;
  let monthsCounter = 0;
  let daysCounter = 0;

  let intervalDuration = 30;
  let maxYears = 100;

  const interval = setInterval(() => {
    // Increment years counter
    if (yearsCounter <= wholeYears) {
      document.querySelector(".age-years span").textContent = yearsCounter++;
    }
    // This basically checks to see that the yearsCounter is less than or equal to the age of the user and keeps increasing the age until the counter is at the age. So, it does all of this within 20 milliseconds to effect the animation and when the yearsCounter > wholeYears, the interval is cleared

    if (monthsCounter <= wholeMonths) {
      document.querySelector(".age-months span").textContent = monthsCounter++;
    }

    if (daysCounter <= wholeDaysInCurrentMonth) {
      document.querySelector(".age-days span").textContent = daysCounter++;
    }

    // Progress based on the current years counter and maximum years
    const progress = yearsCounter / maxYears;

    // Adjusting the interval duration based on the progress
    intervalDuration = 50 + (1 - progress) * 1;

    // Clear interval when counters reach their final values
    if (
      yearsCounter > wholeYears &&
      monthsCounter > wholeMonths &&
      daysCounter > wholeDaysInCurrentMonth
    ) {
      clearInterval(interval);
    }
  }, intervalDuration); // Adjust the interval duration for desired animation speed

  //   Display age in years, months & days
  ageOverview.innerHTML = `
        <p class="age age-years"><span>${wholeYears}</span> years</p>
        <p class="age age-months"><span>${wholeMonths}</span> months</p>
        <p class="age age-days"><span>${wholeDaysInCurrentMonth}</span> days</p>
  `;

  // Blur input fields (remove focus)
  dayInput.blur();
  monthInput.blur();
  yearInput.blur();
});

// function animateAges() {
//   const ages = document.querySelectorAll(".age");
//   ages.forEach((age) => (age.style.opacity = 1));
// }

function resetAgeOverview() {
  ageOverview.innerHTML = `
    <p class="age age-years"><span>- -</span> years</p>
    <p class="age age-months"><span>- -</span> months</p>
    <p class="age age-days"><span>- -</span> days</p>
  `;
}

function focus(input) {
  input.focus();
}

// function resetCalculator() {
//   dayInput
//     .closest(".input-wrapper")
//     .classList.remove("error-past, error-invalid, error-required");
//   monthInput
//     .closest(".input-wrapper")
//     .classList.remove("error-past,  error-invalid, error-required");
//   yearInput
//     .closest(".input-wrapper")
//     .classList.remove("error-past,  error-invalid, error-required");

//   // Clear input fields
//   dayInput.value = monthInput.value = yearInput.value = "";
// }

