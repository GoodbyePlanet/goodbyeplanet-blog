---
title: "Authorization Code Flow for Confidential Clients with BFF"
date: 2025-03-11
tags: [oauth2, security]
authors:
  - Nemanja
---

[![Click to zoom](/images/authoirzation-code-flow-confidential-client.png)](/images/authoirzation-code-flow-confidential-client.png)

Let's explore how *Authorization Code Flow* works for Confidential client using
BFF ([Backend For Frontend](https://auth0.com/blog/the-backend-for-frontend-pattern-bff/)).

In this example we have a (messenger.app.com) that wants to access *User* (Resource Owner) Gmail contacts.
Flow starts when *User* initiates Authorization Request on (messenger.app.com) by clicking "Get Gmail Contacts" button.
(messenger.app.com) sends request to *BFF* (Confidential Client) which is responsible for communicating with *Authorization Server*,
*BFF* then returns **HTTP 302** response with *Location* response header containing URL to *Authorization Server* - **GET /oauth2/authorize**.

The request contains:
- response_type=code → Requesting an authorization code.
- client_id=msnID → Identifies the application.
- scope=contacts → Requesting permission to access the user's contacts.
- redirect_uri=https://bff.com/redirect_uri → URL to redirect after authorization.
- state=some_state → State that can be passed from client to Authorization Server (example: To remember from which page user came)

Next if the user is not logged in, the *Authorization Server* displays a login screen (username/password form).
If already logged in, this step is skipped. After that *Authorization Server* displays consent screen showing the requested
permissions (contacts). The user approves or denies the request.
If *User* approves, *Authorization Server* redirects *User* to (messenger.app.com) which will then
deliver the authorization code to the BFF (bff.com/redirect_uri). The redirect URL contains an **authorization code** ```?code=ghtWe23Dafd$3ad```.

Next *BFF* exchanges authorization code for an access token with making **POST /oauth2/token** request.
The request includes:
- client_id=msnID → Identifies the application.
- client_secret=secret → Required for authenticating *BFF* client on *Authorization Server*.
- grant_type=authorization_code → Required when exchanging authorization code for an access token.
- redirect_uri=https://bff.com/redirect_uri → Required parameter when requesting an access token.
- code=ghtWe23Dafd$3ad → Authorization code that *BFF* obtained in the previous step. 

Next *BFF* sends an access token in request to *Resource Server* (contacts.google.com). *Resource Server* will then
check validity of access token by calling **POST /oauth2/introspect** endpoint (Token introspection) on *Authorization Server*.
If access token is valid it will return Users Gmail contacts, if not valid it will return 403 Forbidden response.


**Resources:**

RFC: [OAuth 2.0 for Browser-Based Applications - BFF](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-browser-based-apps#name-backend-for-frontend-bff)
