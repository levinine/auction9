// Require for mysql connection
// Configuration is in serverless.yml file inside 'environment:'
const mysql = require('serverless-mysql')({
	config: {
		host: process.env.MYSQL_ENDPOINT,
		port: process.env.MYSQL_PORT,
		database: process.env.MYSQL_DATABASE,
		user: process.env.MYSQL_USER,
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
    let auctionResults = await mysql.query('SELECT * FROM tbl_auction WHERE auctionID=?', [auctionId]);
    // Run clean up function
    await mysql.end();
    return {
      statusCode: 200,
      body: JSON.stringify(auctionResults[0]),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: "There was an error while getting 'auction'",
    };
  }
};

/* getActiveAuctions - will return all auctions with 'active' status
 * GET: /home
 */
export const getActiveAuctions = async (event, context) => {
  try {
    let auctionActiveStatus = 'active';
    let resultsActiveAuctions = await mysql.query('SELECT * FROM tbl_auction WHERE status=?', [auctionActiveStatus]);
    await mysql.end();
    return {
      statusCode: 200,
      body: JSON.stringify(resultsActiveAuctions),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 400,
      body: "There was an error while getting 'auctions'",
    };
  }
};

/* postAuction - creates new auction
 * POST: /newauction
 */
export const postAuction = async (event, context) => {
	try {
		let reqBody = JSON.parse(event.body);
		let sqlInsert = await mysql.query('INSERT INTO tbl_auction (`title`, `description`, `date_from`, `date_to`, `price`, `status`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[reqBody.title, reqBody.description, reqBody.date_from, reqBody.date_to, reqBody.price, reqBody.status, reqBody.created_by]);
		return {
			statusCode: 200,
			body: "Auction created successfully.",
		};
	} catch (error) {
		console.log(error);
		return {
			statusCode: 400,
			body: "There was an error creating an auction",
		};
	}
};
