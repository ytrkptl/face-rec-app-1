// import { NODE_ENV } from "../../config";
// Redis Setup
import redis from "ioredis";

const REDIS_URL = process.env.NODE_ENV === "production" ? process.env.UPSTASH_REDIS_URL : "redis://localhost:6379"

// uses "redis://localhost:6379" instead of the object passed to the
// creatClient function if not on docker
const redisClient = new redis(REDIS_URL);

redisClient.on("connect", function (err) {
  if (err) {
    console.log("Could not establish a connection with Redis. " + err);
  } else {
    process.env.NODE_ENV !== "test" && console.log("Connected to Redis successfully!");
  }
});

// use the following function to set a key value pair in redis
const setToken = (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.set(key, value, function (error, result) {
      if (error) {
        reject();
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(err + " error occurred while running setToken in redisHelper")
  );
};

// use the following function to set a key value pair with expiration time instead
const setTokenWithEx = (key, expirationTime, value) => {
  return new Promise((resolve, reject) => {
    redisClient.setex(key, expirationTime, value, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(
      err + " error occurred while running setTokenWithEx in redisHelper"
    )
  );
};

// use the following function to get a single key's value
const getToken = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, function (error, result) {
      if (error) {
        reject();
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(err + " error occurred while running getToken in redisHelper")
  );
};

// use the following function to get multiple keys' values instead.
const getMultipleValues = (keysArray) => {
  return new Promise((resolve, reject) => {
    redisClient.mget(keysArray, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(
      err + " error occurred while running getMultipleValues in redisHelper"
    )
  );
};

// use the following function to get multiple keys' values instead. currently works in conjunction with register-step-2
// to accept only 4 keys
// const getMultipleValues = (key1, key2, key3, key4) => {
//   return new Promise((resolve, reject) => {
//     redisClient.mget([key1, key2, key3, key4], function (error, result) {
//       if (error) {
//         return reject(error);
//       } 
//       return resolve(result);
//     });
//   }).catch((err) =>
//     console.log(
//       err + " error occurred while running getMultipleValues in redisHelper"
//     )
//   );
// };

// use the following function to get a single key's expiration time
// redis returns -2 if the key has expired
const getExpTime = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.ttl(key, function (error, result) {
      if (error) {
        reject();
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(err + " error occurred while running getToken in redisHelper")
  );
};

// use the following function to delete a key
const deleteToken = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(key, function (error, result) {
      if (error) {
        reject();
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(
      err + " error occurred while running deleteToken in redisHelper"
    )
  );
};

// this will check if the provided key already exists
const keyExists = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.exists(key, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(err + " error occurred while running keyExists in redisHelper")
  );
};

// the function below will output all keys from redis that match the argument 'key',
// whose default value is '*', which return all keys from redis
const viewAll = (key = "*") => {
  return new Promise((resolve, reject) => {
    redisClient.keys(key, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(err + " error occurred while running viewAll in redisHelper")
  );
};

// the function below will remove all data from redis database
const flushAllFromRedis = () => {
  return new Promise((resolve, reject) => {
    redisClient.flushdb(function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(err + " error occurred while running flushdb in redisHelper")
  );
};

// increments a key's value
const incrementValue = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.incr(key, function (error, result) {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
  }).catch((err) =>
    console.log(
      err + " error occurred while running incrementValue in redisHelper"
    )
  );
};

// use the following function to set multiple keys and values with expiration time
const setMultipleValuesWithEx = (someKeys, someVals) => {
  return new Promise((resolve, reject) => {
    try {
      let a = redisClient.multi();
      // a.get()
      for (let i = 0; i < someKeys.length; i++) {
        a.set(someKeys[i], someVals[i]);
        a.expire(someKeys[i], 900);
      }
      a.exec();
    } catch (e) {
      reject(false);
    }
    resolve(true);
  });
};
// this function is specific to the logic of this app, therefore the if then statements
// below. You may want to consider using a separate multi app.
// const setMultipleValuesWithEx = (someKeys, someVals) => {
//   return new Promise((resolve, reject) => {
//     try {
//       // add randomId to each key to make it a uniquekey
//       let uniqueKey = someVals[0] + " ";
//       let a = redisClient.multi();
//       // a.get()
//       for (let i = 0; i < someKeys.length; i++) {
//         if (i === 2) {
//           a.set(someKeys[i], someVals[i]);
//           a.expire(someKeys[i], 900);
//         } else {
//           a.set(uniqueKey + someKeys[i], someVals[i]);
//           a.expire(uniqueKey + someKeys[i], 900);
//         }
//       }

//       a.exec();
//     } catch (e) {
//       reject(false);
//     }
//     resolve(true);
//   });
// };

// use the following function to delete multiple keys and values
// this function is specific to the logic of this app, therefore the if then statements
// below. You may want to consider using a separate multi app.
const deleteMultipleKeys = (someKeys) => {
  return new Promise((resolve, reject) => {
    try {
      let a = redisClient.multi();
      // a.get()
      for (let i = 0; i < someKeys.length; i++) {
        a.del(someKeys[i]);
      }
      a.exec();
    } catch (e) {
      reject(false);
    }
    resolve(true);
  });
};

const pushToListArray = (pushDirection = "right", key, values) => {
  try {
    let pushStatus =
      pushDirection === "left"
        ? redisClient.lpush(key, [...values])
        : redisClient.rpush(key, [...values]);
    return pushStatus;
  } catch (error) {
    console.log(error);
  }
};

const addOrCreateSortedSet = (key, values) => {
  try {
    let addOrCreateStatus = redisClient.zadd(key, [...values])
    return addOrCreateStatus;
  } catch (error) {
    console.log(error, "redis error" );
  }
}

// See the following video timestamp node.js example for its benefits:
// https://www.youtube.com/watch?v=jgpVdJB2sKQ&t=1115s
// Basically allows to cache data instead of having to call an api everytime
// will be helpful for caching entire search list or entire card-list as of now.
const getOrSetCache = (key, exp, cb) => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, async (error, data) => {
      if (error) return reject(error);
      if (data != null) return resolve(JSON.parse(data));
      const freshData = await cb();
      await setTokenWithEx(key, exp, JSON.stringify(freshData));
      resolve(freshData);
    });
  });
};

export {
  setToken,
  setTokenWithEx,
  getToken,
  deleteToken,
  keyExists,
  getMultipleValues,
  setMultipleValuesWithEx,
  incrementValue,
  deleteMultipleKeys,
  viewAll,
  flushAllFromRedis,
  getExpTime,
  pushToListArray,
  addOrCreateSortedSet,
  getOrSetCache,
  redisClient,
};
