const testPostController = async (req, res) => {
  const { name } = req.body;
  res.status(200).send(`Your name is ${name}`);
};

module.exports = { testPostController };
