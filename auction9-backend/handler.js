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
    await mysql.end();
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

/* getAuctionBids - returns auction bids (users' bids history)
 * GET: auctions/{id}/bids
 */
export const getAuctionBids = async (event, context) => {
  try {
    // once we enable bidding, remove hardcoded auctionID
    // let resultAuctionBids = await mysql.query('SELECT u.name, price, time FROM tbl_user_auction ua JOIN tbl_user u on (ua.userID = u.userID) WHERE auctionID=? ORDER BY price', [auctionID]);
    let resultAuctionBids = await mysql.query('SELECT u.name, price, time FROM tbl_user_auction ua JOIN tbl_user u on (ua.userID = u.userID) WHERE auctionID=1 ORDER BY price');
    await mysql.end();
    return generateResponse(200, resultAuctionBids);
  }
  catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: "There was an error getting auction bids."
    });
  }
};

/* getMyAuctions - will return all auctions for current user
 * GET: /myauctions
 */
export const getMyAuctions = async (event, context) => {
  try {
    let currentUserId = event.multiValueQueryStringParameters.created_by[0];
    let resultsMyAuctions = await mysql.query('SELECT * FROM tbl_auction WHERE created_by=?', [currentUserId]);
    await mysql.end();
    return generateResponse(200, resultsMyAuctions);
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error getting my auctions.'
    });
  }
};

/* stopActiveAuction - will update status for auction to 'inactive'
 * PUT: /myauctions/id/stop
 */
export const stopActiveAuction = async (event, context) => {
  try {
    let auctionId = event.pathParameters.id;
    let statusInactive = 'INACTIVE';
    await mysql.query(`UPDATE tbl_auction SET status=? WHERE auctionID=?`, [statusInactive, auctionId]);
    await mysql.end();
    return generateResponse(200, {
      message: 'Auction has been stopped successfully.'
    });
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error while stopping auction.'
    });
  }
};

/* getUserWonAuctions - will return all my won auctions for current user
 * GET: /wonauctions
 */
export const getUserWonAuctions = async (event, context) => {
  try {
    let currentUserId = event.multiValueQueryStringParameters.userId[0];
    let resultsUserWonAuctions = await mysql.query(`SELECT * FROM tbl_auction WHERE winner=?`, [currentUserId]);
    await mysql.end();
    return generateResponse(200, resultsUserWonAuctions);
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error while getting my won auctions.'
    });
  }
};


/* Allowed status changes:
 * order status: INACTIVE -> ACTIVE -> FINISHED -> REALIZED
 * current -> new :
 * INACTIVE -> ACTIVE
 * ACTIVE -> INACTIVE
 * ACTIVE -> FINISHED
 * FINISHED -> REALIZED
 */
/* realizeFinishedAuction - will update status for auction to 'realized'
 * PUT: /myauctions/id
 */
 export const realizeFinishedAuction = async (event, context) => {
  try {
    let reqBody = JSON.parse(event.body);
    let auctionId = reqBody.auction.auctionID;
    let currentStatus = reqBody.auction.status;
    // requested status to be changed into
    let reqStatus = reqBody.changeStatus;
    let possibleStatus = ['INACTIVE', 'ACTIVE', 'FINISHED', 'REALIZED'];
    // check allowed status order
    if (reqStatus === possibleStatus[3]) {
      if (currentStatus === possibleStatus[2]) {
        await mysql.query(`UPDATE tbl_auction SET title=?, description=?, price=?, status=? WHERE auctionID=?`,
          [reqBody.auction.title, reqBody.auction.description, reqBody.auction.price, reqStatus, auctionId]);
        await mysql.end();
        return generateResponse(200, {
          message: 'Successfully realized.'
        });
      }
    }
    /*let auctionId = reqBody.auctionID;
    let reqStatus = reqBody.status;
    let statusRealized = 'REALIZED';
    // Check if current status is 'finished'
    // if so, user can 'realize' it, else error
    if (currentStatus === 'FINISHED') {
      await mysql.query(`UPDATE tbl_auction SET status=? WHERE auctionID=?`, [statusRealized, auctionId]);
      await mysql.end();
      return generateResponse(200, {
        message: 'Success realized'
      });
    } else {
      return generateResponse(400, {
        message: 'Current status can not be changed.'
      });
    }*/
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error while realizing finished auction.'
    });
  }
};
