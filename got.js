import * as dynamoDbLib from "./libs/dynamodb-lib";
import { success, failure } from "./libs/response-lib";

export async function main(event, context) {
	const TableName = "pokemon-wish-list";
	const userid = event.requestContext.identity.cognitoIdentityId;
	const pokemonid = parseInt(event.body);

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
		let created = Date.now();

		const wanted = queryResults.Item.wanted - 1;
		created = queryResults.Item.created;
		if (wanted <= 0) {
			await dynamoDbLib.call("delete", getParams);
			return success({ status: true, pokemon: null });
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

		return success({ status: true, pokemon: putParams.Item });
	} catch (e) {
		return failure({ status: false, error: e });
	}
}
