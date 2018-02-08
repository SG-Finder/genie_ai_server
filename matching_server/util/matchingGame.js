
exports.saveMatchingResultRedis = function(redisClient, playerA, playerB, roomId) {
    let inputData = {
        players: [ playerA, playerB ]
    };
    redisClient.hset("roomId", roomId, JSON.stringify(inputData), redisClient.print);
};

exports.isPresentGame = function (redisClient, matchingData) {

};

exports.generateRoomId = function (playerNicknameA, playerNicknameB) {
    //TODO making room key
    return new Date().getTime();
};