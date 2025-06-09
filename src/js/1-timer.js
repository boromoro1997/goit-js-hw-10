// Описаний в документації
import flatpickr from "flatpickr";
// Додатковий імпорт стилів
import "flatpickr/dist/flatpickr.min.css";
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

let timepicked = null;
const btn = document.querySelector("[data-start]");
const input = document.querySelector('#datetime-picker');
btn.disabled = true;
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        console.log(selectedDates[0]);
       
        timepicked = selectedDates[0];
        const dateNow = new Date();
        if (timepicked < dateNow) {
           btn.disabled = true;
           return iziToast.show({
            message: 'Please choose a date in the future',
            backgroundColor: 'red',
            messageColor: 'white',
            position: 'topRight',
            messageSize:'500px'
        });
        }
        btn.disabled = false;
    },
};
class Timer {
    constructor({onTick}) {
        this.onTick = onTick;
    }
    addLeadingZero(value) {
        return String(value).padStart(2, "0");
    }
    convertMs(ms) {
        const second = 1000;
        const minute = second * 60;
        const hour = minute * 60;
        const day = hour * 24;
        const days = this.addLeadingZero(Math.floor(ms / day));
        const hours =this.addLeadingZero(Math.floor((ms % day) / hour));
        const minutes = this.addLeadingZero(Math.floor(((ms % day) % hour) / minute));
        const seconds =this.addLeadingZero( Math.floor((((ms % day) % hour) % minute) / second));
        return { days, hours, minutes, seconds };
    }
    // countDown() {
    //     const time = Date.now();
    //     timepicked = timepicked.getTime() - time;
    //     btn.disabled = true;
    //     input.disabled = true;
    //     const intervalID = setInterval(() => {
    //         const currentTime = Date.now();
    //         const timePast = currentTime - time;
    //         const timeLeft = this.convertMs(timepicked - timePast);
    //         console.log(typeof timePast);
    //         this.onTick(timeLeft);
    //         if (timepicked - timePast === 0 ||timepicked - timePast<0) {
    //             clearInterval(intervalID);
    //             this.onTick({
    //                 days: "00",
    //                 hours: "00",
    //                 minutes: "00",
    //                 seconds:"00"
    //             })
    //             input.disabled = false;
    //         }
    //     }, 1000)
    // }
    countDown() {
        const targetTime = timepicked.getTime();
        const startTime = Date.now();
        const duration = targetTime - startTime;
        if (duration <= 0) {
            this.onTick({
                days: "00",
                hours: "00",
                minutes: "00",
                seconds: "00"
            });
            return;
        }
        btn.disabled = true;
        input.disabled = true;
        const intervalID = setInterval(() => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;
            const remaining = duration - elapsed;
            if (remaining <= 0) {
                clearInterval(intervalID);
                this.onTick({
                    days: "00",
                    hours: "00",
                    minutes: "00",
                    seconds: "00"
                });
                input.disabled = false;
                return;
            }
            const timeLeft = this.convertMs(remaining);
            this.onTick(timeLeft);
        }, 1000);
    }
    
}
const timerElements = {
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
  };
function update({ days, hours, minutes, seconds }) {
    timerElements.days.textContent =`${days}`;
    timerElements.hours.textContent =`${hours}`;
    timerElements.minutes.textContent =`${minutes}`;
    timerElements.seconds.textContent =`${seconds}`;
}
const newTimer = new Timer({onTick:update});
 
flatpickr("#datetime-picker", options);
btn.addEventListener("click", newTimer.countDown.bind(newTimer));
