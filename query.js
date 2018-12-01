import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
	const TableName = "pokemon-wish-list";
	const userid = event.requestContext.identity.cognitoIdentityId;

	const queryParams = {
		TableName,
		KeyConditionExpression: "userid = :userid",
		ExpressionAttributeValues: {
			":userid": event.requestContext.identity.cognitoIdentityId
		}
	};

	try {
		const queryResults = await dynamoDbLib.call("query", queryParams);
		console.log("query", queryResults);

		return success(queryResults);
	} catch (e) {
		return failure({ status: false, error: e });
	}
}
