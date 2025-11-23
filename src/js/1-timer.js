import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  input: document.querySelector('#datetime-picker'),
  btnStart: document.querySelector('[data-start]'),
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

refs.btnStart.disabled = true;

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    const selected = selectedDates[0];
    const now = new Date();

    if (selected <= now) {
      refs.btnStart.disabled = true;

      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      return;
    }

    userSelectedDate = selected;
    refs.btnStart.disabled = false;
  },
};

flatpickr('#datetime-picker', options);

refs.btnStart.addEventListener('click', () => {
  if (!userSelectedDate) return;

  refs.btnStart.disabled = true;
  refs.input.disabled = true;

  timerId = setInterval(() => {
    const now = new Date();
    const diff = userSelectedDate.getTime() - now.getTime();

    if (diff <= 0) {
      clearInterval(timerId);
      updateTimerUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });

      refs.input.disabled = false;
      return;
    }

    const time = convertMs(diff);
    updateTimerUI(time);
  }, 1000);
});

function updateTimerUI({ days, hours, minutes, seconds }) {
  refs.days.textContent = String(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
