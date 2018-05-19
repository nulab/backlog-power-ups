(() => {
const setup = () => {
    setTimeout(() => {

        const script = `(() => {
        	var seq = 1000;
        	function UploadFile(file){
            const now = new Date().getTime()

        		this.file = file;
        		this.size = file.size;
        		this.name = "pasted-" + now + file.name;
        		this.status = 0;
        		this.id = "upload_file_" + now + "_" + seq;
        		seq++;
        	}

          const $commentRoot = $("#commentArea")
          $commentRoot.on("paste", "textarea", function(event){
              const files = event.originalEvent.clipboardData.files
              const length = files.length
              if (length > 0) {
                  if(!$commentRoot.find(".file-upload.view-issue-file-upload").is("visible")) {
                      $("#attachFileButton").click()
                  }


                  setTimeout(() => {
                    const uploader = window.ko.contextFor($commentRoot.find(".file-upload.view-issue-file-upload")[0]).$data.fileUpload.html5Upload
                    for (var i = 0; i < length; i++) {
                        uploader._onQueueAdd(new UploadFile(files[i]))
                    }
                    uploader._trigger("drop_complete")
                  }, 1000)
              }
          })
        })()`
        PowerUps.injectScript(script)
    }, 1000);
}

chrome.storage.local.get(["paste-file-from-clipboard"], function(settings) {
	if (settings["paste-file-from-clipboard"]) {
        setup();
	}
});

})();
