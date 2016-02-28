/**
 * Created by dufl on 2/27/2016.
 */
var config=require('../config/config');
var urlfetchor=require('mongoskin').db(config.db_url);
var Q=require('q');
var moment=require('moment');
var uuid=require('node-uuid');
var request = require('request');
var Enums=require('../data/enums');
var getHTML=require('./getHTML');

var jobs=urlfetchor.collection('jobs');

var jobdb={};

jobdb.createNewJob=function(url){
    return Q.promise(function(resolve, reject){
        var jobguid=uuid.v4();
        var job={};
        job.jobguid=jobguid;
        job.url=correctUrl(url);
        job.createdtimestamp=moment().unix();
        jobs.insert(job, function(err, result){
            if(err){
                return reject(err);
            }
            else{
                return resolve(jobguid);
            }
        })
    })

}

jobdb.executeJob=function(jobguid){
    return Q.promise(function(resolve, reject){
        jobs.findOne({jobguid:jobguid}, function(err, result){
            if(err){
                return reject(err);
            }
            else if(!err && !result){
                return reject(Enums.JobErrors.InvalidJobGUID);
            }
            else if(!err && result && !result.work){
                return getHTML.getByURL(result.url)
                    .then(function(htmlBody){
                        jobs.update({jobguid:jobguid},{$set:{work:htmlBody}},function(err, result){
                            if(err){
                                return reject(err);
                            }
                            else{
                                return resolve(result);
                            }
                        })
                    })
            }
            else{
                return resolve({});
            }
        })
    })
}


jobdb.getJobResult=function(jobguid){
    return Q.promise(function(resolve, reject){
        jobs.findOne({jobguid:jobguid}, function(err, result){
            if(err){
                return reject(err);
            }
            else if(!err && !result){
                return reject(Enums.JobErrors.InvalidJobGUID);
            }
            else if(!err && result && !result.work){
                return reject(Enums.JobErrors.JobNotFinished);
            }
            else{
                var originalHtml=result.work;
                var scriptString=buildScriptString(result.url);
                var modifiedHtml=originalHtml.substr(0, 15)+scriptString+originalHtml.substr(15);
                return resolve(modifiedHtml);
            }
        })
    })
}

function buildScriptString(url){
    return "<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js'></script><script>$(document).ready(function () {var images=document.getElementsByTagName('img');$.each(images, function(index, element){var imgsrc=element.getAttribute('src');var parts=imgsrc.split('/');if(parts[0]==''){imgsrc='"+url+"'+imgsrc;}element.setAttribute('src', imgsrc);});var links=document.getElementsByTagName('a');$.each(links, function(index, element){var linkhref=element.getAttribute('href');var parts=linkhref.split('/');if(parts[0]==''){linkhref='"+url+"'+linkhref;}element.setAttribute('href', linkhref);})})</script>"
}

function correctUrl(url){
    if(url.substr(0, 7)=='http://' || url.substr(0, 8)=='https://'){
        return url;
    }
    else{
        if(url.substr(0, 4)=='www.'){
            return 'http://'+url;
        }
        else{
            return 'http://www.'+url;
        }
    }
}


module.exports=jobdb;
