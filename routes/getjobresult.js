/**
 * Created by dufl on 2/27/2016.
 */
var express = require('express');
var router = express.Router();
var jobs=require('../helpers/jobs');
var Enums=require('../data/enums');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('getjobresult', {});
});


router.post('/', function(req,res,next){
    if(req.body.jobguid){
        return jobs.getJobResult(req.body.jobguid)
            .then(function(jobwork){
                res.send(jobwork);
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