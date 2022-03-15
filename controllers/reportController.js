const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const Report = require('./../models/reportModel');

exports.createReport = catchAsync(async (req,res, next) => {

    //console.log(req);
    if(!req.body.marketID && !req.body.cmdtyID){
        return next(new AppError("Please provide marketID and cmdtyID",400));
    }

    const report = await Report.findOne({
        marketID : req.body.marketID,
        cmdtyID : req.body.cmdtyID
    });
    //console.log(report);
    if(!report) {
        if(req.body.priceUnit) req.body.priceUnit = "kg";
        if(req.body.timestamp) delete req.body.timestamp;
        req.body.price = req.body.price / req.body.convFctr;
        req.body.convFctr = 100;

        const report = await Report.create(req.body);

        res.status(201).json({
            status: "success",
            reportID: report._id
        });
    }
    else{
        report.price = ((req.body.price / req.body.convFctr) + report.price) / 2;
        if(!report.userID.includes(req.body.userID))
            {   
            if(typeof(req.body.userID) === "string")
                {
                    report.userID.push(req.body.userID);
                }
            }
        report.timestamp = Date.now();

        if(req.body.marketName) report.marketName = req.body.marketName;
        if(req.body.marketType) report.marketType = req.body.marketType;
        if(req.body.cmdtyName) report.cmdtyName = req.body.cmdtyName;
        if(req.body.priceUnit) report.priceUnit = req.body.priceUnit;

        const rep = await report.save();

        res.status(201).json({
            status: "success",
            reportID: rep._id
        });
    }
});

exports.getReport = catchAsync(async (req,res,next) => {
    const report = await Report.find({reportID : req.query._id}).select('-__v -convFctr');
    if(report.length === 0) return next(new AppError("Record not found",404));
    res.status(200).json({
        report
    });
});
