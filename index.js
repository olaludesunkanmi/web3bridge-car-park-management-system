if (typeof Storage !== "undefined") {
  // Code for localStorage
  window.onload = (event) => {
    console.log("page is fully loaded");

    let paragraph = document.getElementById("innerMessage");

    let carSize = document.getElementById("car-size").value;
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

    function allocateParkingSpot() {
      let slot = document.getElementById("slot").value;
      console.log("************", slotsInLocalStorage);
      console.log("Selected slot ==> ", slot);
      if (slotsInLocalStorage !== null && slotsInLocalStorage.includes(slot)) {
        console.log("error");
        paragraph.innerHTML =
          "This slot has been taken, please choose another one";
        throw new Error("This slot has been taken");
      }

      if (carSize == "BIG" && slot < 11) {
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
      alert("booking was successful!");
      window.location.reload();
    }
  };
} else {
  // No web storage Support.
}
