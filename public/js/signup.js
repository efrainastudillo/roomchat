$(document).ready( () => {
    console.log('Signup...');

    const signup = (event) => {
        event.preventDefault();
        console.log('Registering user to the database...');
        const _data = JSON.stringify( $('#signup-form').serializeToJSON() );
        console.log(_data);

        $.ajax({
            method: "POST",
            url: "/register",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: _data
        }).done( msg => {
            console.log( "Data Saved: " + msg.message );
        }).fail( err => {
            console.log(`Error registering user - ${err}`)
        });
    }

    $('#btn-submit').on('click', signup );

});