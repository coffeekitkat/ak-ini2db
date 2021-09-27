const DBConfig = require('../config/db')

module.exports = function (name) { 
    function getDatastore() {
        return DBConfig.getDataStore(name);
    }

    return {
        getDatastore
    }
}