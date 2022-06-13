if (typeof Storage !== "undefined") {
  // Code for localStorage
  window.onload = (event) => {
    console.log("page is fully loaded");

    let paragraph = document.getElementById("innerMessage");
    let exitParagraph = document.getElementById("exitMessage");

    const bookingsInLocalStorage = JSON.parse(localStorage.getItem("bookings"));
    const slotsInLocalStorage = JSON.parse(localStorage.getItem("filledSlots"));
    let bookings;
    let filledSlots;

    //If local storage is empty, initialize an empty booking and filledSlots array
    if (bookingsInLocalStorage) {
      bookings = [...bookingsInLocalStorage];
      filledSlots = [...slotsInLocalStorage];
    } else {
      bookings = [];
      filledSlots = [];
    }

    window.localStorage.setItem("bookings", JSON.stringify(bookings));
    window.localStorage.setItem("filledSlots", JSON.stringify(filledSlots));

    document
      .getElementById("submit")
      .addEventListener("click", allocateParkingSpot);

    document
      .getElementById("exit")
      .addEventListener("click", payForParkingSpace);

    function allocateParkingSpot() {
      let slot = document.getElementById("slot").value;
      let carSize = document.getElementById("car-size").value;

      if (slotsInLocalStorage !== null && slotsInLocalStorage.includes(slot)) {
        console.log("error");
        paragraph.innerHTML =
          "This slot has been taken, please choose another one";
        throw new Error("This slot has been taken");
      }

      if (carSize == "big" && Number(slot) < 11) {
        console.log("error for size");
        paragraph.innerHTML = "Big cars can only be parked in slots 11 to 15";
        throw new Error("Car too big for slot taken");
      }

      // get the current time which would be the entry time
      const currentDate = new Date();
      const currentTime = currentDate.getTime() / 1000;

      // calculating the price dependent on slot
      let slotPrice;
      if (slot > 10) {
        slotPrice = 100;
      } else {
        slotPrice = 60;
      }

      // push the booking information to the array of booked slots
      bookings.push({
        slot: slot,
        price: slotPrice,
        carSize: carSize,
        entryTime: currentTime,
      });
      // set to local storage
      localStorage.setItem("bookings", JSON.stringify(bookings));

      // add slot to filledSlot array
      filledSlots.push(slot);
      localStorage.setItem("filledSlots", JSON.stringify(filledSlots));

      paragraph.innerHTML =
        "Your slot is now booked, you can proceed to park your car";

      // alert user and reload window
      alert(`The booking of park ${slot} is successful`);
      window.location.reload();
    }

    function payForParkingSpace() {
      let exitSlot = document.getElementById("exit-slot").value;
      let userBooking;

      if (
        slotsInLocalStorage !== null &&
        !slotsInLocalStorage.includes(exitSlot)
      ) {
        console.log("error");
        exitParagraph.innerHTML = "This slot has not been booked";
        throw new Error("This slot has not been booked");
      }

      // to retrieve bookings
      for (let i = 0; i < bookingsInLocalStorage.length; i++) {
        if (bookingsInLocalStorage[i].slot == exitSlot) {
          userBooking = bookingsInLocalStorage[i];
          bookingsInLocalStorage.splice(i, 1);
        }
      }

      // update the bookings in local storage
      localStorage.setItem("bookings", JSON.stringify(bookingsInLocalStorage));

      // to retrieve slots
      for (let i = 0; i < slotsInLocalStorage.length; i++) {
        if (slotsInLocalStorage[i] == exitSlot) {
          slotsInLocalStorage.splice(i, 1);
        }
      }

      // update the slots in local storage
      localStorage.setItem("filledSlots", JSON.stringify(slotsInLocalStorage));

      // calculate the time spent using the difference between entry time and now
      const entryTime = userBooking.entryTime;
      const exitDate = new Date();
      const exitTime = exitDate.getTime() / 1000;
      const timeSpent = exitTime - entryTime;

      // convert time into hour, minutes
      const sec = parseInt(timeSpent, 10); // convert value to number if it's string
      let hours = Math.floor(sec / 3600); // get hours
      let minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
      let seconds = sec - hours * 3600 - minutes * 60; //  get seconds
      // add 0 if value < 10; Example: 2 => 02
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      const formattedTime = hours + ":" + minutes + ":" + seconds;

      // calculate the total bills in case user spends above 30mins
      let totalBills;
      if (timeSpent <= 1800) {
        totalBills = userBooking.price;
      } else {
        totalBills = userBooking.price + hours * 15;
      }

      exitParagraph.innerHTML = `Your exit from park ${userBooking.slot} has been confirmed.
      The total time spent in the park is ${formattedTime}.
      Please proceed to make a payment of ${totalBills}$ to the cashier`;

      // alert user and reload window
      alert(
        `Your exit request from park ${userBooking.slot} has been confirmed 
        The total time spent in the park is ${formattedTime}.
      Please proceed to make a payment of ${totalBills}$ to the cashier`
      );
      window.location.reload();
    }
  };
} else {
  // No web storage Support.
}
