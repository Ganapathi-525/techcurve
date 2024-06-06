const mongoose=require("mongoose");

const VenderItemsShema=mongoose.Schema({
    VendorOrganizationId:"string", 
    UserName:"string", 
    Name:"string",
    Role:"string"
})


const VenderItems=mongoose.model("venderItems",VenderItemsShema);

module.exports=VenderItems