if (process.env.NODE_ENV !== 'production') require('dotenv').config();

// Redis Setup
const redis = require('redis');

// You will want to update your host to the proper address in production
const redisClient = redis.createClient(process.env.REDIS_URL);

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const getToken = key => {
  return new Promise((resolve, reject) => {
    redisClient.get(key, function(error, result) {
      if (error) {
        reject()
      }
      resolve(result)
    })
  }).catch(err=>console.log(err + ' from redisHelper.js line 19'))
}

const deleteToken = (key) => Promise.resolve(redisClient.del(key));

// this will check if the provided key already exists
const keyExists = (key) => {
  return new Promise((resolve, reject) => {
    redisClient.exists(key, function (error, result) {
    if (error) {
      reject(error)
    }
    resolve(result)
    });
  })
}

// the function below will output all keys from redis that match the argument 'key',
// whose default value is '*', which return all keys from redis
const viewAll = (key='*')=> redisClient.keys(key, function (error, result) {
  if (error) {
    throw error;
  }
  return result;
});

// the function below will remove all data from redis database
const flushAllFromRedis = () => redisClient.flushdb(function (err, succeeded) {
    console.log(succeeded); // will be true if successfull
});

const getMultipleValues = (key1, key2, key3, key4) => {
  return new Promise((resolve, reject) => {
    redisClient.mget(key1, key2, key3, key4, function (error, result) {
    if (error) {
      reject(error);
    }
    resolve(result);
  })
})}

const setMultipleValuesWithEx = (someKeys, someVals) => {
  return new Promise((resolve, reject) => {

    try {
      // add randomId to each key to make it a uniquekey
      let uniqueKey = someVals[0] + ' ';
      let a = redisClient.multi();
      // a.get()
      for(let i = 0; i< someKeys.length; i++) {
        if(i===2) {
          a.set(someKeys[i], someVals[i])
          a.expire(someKeys[i], 3600)
        } else {
          a.set(uniqueKey + someKeys[i], someVals[i])
          a.expire(uniqueKey + someKeys[i], 3600)
        }
      }

      a.exec();
      
    } catch(e) {
      reject(false)
    }
    resolve(true)
  })
}

module.exports = {
  redisClient: redisClient,
  getToken: getToken,
  setToken: setToken,
  deleteToken: deleteToken,
  keyExists: keyExists,
  getMultipleValues: getMultipleValues,
  setMultipleValuesWithEx: setMultipleValuesWithEx,
  viewAll: viewAll,
  flushAllFromRedis: flushAllFromRedis
}