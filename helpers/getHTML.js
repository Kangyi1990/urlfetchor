/**
 * Created by dufl on 2/27/2016.
 */
var request=require('request');
var Q=require('q');
var Enums=require('../data/enums');
var validUrl=require('valid-url');

var gethtml={};

gethtml.getByURL=function(url){
    return Q.promise(function(resolve, reject){
        if(validUrl.isUri(url)){
            request(url, function(err, response, body){
                if(err){
                    return reject(err);
                }
                else if(!err && response.statusCode == 200){
                    return resolve(body);
                }
                else{
                    return reject(Enums.RequestErrors.TargetError)
                }
            })
        }
        else{
            return reject(Enums.RequestErrors.InvalidURL);
        }
    })
}

module.exports=gethtml;