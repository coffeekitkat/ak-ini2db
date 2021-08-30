const path = require('path');
module.exports = {
    getDataStore: function(name) {
        return path.resolve(__dirname, '..', '..', 'data','converted', `${name}.csv`)
    }
}