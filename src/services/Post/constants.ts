export const PIPELINE = [
  {
    $lookup: {
      from: 'users',
      localField: 'author',
      foreignField: '_id',
      as: 'authorDetails'
    }
  },
  { $unwind: '$authorDetails' },
  {
    $addFields: {
      'author.username': '$authorDetails.username',
      'author._id': '$authorDetails._id'
    }
  },
  {
    $lookup: {
      from: 'users',
      localField: 'usersLike',
      foreignField: '_id',
      as: 'usersLikeDetails'
    }
  },
  {
    $addFields: {
      'usersLike': {
        $map: {
          input: '$usersLikeDetails',
          as: 'likeUser',
          in: {
            'username': '$$likeUser.username',
            '_id': '$$likeUser._id'
          }
        }
      }
    }
  },
  {
    $project: {
      'authorDetails': 0,
      'usersLikeDetails': 0
    }
  }
]