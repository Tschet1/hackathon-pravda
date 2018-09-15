/*jslint es6 */

const uportConnect = require('uport-connect');
const qrcode = require('qrcode-terminal');

const mnidAddress = '2of2kCbrQbhhS5i3kQByM5w1d4b6PD8Y1xe';
const signingKey = 'c7c478119b3048207e813f61c652b3f23849c3bf4c85aa37bd565ad16e70f3d4';
const appName = 'SRF Digital ID';

const uriHandler = (uri) => {
  qrcode.generate(uri, {small: true});
  console.log(uri)
};

const uport = new uportConnect.Connect(appName, {
    uriHandler,
    clientId: mnidAddress,
    network: 'rinkeby',
    signer: uportConnect.SimpleSigner(signingKey)
});

// Request credentials
uport.requestCredentials({
  requested: ['name'],
    notifications: true
}).then((credentials) => {
    console.log(credentials);

   setTimeout(() => {
        // Attest Credentials
        uport.attestCredentials({
            sub: "2ovxN4ajDAPdS4UdAKsgJsT1aLYPZWTrShi",
            claim: { digitalid: 'verified', name: 'Christian', surname: 'Raemy', job: 'Journalist'},
            exp: new Date().getTime() + 48 * 60 * 60 * 1000,  // Optional expiration
        });

    }, 5000);

});


