'use strict';

var _superscript = require('superscript');

var _superscript2 = _interopRequireDefault2(_superscript);

var _express = require('express');

var _express2 = _interopRequireDefault2(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault2(_bodyParser);

function _interopRequireDefault2(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = (0, _express2.default)();
var PORT = process.env.PORT || 5000;

server.use(_bodyParser2.default.json());

var bot = void 0;

/* Deprecated API */
// server.get('/superscript', (req, res) => {
//   if (req.query.message) {
//     return bot.reply('user1', req.query.message, (err, reply) => {
//       res.json({
//         message: reply.string,
//       });
//     });
//   }
//   return res.json({ error: 'No message provided.' });
// });

// TODO : POST방식으로 JSON 입력받도록 수정
server.post('/superscript', function (req, res) {

  if (checkRequestData(req.body)) {
    return bot.reply(req.body.user, req.body.message, function (err, reply) {
      res.json({
        message: reply.string
      });
    });
  }
  return res.json({ error: 'No user or message provided.' });
});

function checkRequestData(reqInput) {
  if (reqInput.user != null && reqInput.user.length > 0) {
    if (reqInput.message != null && reqInput.message.length > 0) {
      return true;
    }
  }
  return false;
}
// END : POST방식으로 JSON 입력받도록 수정

var options = {
  factSystem: {
    clean: false
  },
  importFile: './data.json',
  useMultitenancy: true,
  tenantId: 'master'
};

_superscript2.default.setup(options, function (err, botInstance) {
  if (err) {
    console.error(err);
  }
  // bot = botInstance;
  bot = botInstance.getBot(options.tenantId);
  bot.importFile(options.importFile, function (err) {
    return console.error(err);
  });
  server.listen(PORT, function () {
    console.log('===> \uD83D\uDE80  Server is now running on port ' + PORT);
  });
});

/* Deprecated */
// server.get('/reload', function (req, res) {
//   // options = {importFile: './data.json'};
//   reloadScripts(req, res);
// });
function reloadScripts(req, res) {
  options.tenantId = req.body.tenantId;
  console.log('tenantId: ', options.tenantId);
  _superscript2.default.setup(options, function (err, botInstance) {
    if (err) {
      console.error(err);
      return res.json({ error: 'Loading bot data is failed.' });
    }
    // bot = botInstance;
    bot = botInstance.getBot(options.tenantId);
    bot.importFile(options.importFile, function (err) {
      return console.error(err);
    });
    console.log('Reloaded pattern data for tenantId [', options.tenantId, '].');
    return res.json({ message: 'Bot data is succcessfully loaded.' });
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

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

server.post('/rebuild', function (req, res) {
  _commander2.default.version('1.0.2').option('-p, --path [type]', 'Input path', './chat').option('-o, --output [type]', 'Output options', 'data.json').option('-f, --force [type]', 'Force save if output file already exists', true).option('-F, --facts [type]', 'Fact system files path', function (files) {
    return files.split(',');
  }, []).option('--host [type]', 'Mongo Host', 'localhost').option('--port [type]', 'Mongo Port', '27017').option('--mongo [type]', 'Mongo Database Name', 'superscriptParse').option('--mongoURI [type]', 'Mongo URI').parse(process.argv);

  var mongoURI = process.env.MONGO_URI || process.env.MONGODB_URI || _commander2.default.mongoURI || 'mongodb://' + _commander2.default.host + ':' + _commander2.default.port + '/' + _commander2.default.mongo;

  _fs2.default.exists(_commander2.default.output, function (exists) {
    if (exists && !_commander2.default.force) {
      console.log('File', _commander2.default.output, 'already exists, remove file first or use -f to force save.');
      // return process.exit();
      return;
    }

    return _sfacts2.default.load(mongoURI, _commander2.default.facts, true, function (err, factSystem) {

      console.log('facts: ', _commander2.default.facts);
      console.log('factSystem: ', factSystem);

      _ssParser2.default.parseDirectory(_commander2.default.path, { factSystem: factSystem }, function (err, result) {
        if (err) {
          console.error('Error parsing bot script: ' + err);
        }
        _fs2.default.writeFile(_commander2.default.output, JSON.stringify(result, null, 4), function (err) {
          if (err) throw err;
          console.log('Saved output to ' + _commander2.default.output);
          // process.exit();
          reloadScripts(req, res);
          return;
        });
      });
    });
  });
});
// END : testing.....cli에서 parse 하던 것을 소스로 옮겨보기