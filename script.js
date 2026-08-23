alert("JavaScript werkt. GPS wordt nu aangevraagd...");

if (!navigator.geolocation) {

    alert("Deze browser ondersteunt geen GPS.");

} else {

    navigator.geolocation.getCurrentPosition(

        function(position) {

            alert(
                "GPS WERKT!\n\n" +
                "Latitude: " +
                position.coords.latitude +
                "\nLongitude: " +
                position.coords.longitude +
                "\nNauwkeurigheid: " +
                position.coords.accuracy +
                " meter"
            );

        },

        function(error) {

            alert(
                "GPS FOUT\n\n" +
                "Code: " +
                error.code +
                "\nMelding: " +
                error.message
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 30000,
            maximumAge: 0
        }

    );
}
