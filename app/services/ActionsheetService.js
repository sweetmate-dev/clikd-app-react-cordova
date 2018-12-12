export default {
  show(options, callback) {
    if (window.device.platform === 'browser') {
      const buttons = [].concat(options.buttonLabels);
      const destructiveLabel = options.addDestructiveButtonWithLabel;
      if (destructiveLabel) {
        options.destructiveButtonLast
          ? buttons.push(destructiveLabel)
          : buttons.unshift(destructiveLabel);
      }
      let message = '';
      if (options.title) message += `${options.title}\n\n`;
      if (options.message) message += `${options.message}\n\n`;
      buttons.forEach((label, index) => { message += `${index + 1}: ${label}\n`; });
      const response = prompt(message);
      if (response) callback(Number(response));
    }
    else {
      plugins.actionsheet.show(options, callback);
    }
  } 
}