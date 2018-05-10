$(() => {
    chrome.storage.local.get(["copy-issue", "auto-resolution"], function(settings) {
        $('#copy-issue').prop('checked', settings["copy-issue"] || false);
        $('#auto-resolution').prop('checked', settings["auto-resolution"] || false);
    });

    $("#copy-issue").on("change", () => {
        const flg = $('#copy-issue').prop('checked');
        chrome.storage.local.set({"copy-issue": flg});
    });
    $("#auto-resolution").on("change", () => {
        const flg = $('#auto-resolution').prop('checked');
        chrome.storage.local.set({"auto-resolution": flg});
    });
});