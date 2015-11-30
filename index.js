var ModAPI = require('modapi')
var _ = require('lodash')
var fs = require('fs')
var path = require('path')

var readLocalFile = function(name) {
  return fs.readFileSync(path.join(__dirname, name))
}

var qml = ModAPI.QMLFile("Controls/SelfSwitchBox.qml")
var node = qml.root.node

node.describe = "LabeledEditableComboBox"
node.publicMember("currentCharacter").statement = "editText"
node.object("model", "['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']")
node.object("onEditTextChanged", [
  '{',
  '    var character = editText;',
  '    if (member.length && DataManager.setObjectValue(object, member, character)) {',
  '        helper.setModified();',
  '        modified();',
  '    }',
  '}',
].join("\n"))
node.function("setCharacter", [
  'function setCharacter(character) {',
  '    for (var i = 0; i < model.length; i++) {',
  '        if (model[i] === character) {',
  '            currentIndex = i;',
  '            break;',
  '        }',
  '    }',
  '    editText = character;',
  '}',
].join("\n"))

qml.save()
