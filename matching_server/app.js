// Core module
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.PORT || 3000;
const moment =  require('moment');
const matchingSpace = io.of('/matching');

//redis module
const redis = require('redis');
const redisClient = redis.createClient(6379, '192.168.0.23');

// DB module
const mysql = require('mysql');

//Todo make connection pool and then manage them
const connection = mysql.createConnection(require('./db/db_info'));
connection.connect(function (err) {
    if (err) {
        console.log(err);
        throw err;
    }
    else {
        console.log('connect mysql server');
    }
});

// Customizing module
const sessionManage = require('./redis_dao/session');

// Util
const game = require('./util/matchingGame');
let player = {};
let waitingPlayer = [];
const gameLobbyA = 'lobby_a';

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

matchingSpace.on('connection', function (socket) {
    console.log("someone connects this server");
    socket.on('ack', function (data) {
        console.log(data);
        //TODO BAD REQUEST EXCEPTION
        let key = "session:" + data.session_token;
        sessionManage.isValidSession(redisClient, key, function (isValidSession) {
            if (isValidSession) {
                sessionManage.findSessionData(redisClient, key, function (value) {
                    let newSession = JSON.parse(value);
                    newSession.last_updated_at = moment().format("YYYY-MM-DDThh:mm:ss");
                    sessionManage.updateSession(redisClient, key, JSON.stringify(newSession));
                    socket.emit('authorized', {
                        permit : true,
                        afterEvent : "none"
                    });

                    let selectQuery = "SELECT * FROM players WHERE nickname='" + data.nickname + "'";


                    connection.query(selectQuery, function (err, result, field) {
                        if (err) {
                            socket.emit('getData', {
                                dataAccess : false,
                                afterEvent : "disconnect"
                            });
                            console.log(err);
                            throw err;
                        }

                        player[socket.id] = result[0];
                        player[socket.id].socket_id = socket.id;
                        //connection.end();
                        socket.emit('getData', {
                            dataAccess : true,
                            afterEvent : "ready"
                        });
                    });
                });
            }
            else {
                socket.emit('authorized', {
                    permit : false,
                    afterEvent : "disconnect"
                });
                socket.disconnect();
            }
        });

    });

    socket.on('ready', function (data) {
        //TODO delete event it is just testing event
        console.log(player[socket.id]);
        if (player[socket.id] == null) {
            socket.emit('retryReady', { error: "connection DB is fail"});
            return;
        }

        socket.join(gameLobbyA, function () {
            matchingSpace.to(gameLobbyA).emit('entry', {
                entryUser: player[socket.id].nickname,
                entryUserScore: player[socket.id].score,
                entryUserTier: player[socket.id].tier
            });
        });
    });

    socket.on('gameStart', function () {
        //TODO modulation && 동시에 접속했을 때의 이슈 && 매칭이 실패했을 때의 이슈
        //TODO 매칭 결과 redis에 저장
        if (waitingPlayer.length !== 0) {
            let matchingResultData = {};
            let opponentPlayer = waitingPlayer.shift();
            matchingResultData.playersId = [player[socket.id].nickname, opponentPlayer.nickname];
            matchingResultData.roomId = game.generateRoomId();
            game.saveMatchingResultRedis(redisClient, player[socket.id], opponentPlayer, matchingResultData.roomId);
            socket.emit('matchingResult', matchingResultData);
            matchingSpace.to(opponentPlayer.socket_id).emit('matchingResult', matchingResultData);
        }
        else {
            waitingPlayer[waitingPlayer.length] = player[socket.id];
        }
    });

    socket.on('sendMessage', function (msg) {
        matchingSpace.to(gameLobbyA).emit('receiveMessage', {
            from: player[socket.id].nickname,
            message: msg.message
        });
    });

    socket.on('disconnect', function (reason) {
        //console.log(reason);
        console.log('somenoe disconnect this server');
        console.log(socket.id);
        if (player[socket.id] !== undefined ) {
            socket.leave(gameLobbyA, function () {
                matchingSpace.to(gameLobbyA).emit('leave', {
                    leaveUser: player[socket.id].nickname,
                    leaveUserScore: player[socket.id].score,
                    leaveUserTier: player[socket.id].tier
                });
                //delete element in player object
                delete player[socket.id];
                console.log(player);
            });
        }
    });
});

server.listen(port, function () {
    console.log('matching server listening on port :' + port);
});