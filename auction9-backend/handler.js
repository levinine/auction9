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

const generateResponse = (statusCode, body) => {
  return {
    statusCode: statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  };
};

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
    return generateResponse(200, auctionResults[0]);
  }
  catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: "There was an error getting an auction."
    });
  }
};

/* getActiveAuctions - will return all auctions with 'active' status
 * GET: /auctions
 */
export const getActiveAuctions = async (event, context) => {
  try {
    let auctionActiveStatus = 'active';
    let resultsActiveAuctions = await mysql.query('SELECT * FROM tbl_auction WHERE status=?', [auctionActiveStatus]);
    await mysql.end();
    return generateResponse(200, resultsActiveAuctions);
  }
  catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: "There was an error getting an auction."
    });
  }
};

/* postAuction - creates new auction
 * POST: /newauction
 */
export const postAuction = async (event, context) => {
  try {
    let reqBody = JSON.parse(event.body);
    var startDate = new Date(reqBody.date_from).valueOf();
    var endDate = new Date(reqBody.date_to).valueOf();
    let status = startDate > Date.now() ? 'INACTIVE' : 'ACTIVE';

    if (startDate > endDate) {
      return generateResponse(400, {
        message: "End date must be after start date."
      });
    }
    await mysql.query('INSERT INTO tbl_auction (`title`, `description`, `date_from`, `date_to`, `price`, `status`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [reqBody.title, reqBody.description, reqBody.date_from, reqBody.date_to, reqBody.price, status, reqBody.created_by]);
    return generateResponse(200, {
      message: "Auction created successfully."
    });
  }
  catch (error) {
    return generateResponse(400, {
      message: "There was an error creating an auction."
    });
  }
};
