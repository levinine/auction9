// statuses obj that can be used inside functions
const statuses = {
  inactive: 'INACTIVE',
  active: 'ACTIVE',
  finished: 'FINISHED',
  realized: 'REALIZED',
};

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
    // return auction + numberOfBids info
    let resultsQuery = await mysql.query('SELECT a.*, count(ua.user_auction_ID) as numberOfBids FROM tbl_auction a left join tbl_user_auction ua on a.auctionID = ua.auctionID WHERE a.auctionID=? group by a.auctionID', [auctionId]);
    await mysql.end();
    console.log(resultsQuery);
    return generateResponse(200, resultsQuery);
  } catch (error) {
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
    let resultsActiveAuctions = await mysql.query('SELECT * FROM tbl_auction WHERE status=?', [statuses.active]);
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
    let startDate = new Date(reqBody.date_from).valueOf();
    let endDate = new Date(reqBody.date_to).valueOf();
    let status = startDate > Date.now() ? statuses.inactive : statuses.active;

    if (startDate > endDate) {
      return generateResponse(400, {
        message: "End date must be after start date."
      });
    }
    await mysql.query('INSERT INTO tbl_auction (`title`, `description`, `date_from`, `date_to`, `price`, `status`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?)',[reqBody.title, reqBody.description, reqBody.date_from, reqBody.date_to, reqBody.price, status, reqBody.created_by]);
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
    let auctionID = event.pathParameters.id;
    let resultAuctionBids = await mysql.query('SELECT u.name, price, time FROM tbl_user_auction ua JOIN tbl_user u on (ua.userID = u.userID) WHERE auctionID=? ORDER BY price', [auctionID]);
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


/* getUserAuctions - will return all auctions for current user
 * GET: /userAuctions
 */
export const getUserAuctions = async (event, context) => {
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


/* updateAuction - updates an auction
 * PUT: /updateAuction
 */
export const updateAuction = async (event, context) => {
  let reqBody = JSON.parse(event.body);
  try {
    await mysql.query('UPDATE tbl_auction SET title=?, description=?, date_from=?, date_to=?, price=? WHERE auctionID=?', [reqBody.title, reqBody.description, reqBody.date_from, reqBody.date_to, reqBody.price, reqBody.id]);
    await mysql.end();
    return generateResponse(200, {
      message: 'Auction updated successfully.'
    });
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error updating an auctions.'
    });
  }
};

 /* stopActiveAuction - will update status for auction to 'inactive'
 * PUT: /myauctions/id/stop
 */
export const stopActiveAuction = async (event, context) => {
  try {
    let auctionId = event.pathParameters.id;
    await mysql.query(`UPDATE tbl_auction SET status=? WHERE auctionID=?`, [statuses.inactive, auctionId]);
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
 * INACTIVE -> ACTIVE   [x]
 * ACTIVE -> INACTIVE   [x]
 * ACTIVE -> FINISHED   [x]
 * FINISHED -> REALIZED [x]
 */
/* realizeFinishedAuction - will update status for auction to 'realized'
 * PUT: /myauctions/id
 */
export const realizeFinishedAuction = async (event, context) => {
  try {
    let reqBody = JSON.parse(event.body);
    let auctionId = reqBody.auction.auctionID;
    let currentStatus = await mysql.query(`SELECT status FROM tbl_auction WHERE auctionID=?`,  [auctionId]);
    await mysql.end();
    // requested status to be changed into
    let reqStatus = reqBody.changeStatus;
    // check allowed status order
    if (reqStatus === statuses.realized) { // FINISHED -> REALIZED
      if (currentStatus[0].status === statuses.finished) {
        await mysql.query(`UPDATE tbl_auction SET title=?, description=?, price=?, status=? WHERE auctionID=?`,
          [reqBody.auction.title, reqBody.auction.description, reqBody.auction.price, reqStatus, auctionId]);
        await mysql.end();
        return generateResponse(200, {
          message: 'Auction successfully realized.'
        });
      }
    } else if (reqStatus === statuses.active) { // INACTIVE -> ACTIVE
      if (currentStatus[0].status === statuses.inactive) {
        await mysql.query(`UPDATE tbl_auction SET title=?, description=?, price=?, status=? WHERE auctionID=?`,
          [reqBody.auction.title, reqBody.auction.description, reqBody.auction.price, reqStatus, auctionId]);
        await mysql.end();
        return generateResponse(200, {
          message: 'Auction successfully activated.'
        });
      }
    } else if (reqStatus === statuses.inactive || reqStatus === statuses.finished) { // ACTIVE -> INACTIVE or ACTIVE -> FINISHED
      if (currentStatus[0].status === statuses.active) {
        await mysql.query(`UPDATE tbl_auction SET title=?, description=?, price=?, status=? WHERE auctionID=?`,
          [reqBody.auction.title, reqBody.auction.description, reqBody.auction.price, reqStatus, auctionId]);
        await mysql.end();
        return generateResponse(200, {
          message: 'Auction successfully stopped/finished.'
        });
      }
    } else {
      return generateResponse(400, {
        message: 'Auction status could not be changed.'
      });
    }
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error while updating auction status.'
    });
  }
};

/* postNewBid - creates new bid for selected auction
 * POST: /auctions/id/bids
 */
export const postNewBid = async (event, context) => {
  try {
    let reqBody = JSON.parse(event.body);
    let auctionId = event.pathParameters.id;
    let newBid = reqBody.newBid;
    let resultsAuction = await mysql.query('SELECT price, status FROM tbl_auction WHERE auctionID=?', [auctionId]);
    await mysql.end();
    // checking if auction is active
    if (resultsAuction[0].status === statuses.active) {
      // checking if newbid is greater then current price
      if (newBid > resultsAuction[0].price) {
        // date formatting
        let bidDate = Date.now();
        let todayDate = new Date(bidDate);
        let currentYear = todayDate.getFullYear();
        let currentMonth = todayDate.getMonth() + 1;
        let currentDay = todayDate.getDate();
        let currentHours = todayDate.getHours();
        let currentMinutes = todayDate.getMinutes();
        let currentSeconds = todayDate.getSeconds();
        let formattedTodayDate = currentYear + '-' + currentMonth + '-' + currentDay + ' ' + currentHours + ':' + currentMinutes + ':' + currentSeconds;
        // first create bid -> update current price with new bid
        // current userid hardcoded
        await mysql.query('INSERT INTO tbl_user_auction (`userID`, `auctionID`, `price`, `time`) VALUES (?, ?, ?, ?)', [2, auctionId, newBid, formattedTodayDate]);
        await mysql.query('UPDATE tbl_auction SET price=? WHERE auctionID=?', [newBid, auctionId]);
        let updatedResultsAuction = await mysql.query('SELECT * FROM tbl_auction WHERE auctionID=?', [auctionId]);
        let numberOfBids = await mysql.query('SELECT COUNT(*) as numberOfBidsQ FROM tbl_user_auction WHERE auctionID=?', [auctionId]);
        await mysql.end();
        let totalNumberOfBids = numberOfBids[0].numberOfBidsQ;
        return generateResponse(200, {
          updatedResultsAuction,
          totalNumberOfBids
        });
      } else {
        return generateResponse(400, {
          message: 'New bid must be greater then current price.'
        });
      }
    } else {
        return generateResponse(400, {
          message: 'Current auction is not Active.'
        });
    }
  }
  catch (error) {
    return generateResponse(400, {
      message: "There was an error creating a bid."
    });
  }
};
