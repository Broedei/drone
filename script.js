alert("JAVASCRIPT WERKT!");

navigator.geolocation.getCurrentPosition(

    function(position) {

        alert(
            "GPS werkt!\n\nLatitude: " +
            position.coords.latitude +
            "\nLongitude: " +
            position.coords.longitude
        );

    },

    function(error) {

        alert(
            "GPS fout:\n" +
            error.message +
            "\nCode: " +
            error.code
        );

    }

);
