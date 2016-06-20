
function NameGeneratorExtensionForm(document) {
    this.document = document;
    this.valuesMap = {
        firstName: 'firstname',
        lastName: 'lastname',
        email: 'email',
        password: 'password'
    };
    this.init();
};

NameGeneratorExtensionForm.prototype.init = function () {
    for (var valueKey in this.valuesMap) {
        this['get' + valueKey.capitalizeFirstLetter() + 'Field'] = this.createGetFieldFunction(valueKey);
        this[valueKey] = this.createGetSetFunction(valueKey);
    }
};

NameGeneratorExtensionForm.prototype.createGetFieldFunction = function (valueKey) {
    return function () {
        if (this[valueKey + 'Field'] == null) {
            this[valueKey + 'Field'] = this.getElement(this.valuesMap[valueKey]);
        }

        return this[valueKey + 'Field'];
    };
};

NameGeneratorExtensionForm.prototype.createGetSetFunction = function (valueKey) {
    return function (value) {
        return this['get' + valueKey.capitalizeFirstLetter() + 'Field']().val(value);
    };
};

NameGeneratorExtensionForm.prototype.getGeneratorOption = function () {
    return this.getElement('generatortype').val();
};

NameGeneratorExtensionForm.prototype.getLoadOption = function () {
    return this.getElement('savednames').val();
};

NameGeneratorExtensionForm.prototype.fill = function (fakeNameInfo) {
    for(var valueKey in this.valuesMap) {
        this[valueKey](fakeNameInfo[valueKey]);
    }
};

NameGeneratorExtensionForm.prototype.setGeneratorInfo = function (info) {
    this.getElement('generatorurl').text(info.url);
    this.getElement('generatorurl').attr('href', info.url);
};

NameGeneratorExtensionForm.prototype.alias = function (value) {
    if (value == null) {
        return this.getElement('alias').val();
    }
    return this.getElement('alias').val(value);
};

NameGeneratorExtensionForm.prototype.fillSavedNamesSelector = function (savedNames) {
    var select = this.getElement('savednames');
    this.clearSelect(select);
    for (var key in savedNames) {
        if (savedNames.hasOwnProperty(key)) {
            var element = savedNames[key];
            var option = document.createElement('option');
            option.text = key;
            option.value = key;
            select.append(option);
        }
    }
};

NameGeneratorExtensionForm.prototype.changeSavedNamesOption = function (alias) {
    this.getElement('savednames').val(alias);
};

NameGeneratorExtensionForm.prototype.changeSavedNamesOption = function (alias) {
    this.getElement('savednames').val(alias);
};

NameGeneratorExtensionForm.prototype.clearSelect = function (select) {
    select.empty();
};

NameGeneratorExtensionForm.prototype.getElement = function (id) {
    return $('#' + id);
};
