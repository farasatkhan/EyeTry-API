var FAQModel = require('../../models/FAQ/FAQ.js');

exports.addFAQ = async (req, res, next) => {
    try {

        const { question, answer } = req.body;

        const faqResult = await FAQModel.create({
            question: question,
            answer: answer
        });

        if (!faqResult) return res.status(400).json(
            {
                message: "400: Error occured while adding faq"
            });

        res.status(200).json(
            {
                FAQId: faqResult._id,
                message: "faq are added successfully."
            }
        );

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured when adding faq."})
    }
}

exports.viewFAQ = async (req, res, next) => {
    try {

        const faqResult = await FAQModel.find({}, {__v: 0, createdAt: 0}).sort({ _id: -1 });

        if (!faqResult) return res.status(400).json(
            {
                message: "400: Error occured while retriving faqs"
            });

        res.status(200).json(faqResult);

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "500: Error occured while retriving faqs."})
    }
}

exports.updateFAQ = async (req, res, next) => {
    const faqId = req.params.faqId;
    const updatedData = req.body;

    try {
        const updatedFaqData = await FAQModel.findByIdAndUpdate(faqId, updatedData, { new: true });

        if (!updatedFaqData) {
        return res.status(404).json({ message: 'FAQ not found' });
        }

        const {_id, question, answer} = updatedFaqData;

        res.status(200).json({ message: 'FAQ updated successfully', updatedFaq: {_id, question, answer}});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the FAQ' });
    }
}

exports.deleteFAQ = async (req, res, next) => {
    const faqId = req.params.faqId;

    try {
        const deletedFaq = await FAQModel.findByIdAndDelete(faqId);
    
        if (!deletedFaq) {
          return res.status(404).json({ message: 'FAQ not found' });
        }
    
        res.status(200).json({ message: 'FAQ deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while deleting the FAQ' });
      }
}