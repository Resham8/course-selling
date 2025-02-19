let numberOfRequestsForUser = {};

let resetInterval;

function rateLimitter(req, res, next) {
  const userId = req.userId;

  if (!userId) {
    return res.status(400).json({
      message: "Please log in",
    });
  }

  const currentTime = Math.floor(Date.now() / 1000);

  if (!numberOfRequestsForUser[userId]) {
    numberOfRequestsForUser[userId] = {
      count: 0,
      lastRequestTime: currentTime,
    };
  }

  const userData = numberOfRequestsForUser[userId];

  if (currentTime === userData.lastRequestTime) {
    userData.count++;
  } else {
    userData.count = 1;
    userData.lastRequestTime = currentTime;
  }

  if (userData.count > 5) {
    return res.status(404).json({ error: "Too many requests" });
  }

  next();
}

resetInterval = setInterval(() => {
  numberOfRequestsForUser = {};
}, 1000);

module.exports = {
  rateLimitter: rateLimitter,
};
