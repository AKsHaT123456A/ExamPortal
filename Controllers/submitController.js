
const submitController = async (_, res) => {
    const visited = require('../Models/visited');
    try {
        var userId = process.env.USER_ID;
        await visited.deleteMany({ userId });
        return res.status(200).json({ message: 'Visited data deleted' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = submitController;