import { parse } from 'useragent';

// Function to check if the user agent is from a browser
function isBrowser(req) {
    const userAgentString = req.headers['user-agent'];
    const agent = parse(userAgentString);
    return agent.family === 'Other' ? false : true;
  }
export default isBrowser;