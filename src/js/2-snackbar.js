// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";
const form = document.querySelector(".form");
form.addEventListener("submit", submitHandler);
function submitHandler(e) {
    e.preventDefault();
    const { delay, state } = e.target.elements;
    const delayValue = +delay.value;
    const stateValue = state.value;
    console.log(stateValue);
    setTimeout(() => {
        console.log("wdawdawdawd");
        new Promise((resolve, reject) => {
            if (stateValue === "fulfilled") {
                resolve(delayValue);
            } else {
                reject(stateValue);
            }
        })
        .then((data) => {
            iziToast.show({
                message: `✅ Fulfilled promise in ${data}ms`,
                backgroundColor: 'green',
                messageColor: 'white',
                position: 'topRight',
                messageSize:'500px'
            })
        })
        .catch((error) => {
            iziToast.show({
                message: `❌ Rejected promise in ${error}ms`,
                backgroundColor: 'red',
                messageColor: 'white',
                position: 'topRight',
                messageSize:'500px'
                })
        })
    }, delayValue)
    form.reset();
}