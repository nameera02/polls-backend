export const attachSocketToRequest=(req, res, next)=> {
    if (req.socket) {
      // Make sure the socket is available in the route
      req.socket = req.socket;
    } else {
      console.log('No socket found');
    }
    next();
  }  