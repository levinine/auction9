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
 * GET: /auction/id - we get auction by ID
 */
export const getAuction = async (event, context) => {
	try {
		try {
			// return ID of auction from path
			let auction_id = event.pathParameters.id;
			let auction_results = await mysql.query(`
				SELECT * FROM tbl_auction WHERE auctionID=${auction_id}`);
			console.log(`Auction ID: ${auction_results[0].auctionID}\nTitle: ${auction_results[0].title}\nPrice: ${auction_results[0].price}`);
			return {
				statusCode: 200,
				body: `Success call: getAuction. Auction ID: ${auction_results[0].auctionID}`,
			};
		} catch (error) {
			console.log(error);
		}
	} catch (error) {
		console.log(error);
	}
};