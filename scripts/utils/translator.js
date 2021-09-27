const _ = require('lodash')
const TItem = require('../models/T_Item')
const TItemMall = require('../models/T_ItemMall')
const CItemMall = require('../models/ItemMall');
module.exports = {
    translateItem(itemId) {
        // Look `T_Item.ini`
        const item = _.find(TItem.db, (e) => e.id == itemId)
        // Look `T_ItemMall.ini`
        const itemMall = _.find(TItemMall.db, (e) => e.id == itemId)

        const hasItemTranslate = !!item;
        const hasItemMallTranslate = !!itemMall
        
        if(hasItemMallTranslate && hasItemMallTranslate) {
            throw new Error("Exists on item mall and item db")
        }

        if(hasItemMallTranslate) {
            return item.name
        } else if(hasItemTranslate) {
            return item.name
        } else {
            const cItem = CItem
            return cItem.name
        }

        // If not use C_ItemMall name
    }
}