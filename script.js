// PLAK HIER DE URL VAN JOUW GOOGLE APPS SCRIPT WEB APP

const API_URL =
    "PLAK_HIER_JOUW_APPS_SCRIPT_URL";


const form = document.getElementById("gpsForm");

const statusBox = document.getElementById("status");

const button = form.querySelector("button");



form.addEventListener("submit", function(event) {

    event.preventDefault();


    // Naam ophalen
    const naam =
        document.getElementById("naam").value;


    // Opmerkingen ophalen
    const opmerkingen =
        document.getElementById("opmerkingen").value;


    // Controleren of GPS beschikbaar is
    if (!navigator.geolocation) {

        showStatus(
            "GPS wordt niet ondersteund door deze browser.",
            "error"
        );

        return;
    }


    // Knop tijdelijk uitschakelen
    button.disabled = true;

    button.textContent =
        "Locatie ophalen...";


    showStatus(
        "Je GPS-locatie wordt opgehaald...",
        "loading"
    );


    // GPS locatie ophalen
    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            sendData(
                naam,
                opmerkingen,
                latitude,
                longitude
            );

        },


        function(error) {

            button.disabled = false;

            button.textContent =
                "Versturen en locatie opslaan";


            let message =
                "Locatie kon niet worden opgehaald.";


            switch (error.code) {

                case error.PERMISSION_DENIED:

                    message =
                        "Je hebt geen toestemming gegeven voor locatiegebruik.";

                    break;


                case error.POSITION_UNAVAILABLE:

                    message =
                        "GPS-locatie is momenteel niet beschikbaar.";

                    break;


                case error.TIMEOUT:

                    message =
                        "Het ophalen van de GPS-locatie duurde te lang.";

                    break;

            }


            showStatus(
                message,
                "error"
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }

    );

});



function sendData(
    naam,
    opmerkingen,
    latitude,
    longitude
) {


    button.textContent =
        "Gegevens versturen...";


    const data = {

        naam: naam,

        opmerkingen: opmerkingen,

        latitude: latitude,

        longitude: longitude

    };


    fetch(API_URL, {

        method: "POST",

        mode: "no-cors",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(data)

    })

    .then(function() {

        showStatus(
            "Gegevens zijn succesvol opgeslagen.",
            "success"
        );


        form.reset();


        button.disabled = false;

        button.textContent =
            "Versturen en locatie opslaan";

    })

    .catch(function(error) {

        console.error(error);


        showStatus(
            "Er is een fout opgetreden bij het versturen.",
            "error"
        );


        button.disabled = false;

        button.textContent =
            "Versturen en locatie opslaan";

    });

}



function showStatus(
    message,
    type
) {

    statusBox.textContent = message;


    statusBox.className = "";


    statusBox.classList.add(type);

}
