$(document).ready( () => {
    console.log('Signup...');

    const signup = (event) => {
        event.preventDefault();
        console.log('Registering user to the database...');
        const _data = JSON.stringify( $('#signup-form').serializeToJSON() );

        $.ajax({
            method: "POST",
            url: "/register",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: _data
        }).done( msg => {
            // msg = { status: 200, message: '' }
            console.log( "Data Saved: " + msg.message );
            $('#reg-msg').append(msg.message);
        }).fail( err => {
            console.log(`Error registering user - ${err}`)
            $('#reg-msg').append('');
        });
    }

    $('#btn-submit').on('click', signup );

});