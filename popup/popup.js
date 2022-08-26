document.addEventListener('DOMContentLoaded', () => {
  const app = document.querySelector('#app')
  let popupSettings = {}
  let hasChanged = false

  PowerUpSettings.load((settings) => {
    popupSettings = settings.settingsJson()

    const handleChange = (event) => {
      popupSettings[event.target.dataset.pluginId] = event.target.checked
      updateApplyButton()
    }
    const handleClickApply = (event) => {
      settings.update(popupSettings)
      PowerUps.reloadCurrentTab()
      window.close()
    }
    const updateApplyButton = () => {
      const button = document.querySelector('#button-apply')
      if (settings.hasChanged(popupSettings)) {
        button.disabled = false
      } else {
        button.disabled = true
      }
    }
    for (const group of settings.groups) {
      const section = document.createElement('section')
      const h3 = document.createElement('h3')
      h3.innerText = group.text
      const div = document.createElement('div')
      div.classList.add('plugins')
      for (const plugin of group.plugins) {
        const _div = document.createElement('div')
        const label = document.createElement('label')
        const input = document.createElement('input')
        input.setAttribute('type', 'checkbox')
        input.dataset.pluginId = plugin.pluginId
        if (plugin.enabled) {
          input.setAttribute('checked', true)
        }
        input.addEventListener('change', handleChange)
        const divPluginText = document.createElement('div')
        divPluginText.innerText = plugin.text
        label.appendChild(input)
        label.appendChild(divPluginText)
        _div.appendChild(label)
        div.appendChild(_div)
      }
      section.appendChild(h3)
      section.appendChild(div)
      app.appendChild(section)
    }
    const footer = document.createElement('footer')
    footer.classList.add('buttons')
    const button = document.createElement('button')
    button.setAttribute('type', 'submit')
    button.setAttribute('id', 'button-apply')
    button.disabled = true
    button.innerText = chrome.i18n.getMessage("popup_apply_button")
    button.addEventListener('click', handleClickApply)
    footer.appendChild(button)
    app.appendChild(footer)
  })
})
