const UserAgent = require('useragent');

// Function to check if the user agent is from a browser
function isBrowser(req) {
    const userAgentString = req.headers['user-agent'];
    const agent = UserAgent.parse(userAgentString);
    return agent.family === 'Other' ? false : true;
  }
module.exports=isBrowser;