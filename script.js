/*
========================================================
  GOOGLE APPS SCRIPT URL
========================================================

  PLAK HIER JE BESTAANDE /exec URL

*/

const API_URL =
    "https://script.google.com/macros/s/AKfycbx0pzJ9h6asb8jWflwZX8Sy1UmOBJcreQMJ9n_260jyqasZOacXZMBe-6m4zGGbVlZvwA/exec";


/*
========================================================
  ELEMENTEN
========================================================
*/

const form =
    document.getElementById(
        "gpsForm"
    );


const status =
    document.getElementById(
        "status"
    );


const gpsInfo =
    document.getElementById(
        "gpsInfo"
    );


const submitButton =
    document.getElementById(
        "submitButton"
    );


/*
========================================================
  FORMULIER VERSTUREN
========================================================
*/

form.addEventListener(
    "submit",
    function(event) {


        /*
        ----------------------------------------
        Normale formulieractie stoppen
        ----------------------------------------
        */

        event.preventDefault();


        /*
        ----------------------------------------
        Gegevens uitlezen
        ----------------------------------------
        */

        const naam =
            document
                .getElementById("naam")
                .value
                .trim();


        const opmerkingen =
            document
                .getElementById("opmerkingen")
                .value
                .trim();


        const typeRegistratie =
            document
                .getElementById(
                    "typeRegistratie"
                )
                .value;


        /*
        ----------------------------------------
        Controle type
        ----------------------------------------
        */

        if (!typeRegistratie) {

            status.textContent =
                "Kies eerst een type registratie.";

            return;

        }


        /*
        ----------------------------------------
        Controle naam
        ----------------------------------------
        */

        if (!naam) {

            status.textContent =
                "Vul eerst je naam in.";

            return;

        }


        /*
        ----------------------------------------
        GPS beschikbaar?
        ----------------------------------------
        */

        if (
            !navigator.geolocation
        ) {

            status.textContent =
                "GPS wordt niet ondersteund door deze telefoon.";

            return;

        }


        /*
        ----------------------------------------
        Interface aanpassen
        ----------------------------------------
        */

        submitButton.disabled =
            true;


        status.textContent =
            "📍 Locatie wordt bepaald...";


        gpsInfo.textContent =
            "";


        /*
        ----------------------------------------
        GPS OPHALEN
        ----------------------------------------
        */

        navigator.geolocation.getCurrentPosition(

            function(position) {


                /*
                ========================================
                  GPS RESULTAAT
                ========================================
                */

                const latitude =
                    position.coords.latitude;


                const longitude =
                    position.coords.longitude;


                const accuracy =
                    position.coords.accuracy;


                /*
                ----------------------------------------
                Nauwkeurigheid afronden
                ----------------------------------------
                */

                const accuracyRounded =
                    Math.round(
                        accuracy
                    );


                /*
                ----------------------------------------
                GPS informatie tonen
                ----------------------------------------
                */

                gpsInfo.textContent =
                    "📍 Locatie gevonden\n" +
                    "Nauwkeurigheid: " +
                    accuracyRounded +
                    " meter";


                status.textContent =
                    "Locatie gevonden. Gegevens worden opgeslagen...";


                /*
                ========================================
                  GEGEVENS SAMENSTELLEN
                ========================================
                */

                const gegevens = {


                    naam:
                        naam,


                    opmerkingen:
                        opmerkingen,


                    typeRegistratie:
                        typeRegistratie,


                    latitude:
                        latitude,


                    longitude:
                        longitude,


                    accuracy:
                        accuracyRounded

                };


                /*
                ========================================
                  NAAR GOOGLE APPS SCRIPT
                ========================================
                */

                fetch(

                    API_URL,

                    {

                        method:
                            "POST",


                        headers: {

                            "Content-Type":
                                "text/plain;charset=utf-8"

                        },


                        body:
                            JSON.stringify(
                                gegevens
                            )

                    }

                )


                /*
                ----------------------------------------
                Antwoord ontvangen
                ----------------------------------------
                */

                .then(
                    function(response) {

                        return response.text();

                    }
                )


                .then(
                    function(result) {


                        console.log(
                            "Server antwoord:",
                            result
                        );


                        /*
                        --------------------------------
                        Succes
                        --------------------------------
                        */

                        status.textContent =
                            "✅ Registratie succesvol opgeslagen.";


                        /*
                        --------------------------------
                        Formulier leegmaken
                        --------------------------------
                        */

                        form.reset();


                        /*
                        --------------------------------
                        Knop opnieuw activeren
                        --------------------------------
                        */

                        submitButton.disabled =
                            false;

                    }
                )


                /*
                ----------------------------------------
                Fout bij verzenden
                ----------------------------------------
                */

                .catch(
                    function(error) {


                        console.error(
                            error
                        );


                        status.textContent =
                            "❌ De gegevens konden niet worden opgeslagen.";


                        submitButton.disabled =
                            false;

                    }
                );

            },


            /*
            ========================================
              GPS FOUT
            ========================================
            */

            function(error) {


                console.error(
                    "GPS fout:",
                    error
                );


                let melding =
                    "❌ Locatie kon niet worden bepaald.";


                /*
                ----------------------------------------
                Toestemming geweigerd
                ----------------------------------------
                */

                if (
                    error.code === 1
                ) {

                    melding =
                        "❌ Locatietoestemming is geweigerd. Geef deze website toestemming om je locatie te gebruiken.";

                }


                /*
                ----------------------------------------
                Locatie niet beschikbaar
                ----------------------------------------
                */

                if (
                    error.code === 2
                ) {

                    melding =
                        "❌ Je locatie kon niet worden bepaald. Controleer of GPS/locatievoorzieningen aan staan.";

                }


                /*
                ----------------------------------------
                Timeout
                ----------------------------------------
                */

                if (
                    error.code === 3
                ) {

                    melding =
                        "❌ Het bepalen van je locatie duurde te lang. Probeer opnieuw.";

                }


                status.textContent =
                    melding;


                submitButton.disabled =
                    false;

            },


            /*
            ========================================
              GPS OPTIES
            ========================================
            */

            {

                /*
                Zo nauwkeurig mogelijk
                */

                enableHighAccuracy:
                    true,


                /*
                Maximaal 20 seconden wachten
                */

                timeout:
                    20000,


                /*
                Geen oude GPS-positie gebruiken
                */

                maximumAge:
                    0

            }

        );

    }
);
