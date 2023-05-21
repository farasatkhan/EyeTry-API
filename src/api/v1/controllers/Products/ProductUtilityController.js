var FrameModel = require('../../models/Frames');


exports.frameIdExists = (req, res, next) => {

    const frameId = req.params.frameId;

    FrameModel.findById({_id: frameId}).then((response) => {

        if (!response) return res.status(400).json({message: "Frame id does not exist"});

        res.locals.frameId = frameId;

        next();
        
    }).catch((error) => {
        return res.status(400).json({message: "Frame id does not exist"});
    });
}