// A naive strategy which simply parse 'uid' from query and then assemble user.
// Throw 401 if 'uid' is not found.
const naiveStrategy = {
  name: 'naive',
  authenticate: function (req) {
    let uid = req.query.uid
    if (uid) {
      let user = {id: parseInt(uid), name: 'user-' + uid}
      this.success(user)
    } else {
      this.fail(401)
    }
  }
}

module.exports = naiveStrategy