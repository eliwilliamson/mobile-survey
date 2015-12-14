// Hard coded survey questions
module.exports = [
    {
        text: 'How do you personally feel about your life at this time? Please respond with a number 1-10',
        type: 'number'
    },
    {
        text: 'Where do you think you will stand about five years from now? Please respond with a number 1-10',
        type: 'number'
    },
    {
        text: 'Have there been times in the past twelve months when you did not have enough money?',
        type: 'boolean',
        followUpTriggers: 'yes' || 'y',
        followUp: 'Was that A.) To pay for health care and/or medicines that you or your family needed? or B.) To buy food that you or your family needed? Please respond "A" or "B"'
    },
    {
        text: 'Do you smoke?',
        type: 'boolean'
    },
    {
        text: 'What is your approximate weight?',
        type: 'text'
    }
];