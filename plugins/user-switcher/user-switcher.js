(() => {
    const PATTERN_USER_URL = /^[/]user[/](.+)$/;

    // Scraping users page and build user data from it
    const getUsers = (callback) => {
        $("<div>").load("/users ", function(data) { 
            var users = [];
            $(data).find("#memberView li").each((index, li) => {
                const $li = $(li);
                const id = /[/]user[/]([^#]+)[#][a-z]+/.exec($li.find(".member-list__launch-menu-item:first").attr("href"))[1];
                var iconURL = $li.find(".member-list__icon img").attr("src");
                var migemoText = $li.find(".js-filterable").text();
                var user = {
                    id: id,
                    name: $li.find(".member-list__name").text(),
                    iconURL: iconURL,
                    migemoText: migemoText
                }
                users.push(user);
            });
            callback(users);
        });
    }

    const addSelectTagForUsers = (users) => {
        const currentUserId = PATTERN_USER_URL.exec(location.pathname)[1];

        var $container = $(".profile-icon-set__name").text(""); // remove existing user name
        var $users = $(`<select id="users">`).hide();
        users.forEach(user => {
            $users.append($("<option>")
                .attr("value", user.id)
                .attr("data-iconURL", user.iconURL)
                .attr("data-migemoText", user.migemoText.toUpperCase())
                .text(user.name));
        });
        $users.val(currentUserId).appendTo($container);
    }

    const select2 = () => {
        PowerUps.injectScript(`
            var template = function(state) {
                var iconURL = jQuery(state.element).attr("data-iconURL"); 
                return jQuery('<span><img src="' + iconURL + '" style="width: 24px; vertical-align: middle; "><span style="margin-left: 4px;">' + state.text + '</span></span>');
            };
            var matcher = function(params, data) {
                if (!params.term) {
                    return data;
                }
                var migemoText = jQuery(data.element).attr("data-migemoText");
                return migemoText.indexOf(params.term.toUpperCase()) != -1 ? data : null;
            };
            jQuery("#users").show().select2({templateResult: template, matcher: matcher }).on("change", () => {
                var userId = jQuery("#users").val();
                location.href = "/user/" + userId + location.hash;
                $container = jQuery(".profile-icon-set__name");
            });
        `);
    }

    const main = () => {
        // hide profile
        $(".profile-content").remove();

        // load script
        $("body").append($(`<link href="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/css/select2.min.css" rel="stylesheet" />`));
        $("body").append($(`<script src="https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.5/js/select2.min.js"></script>`));
        $("body").append($(`
            <style type="text/css">
            .select2-selection--single { 
                background-color: #f0f0f0 !important; 
                border: none !important;
                font-size: 1.6rem;
            } 
            </style>
        `));

        // scraping users page and build user options
        getUsers((users) => {
            addSelectTagForUsers(users);
            select2();
        });
    }

    PowerUps.isEnabled("user-switcher", (enabled) => {
        if (enabled) {
            main();
        }
    });
})();
