const mongoose=require("mongoose");

const PrLineItemsShema=mongoose.Schema({
    suppliers:"string",
    custOrgId:"string",
     purchaseRequestId:"string"
})


const PrLineItems=mongoose.model("prlinesItems",PrLineItemsShema);

module.exports=PrLineItems
// exports.module(PrLineItems)
