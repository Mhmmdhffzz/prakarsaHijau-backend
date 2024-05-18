const { getDatabase } = require('../config/database');
const { ObjectId } = require('mongodb');

const tipsCollection = () => getDatabase().collection('tips');

const getTips = async (req, res) => {
  try {
    const tips = await tipsCollection().find().toArray();
    res.json({
      status: "success",
      message: "ok",
      data: {
        tips
      }
    });
  } catch (error) {
    console.error(`Error retrieving tips: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving tips",
      error: error.message
    });
  }
};

const getTipById = async (req, res) => {
  const { tipId } = req.params;
  try {
    const tip = await tipsCollection().findOne({ _id: new ObjectId(tipId) });

    if (tip) {
      const owner = await usersCollection.findOne({ _id: new ObjectId(tip.ownerId) });
      const detailedComments = await Promise.all(tip.comments.map(async (comment) => {
        const commentOwner = await usersCollection.findOne({ _id: new ObjectId(comment.ownerId) });
        if (!commentOwner) {
          return {
            id: comment._id.toString(),
            content: comment.content,
            createdAt: comment.createdAt,
            owner: {
              id: null,
              name: "Unknown",
              avatar: ""
            },
            upVotesBy: comment.upVotesBy,
            downVotesBy: comment.downVotesBy
          };
        }

        return {
          id: comment._id.toString(),
          content: comment.content,
          createdAt: comment.createdAt,
          owner: {
            id: commentOwner._id.toString(),
            name: commentOwner.name,
            avatar: commentOwner.avatar
          },
          upVotesBy: comment.upVotesBy,
          downVotesBy: comment.downVotesBy
        };
      }));

      const detailedTip = {
        id: tip._id.toString(),
        title: tip.title,
        body: tip.body,
        category: tip.category,
        createdAt: tip.createdAt,
        owner: {
          id: owner._id.toString(),
          name: owner.name,
          avatar: owner.avatar
        },
        upVotesBy: tip.upVotesBy,
        downVotesBy: tip.downVotesBy,
        comments: detailedComments
      };

      res.json({
        status: "success",
        message: "Tip retrieved",
        data: {
          detailTip: detailedTip
        }
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "Tip not found"
      });
    }
  } catch (error) {
    console.error(`Error retrieving tip with ID ${tipId}: ${error.message}`);
    res.status(500).json({
      status: "error",
      message: "An error occurred while retrieving the tip",
      error: error.message
    });
  }
};

module.exports = {
  getTips,
  getTipById,
};
