/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2023-01-07 04:06
 */

import jwt           from "jsonwebtoken";
import { ApiAction } from "../api-action";

// Define the secret used to sign the JWT
const JWT_SECRET = "your-secret-here";

// Define the verifyBearerToken middleware function
function verifyBearerToken(apiAction: ApiAction) {
	// Get the authorization header
	const authorizationHeader = apiAction.request.headers.authorization;
	if (!authorizationHeader) {
		// No authorization header, return 401 Unauthorized
		apiAction.response.status(401).send();
		return;
	}

	// Split the authorization header into parts
	const parts = authorizationHeader.split(" ");
	if (parts.length !== 2 || parts[0] !== "Bearer") {
		// Invalid authorization header, return 401 Unauthorized
		apiAction.response.status(401).send();
		return;
	}

	// Extract the token from the authorization header
	const token = parts[1];

	// Verify the token
	jwt.verify(token, JWT_SECRET, (error, decoded) => {
		if (error) {
			// Invalid token, return 401 Unauthorized
			apiAction.response.status(401).send();
			return;
		}

		// Token is valid, attach the decoded token payload to the req object
		apiAction.request[ "token" ] = decoded;

		// Call the next middleware function
		apiAction.request.next();
	});
}
