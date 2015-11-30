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

var currentCharacter = _.find(node.publicMembers, {name: "currentCharacter"})
currentCharacter.statement = "editText"

var setCharacter = _.find(node.functions, {name: "setCharacter"})
setCharacter.content = [
  'function setCharacter(character) {',
  '    for (var i = 0; i < model.length; i++) {',
  '        if (model[i] === character) {',
  '            currentIndex = i;',
  '            break;',
  '        }',
  '    }',
  '    editText = character;',
  '}',
].join("\n");

var onEditTextChanged = node.newObject()
onEditTextChanged.name = "onEditTextChanged"
onEditTextChanged.value = [
  '{',
  '    var character = editText;',
  '    if (member.length && DataManager.setObjectValue(object, member, character)) {',
  '        helper.setModified();',
  '        modified();',
  '    }',
  '}',
].join("\n");

var model = _.find(node.objects, {name: "model"})
model.value = "['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']"

qml.save()
