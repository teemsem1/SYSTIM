const { readdirSync } = require('fs');
const ascii = require('ascii-table');

let table = new ascii('Events').setJustify();
table.setHeading('Event Name', 'Loaded Status');

module.exports = (client27) => {
  const events = readdirSync('./events/').filter((file) => file.endsWith('.js'));
  for (const file of events) {
    try {
      let pull = require(`../events/${file}`);

      // يدعم الصيغتين: { name/event , execute/run }
      const eventName = pull.event || pull.name || file.replace('.js', '');
      const handlerFn = pull.run || pull.execute;

      if (typeof eventName !== 'string' || typeof handlerFn !== 'function') {
        table.addRow(file, '❌');
        continue;
      }

      if (pull.once) {
        client27.once(eventName, (...args) => handlerFn(client27, ...args));
      } else {
        client27.on(eventName, (...args) => handlerFn(client27, ...args));
      }

      table.addRow(file, '✔');
    } catch (error) {
      console.error(`Error loading event '${file}':`, error);
      table.addRow(file, '❌');
    }
  }
};

console.log(table.toString())