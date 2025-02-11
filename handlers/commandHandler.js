const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const baseDir = "./commands";

  const loadCommands = (dir, parentCategory = null) => {
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        loadCommands(fullPath, parentCategory ? `${parentCategory} ~ ${item.name}` : item.name);
      } else if (item.isFile() && item.name.endsWith(".js")) {
        let cmd = require(`../${fullPath}`);

        if (cmd.name) {
          cmd.category = parentCategory || "Uncategorized";
          client.commands.set(cmd.name, cmd);
        }
      }
    }
  };

  loadCommands(baseDir);

  console.log(`   [!] Commands loaded {${client.commands.size}}`);
};
