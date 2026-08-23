
const API_URL =
   "https://script.google.com/macros/s/AKfycbwh9SrPP-vuoUV7boF9Wbmtxk81EJa7HmxB01_btbKRZbxzvD_uHh4OHDmfxqv7rOFo/exec";


const form = document.getElementById("gpsForm");

const statusBox =
    document.getElementById("status");

const button =
    form.querySelector("button");


form.addEventListener("submit", function(event) {

    event.preventDefault();


    showStatus(
        "TEST: formulier werkt. GPS wordt aangevraagd...",
        "loading"
    );


    if (!navigator.geolocation) {

        showStatus(
            "Deze browser ondersteunt geen GPS.",
            "error"
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            showStatus(
                "GPS gevonden: " +
                latitude +
                ", " +
                longitude,
                "success"
            );


            console.log(
                "GPS:",
                latitude,
                longitude
            );

        },


        function(error) {

            showStatus(
                "GPS FOUT: " +
                error.message +
                " (code " +
                error.code +
                ")",
                "error"
            );


            console.error(
                "GPS fout:",
                error
            );

        },


        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        }

    );

});


function showStatus(message, type) {

    statusBox.textContent =
        message;

    statusBox.className =
        "";

    statusBox.classList.add(type);
}
