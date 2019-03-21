var express =require('express');
var app = express();
var port=process.env.PORT || 3000;
var bodyParser = require("body-parser");



///      --------------- AZURE Configuration ---------------------
 // Import database node module
const CosmosClientInterface = require("@azure/cosmos").CosmosClient;

// Database and container IDs
const databaseId = "poodevice";
const containerId = "mycollection";

// Configure database access URI and primary key
const endpoint = "https://mxchip.documents.azure.com:443/";
const authKey = "ejymuGS7EotpYTz3FUvTqfub11zKVvIHPgcrljV7396quoIKgKjSse45QTcSGVRMbSXxrfqNKbSckeFoZ0Rdeg==";

// Instantiate the cosmos client, based on the endpoint and authorization key
const cosmosClient = new CosmosClientInterface({
	useNewUrlParser: true,
	endpoint: endpoint,
	auth: {
	  masterKey: authKey
	},
	consistencyLevel: "Session"
});



//         ------------------ Express Config -----------------------
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', "ejs");



app.get('/', async (req, res) => {

	try {
	  // Open a reference to the database
	  var dbResponse = await cosmosClient.databases.createIfNotExists({
	    id: databaseId
	  });
	  var database = dbResponse.database;	
	  
	  // ... (we will add more code here!)
	  // res.send(databaseId + " Database is connected successfully!");

	} catch (error) {
	  console.log(error);
	  // res.status(500).send("Error with database query: " + error.body);
	}

	// Refer to Collection/Container
	var { container } = await database.containers.createIfNotExists({id: containerId});


	// const queryResponse = await container.items.query(
 //    "SELECT * FROM c WHERE c.id='" + 5 + "'").toArray();
	// console.log(queryResponse.result[0]);

	//Retrieve JSON Documents using Query
	var queryResponse = await container.items.query(
    "SELECT * FROM c WHERE c.PartitionId=2 ").toArray();
	// console.log(queryResponse.result[0]);
	console.log(queryResponse.result[0].EventProcessedUtcTime);

	// Create new object << ASYNC error! 
	var newdate = new Date(queryResponse.result[0].EventProcessedUtcTime);
	console.log(newdate);
	var b = newdate.getUTCMonth() + 1;
	var d = newdate.getUTCDate();
	var y = newdate.getUTCFullYear();
	var H = (newdate.getUTCHours()<10?'0':'') + newdate.getUTCHours();
	var M = (newdate.getUTCMinutes()<10?'0':'') + newdate.getUTCMinutes();
	var S = (newdate.getUTCSeconds()<10?'0':'') + newdate.getUTCSeconds();
	var newdate1 = (b + "/" + d + "/" + y + ", " + H + ":" + M + ":" + S);
	console.log(b + "/" + d + "/" + y + ", " + H + ":" + M + ":" + S);


	res.render("index",{newdate1:newdate1});
  // ... (we will add more code here!)
});

// Start the server, listen at port 3000 (-> http://127.0.0.1:3000/)
// Also print a short info message to the console (visible in
// the terminal window where you started the node server).
app.listen(3000, () => console.log('Example app listening on port 3000!'))


