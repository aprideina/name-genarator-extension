import $ from 'jquery';

import { Mask } from './Mask';
import { clearSelect, createOptions } from './Utils';

import { NameGeneratorExtensionForm } from './NameGeneratorExtensionForm';
import { NameGeneratorExtensionSettingsForm } from './NameGeneratorExtensionSettingsForm';
import { NameGeneratorExtensionProfilesForm } from './NameGeneratorExtensionProfilesForm';


function NameGeneratorExtension(document, generators) {
    var self = this;
    this.form = new NameGeneratorExtensionForm(document, function () {
        self.updatePreviousState();
    });
    this.settings = new NameGeneratorExtensionSettingsForm(document, function () {
        self.refresh();
    });
    this.profiles = new NameGeneratorExtensionProfilesForm(document);
    this.generators = generators;
    this.buildGeneratorOptions(document, generators);
    this.generator = this.getGenerator();
    this.mask = Mask($('#loading'), {
        backdrop: 'static',
        keyboard: false
    });
    this.errorMessage = Mask($('#error-message'));
    this.savedNames = {};
    this.previousState = {};

    chrome.storage.local.get(null, function (object) {
        self.savedNames = object.savedNames || {};
        self.profiles.fillSavedNamesSelector(self.savedNames);
        if (object.previousState) {
            self.previousState = object.previousState;
            self.updateFormValues(self.previousState);
        } else {
            self.refresh();
        }
    });

    self.changeGenerator(false);
}

NameGeneratorExtension.prototype.getGenerator = function () {
    var generatorCode = this.settings.getGeneratorOption();
    if (!this.generator || generatorCode !== this.generator.getCode()) {
        this.generator = this.generators.find(generator => {
            return generatorCode === generator.getCode();
        });
    }
    return this.generator;
};

NameGeneratorExtension.prototype.updateFormValues = function (json) {
    this.form.fill(json);
    this.updatePreviousState();
};

NameGeneratorExtension.prototype.buildGeneratorOptions = function (document, generators) {
    var generatorSelect = $('#generatortype');
    clearSelect(generatorSelect);
    var options = generators.map(e => {
        return {
            name: e.getInfo().text,
            value: e.getCode()
        };
    });
    createOptions(document, generatorSelect, options);
};

NameGeneratorExtension.prototype.refresh = function () {
    var self = this;
    self.mask.show();
    var params = self.settings.getGenerationParams();
    this.getGenerator().next({
        params: params,
        onCompleted: json => {
            self.updateFormValues(json);
            self.mask.hide();
        },
        onError: () => {
            self.errorMessage.show();
            self.mask.hide();
        }
    });
};

NameGeneratorExtension.prototype.changeGenerator = function (needRefresh) {
    var generator = this.getGenerator();
    var info = generator.getInfo();
    this.settings.setGeneratorInfo(info);
    this.settings.fillGeneratorParams(info);
    if (needRefresh) {
        this.refresh();
    }
};

NameGeneratorExtension.prototype.save = function () {
    var self = this;
    var alias = self.profiles.alias();
    self.savedNames[alias] = self.form.getState();
    self.updatePreviousState();

    self.profiles.fillSavedNamesSelector(self.savedNames);
    self.profiles.changeSavedNamesOption(alias);
};

NameGeneratorExtension.prototype.updatePreviousState = function () {
    var self = this;
    chrome.storage.local.set({
        'savedNames': this.savedNames,
        'previousState': self.form.getState()
    });
};

NameGeneratorExtension.prototype.load = function () {
    var alias = this.profiles.getLoadOption();
    if (!alias) {
        return;
    }
    this.profiles.alias(alias);
    this.updateFormValues(this.savedNames[alias]);
};

export { NameGeneratorExtension };
