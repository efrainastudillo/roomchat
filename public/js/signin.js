$(document).ready(() => {

    const login = ( form ) => {
        $.ajax({
            method: "POST",
            url: "/validate",
            dataType: 'json',
            contentType: "application/json; charset=utf-8",
            data: form
        }).done( msg => {
            // msg = { status: 200, message: '' }
            window.location = '/chat';
            const user = {
                token: 'token private',
                session_id: '123456',
                user: {
                    name: 'Efrain',
                    last: 'Astudillo'
                },
                socket_id: '1234'
            }
            // localStorage.setItem('user', user);
            console.log( `User logged In -  ${msg.message} `);
        }).fail( err => {
            console.log(`Error authenticating user - ${err}`);
        });
    }


    $('#btn-login').on('click', (event) => {
        event.preventDefault();
        console.log('Hello world!!');
        const _data = JSON.stringify( $('#login-form').serializeToJSON() );
        console.log(_data);
        login(_data);
    });
});