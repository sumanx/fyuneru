#!/usr/bin/env node

if(process.argv.length < 4){
    console.log("Usage: node client.js <SERVER_ADDRESS>:<SERVER_PORT> UDP_PORT1 UDP_PORT2 ...");
    process.exit();
}

var SERVERADDR = process.argv[2],
    PORTS = process.argv.slice(3);
for(var i=0; i<PORTS.length; i++) PORTS[i] = parseInt(PORTS[i], 10);

var io = require('socket.io-client');
var SERVERURL = "ws://" + SERVERADDR;
var socket = io(SERVERURL);
var UDPAutoConnector = require('./udpAutoConnector');

console.log("Connecting to server: " + SERVERURL);

var UDPPorts = [];
for(var i=0; i<PORTS.length; i++){
    UDPPorts.push(UDPAutoConnector(PORTS[i]));
}

socket.once('connect', function(){
    console.log('connected to server');
    for(var i=0; i<PORTS.length; i++){
        UDPPorts[i].on('data', function(data){
            socket.emit('data', data);
        });
    }
    socket.on('data', function(data){
        var i = Math.floor(UDPPorts.length * Math.random());
        UDPPorts[i].send(data);
    });
});
