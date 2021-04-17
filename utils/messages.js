const moment = require('moment');
const { imageUser } = require('./config')

function formatMessage(username, text, image) {
  if(image === undefined || image === '' || typeof image === undefined) image = imageUser
  return {
    username,
    text,
    time: moment().format('h:mm a'),
    image
  };
}

module.exports = formatMessage;
