import superscript from 'superscript';
import express from 'express';
import bodyParser from 'body-parser';

const server = express();
const PORT = process.env.PORT || 5000;

server.use(bodyParser.json());

let bot;

server.get('/superscript', (req, res) => {
  if (req.query.message) {
    return bot.reply('user1', req.query.message, (err, reply) => {
      res.json({
        message: reply.string,
      });
    });
  }
  return res.json({ error: 'No message provided.' });
});

// TODO : POST방식으로 JSON 입력받도록 수정
server.post('/superscript', (req, res) => {

  if (checkRequestData(req.body)) {
    return bot.reply(req.body.user, req.body.message, (err, reply) => {
      res.json({
        message: reply.string,
      });
    });
  }
  return res.json({ error: 'No user or message provided.' });
});

function checkRequestData(reqInput){
  if (reqInput.user != null && reqInput.user.length > 0 ) {
    if ( reqInput.message != null && reqInput.message.length > 0 ) {
      return true;
    }
  }
  return false;
}
// END : POST방식으로 JSON 입력받도록 수정

const options = {
  factSystem: {
    clean: true,
  },
  importFile: './data.json',
};

superscript.setup(options, (err, botInstance) => {
  if (err) {
    console.error(err);
  }
  bot = botInstance;

  server.listen(PORT, () => {
    console.log(`===> 🚀  Server is now running on port ${PORT}`);
  });
});

server.get('/reload', function (req, res) {
  // options = {importFile: './data.json'};
  reloadScripts(req, res);
});
function reloadScripts(req, res){
  superscript.setup(options, (err, botInstance) => {
    if (err) {
      console.error(err);
      return res.json({error:'Loading bot data is failed.'});
    }
    bot = botInstance;
    console.log('reloaded pattern data.');
    return res.json({message:'Bot data is succcessfully loaded.'});
  });
}


// TODO : testing.....cli에서 parse 하던 것을 소스로 옮겨보기
var _commander = require('commander');
var _commander2 = _interopRequireDefault(_commander);
var _fs = require('fs');
var _fs2 = _interopRequireDefault(_fs);
var _ssParser = require('ss-parser');
var _ssParser2 = _interopRequireDefault(_ssParser);
var _sfacts = require('sfacts');
var _sfacts2 = _interopRequireDefault(_sfacts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

server.get('/rebuild', function (req, res) {
  _commander2.default.version('1.0.2')
    .option('-p, --path [type]', 'Input path', './chat')
    .option('-o, --output [type]', 'Output options', 'data.json')
    .option('-f, --force [type]', 'Force save if output file already exists', true)
    .option('-F, --facts [type]', 'Fact system files path', files => files.split(','), [])
    .option('--host [type]', 'Mongo Host', 'localhost')
    .option('--port [type]', 'Mongo Port', '27017')
    .option('--mongo [type]', 'Mongo Database Name', 'superscriptParse')
    .option('--mongoURI [type]', 'Mongo URI')
    .parse(process.argv);

  const mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || _commander2.default.mongoURI || `mongodb://${_commander2.default.host}:${_commander2.default.port}/${_commander2.default.mongo}`;

  _fs2.default.exists(_commander2.default.output, exists => {
    if (exists && !_commander2.default.force) {
      console.log('File', _commander2.default.output, 'already exists, remove file first or use -f to force save.');
      // return process.exit();
      return;
    }

    return _sfacts2.default.load(mongoURI, _commander2.default.facts, true, (err, factSystem) => {
      _ssParser2.default.parseDirectory(_commander2.default.path, { factSystem }, (err, result) => {
        if (err) {
          console.error(`Error parsing bot script: ${err}`);
        }
        _fs2.default.writeFile(_commander2.default.output, JSON.stringify(result, null, 4), err => {
          if (err) throw err;
          console.log(`Saved output to ${_commander2.default.output}`);
          // process.exit();
          reloadScripts(req, res);
          return;
        });
      });
    });
  });
});
// END : testing.....cli에서 parse 하던 것을 소스로 옮겨보기



