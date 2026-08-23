
const API_URL =
   "https://script.google.com/macros/s/AKfycbwh9SrPP-vuoUV7boF9Wbmtxk81EJa7HmxB01_btbKRZbxzvD_uHh4OHDmfxqv7rOFo/exec";


const form = document.getElementById("gpsForm");
const statusBox = document.getElementById("status");
const button = form.querySelector("button");


form.addEventListener("submit", function(event) {

    event.preventDefault();

    const naam =
        document.getElementById("naam").value.trim();

    const opmerkingen =
        document.getElementById("opmerkingen").value.trim();


    if (!navigator.geolocation) {

        showStatus(
            "GPS wordt niet ondersteund door deze browser.",
            "error"
        );

        return;
    }


    button.disabled = true;
    button.textContent = "Locatie ophalen...";


    showStatus(
        "Je GPS-locatie wordt opgehaald...",
        "loading"
    );


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            showStatus(
                "Locatie gevonden. Gegevens worden opgeslagen...",
                "loading"
            );


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
                "De locatie kon niet worden opgehaald.";


            if (error.code === 1) {

                message =
                    "Je hebt geen toestemming gegeven voor je locatie.";
            }


            if (error.code === 2) {

                message =
                    "Je locatie is momenteel niet beschikbaar.";
            }


            if (error.code === 3) {

                message =
                    "Het ophalen van je locatie duurde te lang.";
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

    const data = {

        naam: naam,

        opmerkingen: opmerkingen,

        latitude: latitude,

        longitude: longitude

    };


    fetch(API_URL, {

        method: "POST",

        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },

        body: JSON.stringify(data)

    })

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Serverfout: " +
                response.status
            );
        }

        return response.text();

    })

    .then(function(result) {

        console.log(
            "Antwoord van Google:",
            result
        );


        let responseData;


        try {

            responseData =
                JSON.parse(result);

        } catch (e) {

            responseData = null;
        }


        if (
            responseData &&
            responseData.success === false
        ) {

            throw new Error(
                responseData.message ||
                "Google Apps Script gaf een fout."
            );
        }


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

        console.error(
            "Fout:",
            error
        );


        showStatus(
            "Fout bij opslaan: " +
            error.message,
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

    statusBox.textContent =
        message;

    statusBox.className = "";

    statusBox.classList.add(type);
}
