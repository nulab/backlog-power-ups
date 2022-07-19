$(() => {
    PowerUpSettings.load((settings) => {
        console.log('load callback');
        console.log(settings);
        const app = new Vue({
            el: '#app',
            render: function(h) {
                return h(
                    'section',
                    this.groups.map( (group) =>{
                        return [h('h3', group.text),
                                h('div',
                                    {
                                        attrs: {
                                            class: 'plugins'
                                        }
                                    },
                                    group.plugins.map((plugin)=>{
                                        return h('label',
                                                [
                                                    h('input',{
                                                    attrs: {
                                                        type: 'checkbox'
                                                    }}),
                                                    h('span', plugin.text)
                                                ]
                                            )

                            }))]
                    })
                )
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
                    console.log(settings);
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