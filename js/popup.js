
$(document).ready(function () {
    var nameGenerator = new NameGeneratorExtension(document, [
        new RandomUserGenerator(),
        new UiNamesGenerator(),
        new RandomProfileGenerator()
    ]);

    $('#refreshbtn').click(function () {
        nameGenerator.refresh();
    });

    $('#savebtn').click(function () {
        nameGenerator.save();
    });

    $('#loadbtn').click(function () {
        nameGenerator.load();
    });

    $('#generatortype').change(function () {
        nameGenerator.changeGenerator(true);
    });

    $('#error-message .close').click(function () {
        $('#error-message').hide();
    });

    $('body').on('click', 'a', function () {
        if ($(this).attr('action-in') != 'popup') {
            chrome.tabs.create({ url: $(this).attr('href') });
        }
    });
    var clipboard = new Clipboard('.copy-button');
    clipboard.on('error', function(e) {
        $('#error-message').show();
    });
});
