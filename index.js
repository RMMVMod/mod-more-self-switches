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
node.publicMember("currentCharacter").statement = "model.get(currentIndex).name"
node.object("model", "ListModel { id: listModel }")
node.object("textRole", '"name"')

node.object("onEditTextChanged", [
  '{',
  '    var character = editText;',
  '    setCharacter(character, true);',
  '    if (member.length && DataManager.setObjectValue(object, member, character)) {',
  '        helper.setModified();',
  '        modified();',
  '    }',
  '}',
].join("\n"))

node.object("onCurrentIndexChanged", [
  '{',
  '    var character = model.get(currentIndex).name.toString();',
  '    if (member.length && DataManager.setObjectValue(object, member, character)) {',
  '        helper.setModified();',
  '        modified();',
  '    }',
  '}',
].join("\n"))

node.object("Component.onCompleted", [
  '{',
  '    initModel();',
  '}',
].join("\n"))

node.function("setCharacter", [
  'function setCharacter(character, notForce) {',
  '    initModel();',
  '    if (!notForce) currentIndex = 0;',
  '    for (var i = 0; i < model.count; i++) {',
  '        if (model.get(i).name === character) {',
  '            if (!notForce || (notForce && currentIndex !== i)) currentIndex = i;',
  '            return;',
  '        }',
  '    }',
  '    if (!model.get(model.count - 1).input) {',
  '        model.append({"name": "", "input": true});',
  '    }',
  '    model.get(model.count - 1).name = character;',
  '    if (!notForce || (notForce && currentIndex !== model.count - 1)) currentIndex = model.count - 1;',
  '}',
].join("\n"))

var x = node.function("initModel", [
  'function initModel() {',
  '    if (model.count == 0) {',
  '        model.append({"name": "A"});',
  '        model.append({"name": "B"});',
  '        model.append({"name": "C"});',
  '        model.append({"name": "D"});',
  '    }',
  '}',
].join("\n"))

qml.save()
