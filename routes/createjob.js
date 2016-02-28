/**
 * Created by dufl on 2/27/2016.
 */
var express = require('express');
var router = express.Router();
var jobs=require('../helpers/jobs');
var Enums=require('../data/enums');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('createjob', {});
});


router.post('/', function(req,res,next){
    if(req.body.urladdress){
        return jobs.createNewJob(req.body.urladdress)
            .then(function(jobguid){
                res.render('createjob', {jobguid:jobguid});
                jobs.executeJob(jobguid);
            })
            .then(null, function(err){
                res.render('error', {error:err});
            })
    }
    else{
        res.render('error', {error:Enums.RequestErrors.InvalidURL});
    }
})

module.exports=router;