---
title: "OAuth 2.0 Core Concepts"
date: 2025-03-06
tags: [oauth2, security]
authors:
    - Nemanja
---

[![Click to zoom](/images/core-concepts.png)](/images/core-concepts.png)

Let's explore core OAuth 2.0 concepts.

### Main Entities
**Resource Owner** – The user who owns the data and grants access.

**Client** – The application requesting access on behalf of the user.
- Can be confidential (with client authentication, e.g., server-side apps)
- Or public (without client authentication, e.g., mobile or JavaScript apps).

**Authorization Server** – Issues access tokens after validating authorization.

**Resource Server** – Hosts protected resources and validates access tokens.

### Protocol Endpoints
**Authorization Endpoint** – Where the user authenticates and grants access to get authorization code.

**Token Endpoint** – Where the client exchanges an authorization code for an access token.

### Authorization Grant Types
**Authorization Code** - with PKCE extension for security.

**Client Credentials** - for machine-to-machine authentication.

**Refresh Token** – Used to get a new access token without user interaction.

**Device Authorization grant** - Used for devices without browsers (e.g., smart TVs), where the user logs in on another device to approve access.

**Implicit** - deprecated grant type (instead authorization code flow should be used) - [Is Implicit flow dead](https://developer.okta.com/blog/2019/05/01/is-the-oauth-implicit-flow-dead)

### Tokens
**Access Token** – Short-lived credential to access protected resources.
- JWT - token that carries necessary information
- Opaque - A random, non-guessable string (e.g., UUID, hash, or encrypted token)

**Refresh Token** – Used to obtain new access tokens.

### Proof Key for Code Exchange (PKCE)
Used to enhance security for public clients (e.g., mobile & SPAs).
Requires a code_verifier (random string between 43–128 chars).
A code_challenge is derived from the verifier using SHA-256 & base64.

### Token Introspection & Revocation
**Token Introspection** - Allows resource servers to validate token status by querying the authorization server.

**Token Revocation** - A client can explicitly invalidate a refresh token (or access token) before it expires.
