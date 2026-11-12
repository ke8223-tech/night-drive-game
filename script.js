
const startButton = document.getElementById("start-button");

const carButtons = document.querySelectorAll(".car-selection button");

let selectedCar = "BLUE RACER";

carButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCar = button.textContent;

        carButtons.forEach(car => {
            car.style.background = "transparent";
            car.style.color = "#28eaff";
        });

        button.style.background = "#28eaff";
        button.style.color = "#080817";
    });
});

startButton.addEventListener("click", () => {
    alert("Get ready! " + selectedCar + " is entering NIGHT DRIVE!");
});
