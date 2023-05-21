var Users = require('../../src/api/v1/models/User');

exports.deleteVisionAssessmentResult = async (req, res, next) => {
    try {

        const visionAssessmentsResults = await Users.findById({_id: req.user.id}).select('visionAssessments');

        if (!visionAssessmentsResults) return res.status(400).json({message: "400: Error occured while viewing vision assessment results"});


        const clearVisionAssessmentResults = await Users.findByIdAndUpdate(
            { _id: req.user.id }, 
            { $unset: { visionAssessments: 1 }}
        );

        if(!clearVisionAssessmentResults) return res.status(400).json({message: "400: Error occured while deleting vision assessment results"});

        res.status(200).json({message: "Users all vision assessment results are removed."});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured whiling adding products."});
    }
}
