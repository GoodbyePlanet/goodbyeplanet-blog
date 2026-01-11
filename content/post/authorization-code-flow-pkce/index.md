---
title: "Authorization Code Flow (PKCE) for Public Clients"
date: 2025-03-10
tags: [oauth2, security]
authors:
  - Nemanja
---

[![Click to zoom](/images/authorization-code-flow.png)](/images/authorization-code-flow.png)

Let's explore how *Authorization Code Flow* with PKCE (Proof Key For Code Exchange) extension works in OAuth 2.0. 

In this example we have a *Public Client* (messenger.app.com) that wants to access *User* (Resource Owner) Gmail contacts.
Flow starts when *User* initiates Authorization Request on (messenger.app.com) by clicking "Get Gmail Contacts" button.
*Client app* redirects *User* to Google's *authorization server* (accounts.google.com) with **GET /oauth2/authorize** request.
The request contains:
- response_type=code → Requesting an authorization code.
- client_id=msnID → Identifies the application.
- scope=contacts → Requesting permission to access the user's contacts.
- redirect_uri=https://messenger.app.com/redirect_uri → URL to redirect after authorization.
- state=some_state → State that can be passed from client to Authorization Server (example: To remember from which page user came)
- code_challenge=1GdfTujiO45FrtH & code_challenge_method=sha256 → PKCE mechanism to enable *Public Client* to securely authenticate on
*Authorization Server* when requesting an access token. *Client app* generates **code_verifier** (random string between 43 and 128 chars)
then it uses **code_challenge_method** in this case SHA256 algorithm to calculate a new value, and then it uses **base64** function to
finally calculates **code_challenge**.

Next if the user is not logged in, the *Authorization Server* displays a login screen (username/password form).
If already logged in, this step is skipped. After that *Authorization Server* displays consent screen showing the requested
permissions (contacts). The user approves or denies the request.
If *User* approves, *Authorization Server* redirects *User* to the specified redirect_uri (messenger.app.com/redirect_uri).
The redirect URL contains an **authorization code** ```?code=ghtWe23Dafd$3ad```.

Next *Client app* exchanges authorization code for an access token with making **POST /oauth2/token** request.
The request includes:
- client_id=msnID → Identifies the application.
- grant_type=authorization_code → Required when exchanging authorization code for an access token.
- redirect_uri → Required parameter when requesting an access token.
- code=ghtWe23Dafd$3ad → Authorization code that *Client app* obtained in the previous step. 
- code_verifier=asdf123avafr → Code that *Public app* created and used to generate code_challenge param. This param is used by
*Authorization Server* to calculate **code_challenge** itself, and to verify if **code_challenge** sent in previous request is same.
If it is same then *Client app* is successfully authenticated on *Authorization Server*. Next *Authorization Server*
checks if **code=ghtWe23Dafd$3ad** is valid, and if yes it returns response with and **access token**.

Next *Client app* sends an access token in request to *Resource Server* (contacts.google.com). *Resource Server* will then
check validity of access token by calling **POST /oauth2/introspect** endpoint (Token introspection) on *Authorization Server*.
If access token is valid it will return Users Gmail contacts, if not valid it will return 403 Forbidden response.

Resources: https://example-app.com/pkce (Generate code_challenge)
