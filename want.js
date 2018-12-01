import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
	const TableName = "pokemon-wish-list";
	const userid = event.requestContext.identity.cognitoIdentityId;
	const pokemonid = event.body;

	const getParams = {
		TableName,
		Key: {
			userid,
			pokemonid
		}
	};

	try {
		const queryResults = await dynamoDbLib.call("get", getParams);
		console.log("query", queryResults);
		let wanted = 1;
		let created = Date.now();
		if (queryResults.Item) {
			wanted = queryResults.Item.wanted + 1;
			created = queryResults.Item.created;
		}
		const putParams = {
			TableName,
			Item: {
				userid,
				pokemonid,
				wanted,
				created,
				updated: Date.now()
			}
		};

		await dynamoDbLib.call("put", putParams);

		return success(putParams.Item);
	} catch (e) {
		return failure({ status: false, error: e });
	}
}
