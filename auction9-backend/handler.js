// Require for mysql connection
// Configuration is in serverless.yml file inside 'environment:'
const mysql = require('serverless-mysql')({
  config: {
    host	: process.env.MYSQL_ENDPOINT,
    port	: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user	: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
});

/* getAuction - will return selected auction from DB
 * GET: /auctions/id - we get auction by ID
 */
export const getAuction = async (event, context) => {
	try {
		// return ID of auction from path
		let auctionId = event.pathParameters.id;
		let auctionResults = await mysql.query(`
			SELECT * FROM tbl_auction WHERE auctionID=${auctionId}`);
		console.log(`Auction ID: ${auctionResults[0]}}`);
		return {
			statusCode: 200,
			body: `${auctionResults[0]}`,
		};
	} catch (error) {
		console.log(error);
	}
};