import iziToast from 'izitoast';

import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const delay = Number(event.currentTarget.elements.delay.value);
  const state = event.currentTarget.elements.state.value;

  createPromise(delay, state)
    .then(delayMs => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delayMs}ms`,
        position: 'topRight',
      });
    })
    .catch(delayMs => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delayMs}ms`,
        position: 'topRight',
      });
    });

  form.reset();
}

function createPromise(delayMs, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delayMs);
      } else {
        reject(delayMs);
      }
    }, delayMs);
  });
}
