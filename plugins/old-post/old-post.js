(() => {
  const showNotification = () => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", window.location.href, true);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        // get now date from server
        const serverDate = new Date(xhr.getResponseHeader("Date"));
        const yyyy = serverDate.getFullYear();
        const MM = ("0" + (serverDate.getMonth() + 1)).slice(-2);
        const dd = ("0" + serverDate.getDate()).slice(-2);
        const hh = ("0" + serverDate.getHours()).slice(-2);
        const mm = ("0" + serverDate.getMinutes()).slice(-2);
        const ss = ("0" + serverDate.getSeconds()).slice(-2);
        const nowDate =
          yyyy + "/" + MM + "/" + dd + " " + hh + ":" + mm + ":" + ss;

        // from Backlog DOM
        const userIconSet = document.querySelectorAll(
          ".user-history > .user-icon-set"
        );
        const lastElText = userIconSet[userIconSet.length - 1].querySelector(
          ".user-icon-set__text"
        ).innerHTML;
        const lastUpDate = lastElText.match(
          /(\d{4})(\/)(\d{2})(\/)(\d{2})(\s)(\d{2})(\:)(\d{2})(\:)(\d{2})/
        )[0];

        // calc diff
        const msDiff =
          new Date(nowDate).getTime() - new Date(lastUpDate).getTime();
        const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));

        // notification element
        if (daysDiff > 364) {
          const notification = document.createElement("p");
          // !!! PLEASE CHANGE ACCORDING TO YOUR STYLE GUIDE !!!
          Object.assign(notification.style, {
            backgroundColor: "#ffe79a",
            color: "#533f03",
            padding: "16px"
          });
          const message =
            PowerUps.getLang() == "ja"
              ? "最終更新日から1年以上が経過しています。"
              : "More than 1 year has passed since the last update date.";
          notification.innerHTML = message;

          // to Backlog UI
          document
            .getElementById("bodyLeft")
            .insertBefore(
              notification,
              document.getElementById("mainTitle").nextSibling
            );
        }
      }
    };
  };

  PowerUps.isEnabled("old-post", enabled => {
    if (enabled) {
      if (window.location.href.endsWith("/edit")) return false;
      showNotification();
    }
  });
})();
