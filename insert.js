'use strict';

var request = require('request'),
    bt = require('btoa'),
    Q = require('q');

var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
  version: '0.0.1',
  addHelp: true,
  description: 'Performance check for liveblog client.'
});
parser.addArgument(
  [ '-u', '--username' ],
  {
    help: 'login user.',
    defaultValue: 'admin'
  }
);
parser.addArgument(
  [ '-p', '--password' ],
  {
    help: 'login password.',
    defaultValue: 'admin'
  }
);
parser.addArgument(
  [ '--url' ],
  {
    help: 'host server.',
    defaultValue: 'http://localhost:5000/api'
  }
);
var args = parser.parseArgs();

backendRequest({
    url: args.url + '/auth',
    method: 'POST',
    json: {
        'username': args.username,
        'password': args.password
    }
}).then(function(data){
    var token = data.body.token;
    backendRequest({
        url: args.url + '/blogs',
        method: 'POST',
        json: {
            description: "test",
            members: [],
            title: "test"
        }
    }, token).then(function(dblog){
        var blog = dblog.body._id;
        for(var i = 0; i<2; i++ ){
            backendRequest({
                url: args.url + '/items',
                method: 'POST',
                json: {
                    blog: blog,
                    item_type: "text",
                    test: randomString()
                }
            }, token).then(function(ditem){
                console.log(arguments);
                backendRequest({
                    url: args.url + '/posts',
                    method: 'POST',
                    json: {
                        blog: blog,
                        groups: {  
                           "post_status":"open",
                           "blog": blog,
                           "groups":[  
                              {  
                                 "id":"root",
                                 "refs":[  
                                    {  
                                       "idRef":"main"
                                    }
                                 ],
                                 "role":"grpRole:NEP"
                              },
                              {  
                                 "id":"main",
                                 "refs":[  
                                    {  
                                       "residRef": ditem.body._id
                                    }
                                 ],
                                 "role":"grpRole:Main"
                              }
                           ]
                        }
                    }
                }, token);
            }, function(error){
                console.log(error);
            });
        }
    });
});

function backendRequest (params, token) {
    var deferred = Q.defer();
    params = params || {};
    if (token) {
        if (!params.headers) {
            params.headers = {};
        }
        params.headers.authorization = 'Basic ' + bt(token + ':');
    } else {
        params.rejectUnauthorized = false;
    }
    request(
        params,
        function(error, response, body) {
            if (error) {
                throw new Error(error);
            }
            if (
                (response.statusCode < 200) && (response.statusCode >= 300)
            ) {
                console.log('Request:');
                console.log(response.request.href);
                console.log(response.request);
                console.log('Response:');
                console.log(body);
                throw new Error('Status code: ' + response.statusCode);
            }
            deferred.resolve(response);
        }
    );
    return deferred.promise;
}

var randomIndex = 1;
function randomString(maxLen) {
    return "Hello " + (randomIndex++);
    // maxLen = maxLen || 15;
    // var text = '';
    // var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    // for (var i = 0; i < maxLen; i ++) {
    //     text += possible.charAt(Math.floor(Math.random() * possible.length));
    // }
    // return text;
}