var twilio = require('twilio');
var SurveyResponse = require('../models/SurveyResponse');
var survey = require('../survey_data');

// Handle SMS submissions
module.exports = function(request, response) {
    var phone = request.body.From;
    var input = request.body.Body;

    // respond with message TwiML content
    function respond(message) {
        var twiml = new twilio.TwimlResponse();
        twiml.message(message);
        response.type('text/xml');
        response.send(twiml.toString());
    }

    // Check if there are any responses for the current number in an incomplete survey response
    SurveyResponse.findOne({
        phone: phone,
        complete: false
    }, function(err, doc) {
        if (!doc) {
            var newSurvey = new SurveyResponse({
                phone: phone
            });
            newSurvey.save(function(err, doc) {
                // Skip the input and just ask the first question
                handleNextQuestion(err, doc, 0);
            });
        } else {
            // After the first message, start processing input
            SurveyResponse.advanceSurvey({
                phone: phone,
                input: input,
                survey: survey
            }, handleNextQuestion);
        }
    });

    // Ask the next question based on the current index
    function handleNextQuestion(err, surveyResponse, questionIndex) {
        var question = survey[questionIndex];
        var responseMessage = '';

        if (err || !surveyResponse) {
            return respond('I am terribly sorry, but an error has occurred. '
                + 'Please retry responding.');
        }

        // If question is null, we're done!
        if (!question) {
            return respond('Woohoo! I feel like i have a much better picture of where you stand and how Healthways can help you live a healthier life. I have calculated your Well-being 5 score as a 78/100. I believe we can improve that score over this coming year. Based what I have gathered, you might benefit from using our QuitNet app to quit smoking. – Check it out here: https://itunes.apple.com/us/app/quitnet-stop-smoking-quit/id968824591?mt=8#');
        }

        // Add a greeting if this is the first question
        if (questionIndex === 0) {
            responseMessage += 'Hello there! I am Eli your personal wellness scientist. I am here to better understand where you think you stand regarding your health. Please help me to better understand you – ';
        }

        // Add question text
        responseMessage += question.text;

        // Add question instructions for special types
        // if (question.type === 'boolean') {
        //     responseMessage += " – Yes, No, or IDK for 'I don't know'";
        // }

        // Add follow conditional follow up question
        // if (question.followUpTriggers !== 0) {
        //     return respond(question.followUp);
        // }

        // reply with message
        respond(responseMessage);
    }
};