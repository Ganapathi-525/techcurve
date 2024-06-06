const express = require("express");
const cors = require("cors");
const bodyparser = require("body-parser");

const mongoose=require("mongoose");


const app = express();


app.use(cors());
app.use(bodyparser.json());

// const mongodbclient=MongoClient;
const url="mongodb://localhost:27017/techcurve"



const prlinesItems=require("./model/PrLineItems");
const getVendorUsers=require("./model/vendor");
const { MongoClient } = require("mongodb");

async function database(){
    const client=new MongoClient(url,{ useNewUrlParser: true, useUnifiedTopology: true })
    try {
        await client.connect()
        console.log("databse is connected ")
        return true
    } catch (error) {

        if(error)console.log(error,"is not connected")
            return false
        
    }


}
database();

app.get('/api/getVendorUsers', async (req, res) => {
    const { prId, custOrgId } = req.query;

    if (!prId ||!custOrgId) {
        return res.status(400).json({ error: 'Both prId and custOrgId are required' });
    }

    try {
        // Example query, adjust according to your actual data structure
        const pipeline = [
            { $match: { purchaseRequestId: prId, custOrgId: custOrgId } },
            { $unwind: '$suppliers' },
            { $group: { _id: '$suppliers', supplierIds: { $push: '$$ROOT' } } },
            { $replaceRoot: { newRoot: { $mergeObjects: "$supplierIds" } } }
        ];

        const supplierDocs = await prlinesItems.aggregate(pipeline);

        // Fetch admin users matching supplier IDs
        const adminUsers = await getVendorUsers.find({
            VendorOrganizationId: { $in: supplierDocs.map(doc => doc._id) },
            Role: 'Admin'
        }, { UserName: 1, Name: 1, _id: 0 });

        // Format response
        const result = adminUsers.map(user => ({
            supplierId: user.VendorOrganizationId,
            UserName: user.UserName,
            Name: user.Name
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
});










app.listen(3000, () => console.log("hlo server is running"))

