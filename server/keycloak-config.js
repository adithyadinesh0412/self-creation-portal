const Keycloak = require('keycloak-connect');
let memoryStore = null;
const session = require('express-session');

let keycloakConfig = {
  clientId: 'self-creation-portal',
  bearerOnly: true,
  serverUrl: 'http://localhost:8080/realms/master/protocol/openid-connect/auth?client_id=security-admin-console&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fadmin%2Fmaster%2Fconsole%2F%23%2Fmaster%2Fevents&state=957fa2cd-3356-4ac4-8a4b-02001df72d7d&response_mode=fragment&response_type=code&scope=openid&nonce=bbae476e-5253-41c7-9e74-9f4ad810b08b&code_challenge=57SWKOueOkSCYjLsoW3aH8G8QKffPMfSj6nhVBplK0c&code_challenge_method=S256',
  realm: 'master-realm',
  credentials: {
    secret: ''
  }
};

const getKeycloak = function(req,res) {
  let keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
  keycloak.authenticated = authenticated;
  keycloak.deauthenticated = deauthenticated
  memoryStore = new session.MemoryStore()
  return keycloak
}


const authenticated = function (request, next) {
  try {
    var userId = request.kauth.grant.access_token.content.sub.split(':')
    request.session.userId = userId[userId.length - 1];
    console.log(request.session.userId)
  } catch (err) {
    console.log('userId conversation error', request.kauth.grant.access_token.content.sub, err);
  }
}

const deauthenticated = function (request) {
  delete request.session['roles']
  delete request.session['rootOrgId']
  delete request.session.userId
  if (request.session) {
    request.session.sessionEvents = request.session.sessionEvents || []
    delete request.session.sessionEvents
  }
}


module.exports = { getKeycloak, memoryStore };
