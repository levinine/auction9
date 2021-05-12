import moment from 'moment';

// statuses obj that can be used inside functions
const statuses = {
  inactive: 'inactive',
  active: 'active',
  finished: 'finished',
  realized: 'realized',
};

// Setting default values for stopped and realized
const getStatus = (start, end, stopped = false, realized = false) => {
  let startDate = start.valueOf();
  let endDate = end.valueOf();
  const currentDate = Date.now();
  // If 'stop' filed is true, auction is inactive
  if (stopped) {
    return statuses.inactive;
  }
  // If 'realized' field is true, auction is realized
  else if (realized) {
    return statuses.realized;
  }
  // For other cases, we compare start and end date to each other/current date
  else {
    // If start date is in the future, the auction is inactive
    if (startDate > currentDate) {
      return statuses.inactive;
    }
    // If start date is in the past and end date in the future, the auction is active
    else if (startDate < currentDate && endDate > currentDate) {
      return statuses.active;
    }
    // If both, start and end dates have passed, the auction has finished
    else if (startDate < currentDate && endDate < currentDate) {
      return statuses.finished;
    }
  }
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

/* createUser - will create user in mysql
 * GET: /users/create
 * Body attributes:
 *  email - user's email
 *  externalId - user's unique flag accepted from azure sso
 */
export const createUser = async (event, context) => {
  try {
    let reqBody = JSON.parse(event.body);
    const userExists = await mysql.query('SELECT * FROM tbl_user WHERE email=?', [reqBody.email]);
    if (userExists.length === 0) {
      await mysql.query('INSERT INTO tbl_user (`email`, `external_id`) VALUES (?, ?)', [reqBody.email, reqBody.externalId]);
    }
    await mysql.end();
    return generateResponse(200, {
      message: 'User profile set up successfully.'
    });
  } catch (error) {
    return generateResponse(400, {
      message: 'There was an error setting up user profile.'
    });
  }
};

/* getAuction - will return selected auction from DB
 * GET: /auctions/id - get auction by ID
 */
export const getAuction = async (event, context) => {
  try {
    // return ID of auction from path
    let auctionId = event.pathParameters.id;
    // return auction + numberOfBids info
    let resultsQuery = await mysql.query('SELECT a.*, count(ua.user_auction_ID) as numberOfBids FROM tbl_auction a left join tbl_user_auction ua on a.auctionID = ua.auctionID WHERE a.auctionID=? group by a.auctionID', [auctionId]);
    await mysql.end();
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
    // eliminate stopped and realized auctions at the beggining
    let auctions = await mysql.query('SELECT * FROM tbl_auction WHERE stopped=false and realized=false');
    await mysql.end();
    let activeAuctions = [];
    [...auctions].forEach((auction) => {
      if (getStatus(auction.date_from, auction.date_to) === statuses.active) {
        activeAuctions.push(auction);
      }
    });
    return generateResponse(200, activeAuctions);
  }
  catch (error) {
    return generateResponse(400, {
      message: `There was an error getting an auction. ${error}`
    });
  }
};

/* postAuction - creates new auction
 * POST: /newauction
 */
export const postAuction = async (event, context) => {
  try {
    let reqBody = JSON.parse(event.body);
    let startDate = new Date(reqBody.date_from);
    let endDate = new Date(reqBody.date_to);

    if (getStatus(startDate, endDate) === statuses.active) {
      return generateResponse(400, {
        message: 'Not possible to create an auction which start time has passed.'
      });
    }
    if (startDate.valueOf() > endDate.valueOf()) {
      return generateResponse(400, {
        message: "End date must be after start date."
      });
    }
    await mysql.query('INSERT INTO tbl_auction (`title`, `description`, `date_from`, `date_to`, `price`, `stopped`, `realized`, `created_by`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [reqBody.title, reqBody.description, reqBody.date_from, reqBody.date_to, reqBody.price, false, false, reqBody.created_by]);
    let lastInsertedID = await mysql.query('SELECT LAST_INSERT_ID()');
    await mysql.end();
    return generateResponse(200, {
      message: "Auction created successfully.",
      auctionID: lastInsertedID[0]['LAST_INSERT_ID()']
    });
  }
  catch (error) {
    return generateResponse(400, {
      message: `There was an error creating an auction. ${error}`
    });
  }
};


/* getAuctionBids - returns auction bids (users' bids history)
 * GET: auctions/{id}/bids
 */
export const getAuctionBids = async (event, context) => {
  try {
    let auctionID = event.pathParameters.id;
    let resultAuctionBids = await mysql.query('SELECT email, price, time FROM tbl_user_auction WHERE auctionID=? ORDER BY price', [auctionID]);
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
  let startDate = new Date(reqBody.date_from);
  let endDate = new Date(reqBody.date_to);

  if (getStatus(startDate, endDate) === statuses.active) {
    return generateResponse(400, {
      message: 'Not possible to update an active auction.'
    });
  }
  if (startDate.valueOf() > endDate.valueOf()) {
    return generateResponse(400, {
      message: "End date must be after start date."
    });
  }
  // Regular update of inactive auction
  if (!reqBody.stopped) {
    try {
      // Just add stopped=false
      await mysql.query('UPDATE tbl_auction SET title=?, description=?, date_from=?, date_to=?, price=?, stopped=false WHERE auctionID=?', [reqBody.title, reqBody.description, reqBody.date_from, reqBody.date_to, reqBody.price, reqBody.id]);
      await mysql.end();
      return generateResponse(200, {
        message: 'Auction updated successfully.'
      });
    } catch (error) {
      console.log(error);
      return generateResponse(400, {
        message: 'There was an error updating stopped auction.'
      });
    }
  }
  // Reactivating stopped auction
  else {
    try {
      await mysql.query('UPDATE tbl_auction SET title=?, description=?, date_from=?, date_to=?, price=? WHERE auctionID=?', [reqBody.title, reqBody.description, reqBody.date_from, reqBody.date_to, reqBody.price, reqBody.id]);
      await mysql.end();
      return generateResponse(200, {
        message: 'Auction updated successfully.'
      });
    } catch (error) {
      console.log(error);
      return generateResponse(400, {
        message: 'There was an error updating an auction.'
      });
    }
  }
};

/* stopActiveAuction - sets 'stopped' field to true
* PUT: /myauctions/id/stop
*/
export const stopActiveAuction = async (event, context) => {
  try {
    let auctionId = event.pathParameters.id;
    await mysql.query(`UPDATE tbl_auction SET stopped=true WHERE auctionID=?`, [auctionId]);
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
    let currentUser = event.multiValueQueryStringParameters.email[0];
    let resultsUserWonAuctions = await mysql.query(`SELECT * FROM tbl_auction WHERE winner=?`, [currentUser]);
    await mysql.end();
    return generateResponse(200, resultsUserWonAuctions);
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error while getting my won auctions.'
    });
  }
};

/* realizeFinishedAuction - will update status for auction to 'realized'
 * Additionally winner of the auction will be set. In a future make a mechanism to add winner when end date passed.
 * PUT: /myauctions/id
 */
export const realizeFinishedAuction = async (event, context) => {
  try {
    let reqBody = JSON.parse(event.body);
    let auctionId = reqBody.auction.auctionID;
    let startDate = new Date(reqBody.auction.date_from);
    let endDate = new Date(reqBody.auction.date_to);
    // Auction can be realized only if it's finished
    if (getStatus(startDate, endDate) === statuses.finished) {
      let winner = await mysql.query(`SELECT email, MAX(price) from tbl_user_auction WHERE auctionID = ? GROUP BY email;`, [auctionId]);
      winner = winner.lenght != 0 ? winner[0]['email'] : null;
      await mysql.query('UPDATE tbl_auction SET realized=true, winner=? WHERE auctionID=?', [winner, auctionId]);
      mysql.end();
      return generateResponse(200, {
        message: 'Auction successfully realized.'
      });
    }
  } catch (error) {
    console.log(error);
    return generateResponse(400, {
      message: 'There was an error realizing auction.'
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
    const email = reqBody.email;
    let resultsAuction = await mysql.query('SELECT date_from, date_to, price FROM tbl_auction WHERE auctionID=? and stopped=false and realized=false', [auctionId]);
    await mysql.end();
    let startDate = new Date(resultsAuction[0].date_from);
    let endDate = new Date(resultsAuction[0].date_to);

    // Check if auction is active
    if (getStatus(startDate, endDate) === statuses.active) {
      // Check if new bid price is greater than current price
      if (newBid > resultsAuction[0].price) {
        let dateTimeNow = moment(Date.now()).format("YYYY-MM-DD hh:mm");
        // First create bid, then update current price with new bid
        await mysql.query('INSERT INTO tbl_user_auction (`email`, `auctionID`, `price`, `time`) VALUES (?, ?, ?, ?)', [email, auctionId, newBid, dateTimeNow]);
        await mysql.query('UPDATE tbl_auction SET price=? WHERE auctionID=?', [newBid, auctionId]);
        let updatedResultsAuction = await mysql.query('SELECT a.*, count(ua.user_auction_ID) as numberOfBids FROM tbl_auction a left join tbl_user_auction ua on a.auctionID = ua.auctionID WHERE a.auctionID=? group by a.auctionID', [auctionId]);
        await mysql.end();
        return generateResponse(200, updatedResultsAuction);
      } else {
        return generateResponse(400, {
          message: 'New bid must be greater than current price.'
        });
      }
    } else {
      return generateResponse(400, {
        message: 'Current auction is not active.'
      });
    }
  }
  catch (error) {
    return generateResponse(400, {
      message: "There was an error creating a bid."
    });
  }
};
