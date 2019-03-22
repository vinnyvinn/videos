if(process.env.NODE_ENV === 'production'){
module.exports = {mongoURI:'mongodb+srv://vinnyvinny:Omegadotcom@2580@videos-ypaev.mongodb.net/test'}
}
else{
module.exports = {mongoURI:'mongodb://localhost/videos'}
}