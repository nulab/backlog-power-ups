$(() => {
    PowerUpSettings.load((settings) => {
        console.log('load callback');
        console.log(settings);

        const app = new Vue({
            el: '#app',
            render: function(h) {
                return h('div', [
                        h('section',
                            this.groups.map( (group) =>{
                                return [h('h3', group.text),
                                        h('div',
                                            {
                                                attrs: {class: 'plugins'}
                                            },
                                            group.plugins.map((plugin)=>{
                                                return h('div', [
                                                        h('label', [
                                                            h('input',
                                                                {
                                                                    attrs: {type: 'checkbox'},
                                                                    modelValue: plugin.enabled
                                                                }
                                                            ),
                                                            h('span', plugin.text)
                                                        ])
                                                    ])

                                    }))]
                            })
                        ),
                        h('footer',
                            {
                                attrs: {class: 'buttons'}
                            },
                            [h('button',
                                {
                                    attrs: { type: 'submit' },
                                    on: {click: this.apply}
                                },
                                this.i18n.getMessage("popup_apply_button") )]
                        )
                    ])
            },
            methods: {
                change: (plugin) => {
                    // nothing
                },
                isChanged: (plugin) => {
                    return settings.isChanged();
                },
                apply: () => {
                    console.log('apply');
                    settings.store();
                    PowerUps.reloadCurrentTab();
                    close()
                }
            },
            data: {
              groups: settings.groups,
              i18n: chrome.i18n
            }
        });
    });
});