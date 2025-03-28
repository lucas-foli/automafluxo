function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }

// function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().
//     console.log('statusChangeCallback');
//     console.log(response);                   // The current login status of the person.
//     if (response.status === 'connected') {   // Logged into your webpage and Facebook.
//       testAPI();  
//     } else {                                 // Not logged into your webpage or we are unable to tell.
//       document.getElementById('status').innerHTML = 'Please log ' +
//         'into this webpage.';
//     }
//   }

 
//   function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
//     console.log('Welcome!  Fetching your information.... ');
//     FB.api('/me', function(response) {
//       console.log('Successful login for: ' + response.name);
//       document.getElementById('status').innerHTML =
//         'Thanks for logging in, ' + response.name + '!';
//     });
//   }