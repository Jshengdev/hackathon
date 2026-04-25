const fs = require('fs-extra');
const path = require('node:path');
const chalk = require('chalk');

/**
 * Hackathon Suite Module Installer
 */
async function install(options) {
  const { projectRoot, config, logger } = options;

  try {
    logger.log(chalk.blue('Installing Hackathon Suite...'));

    // Create state folder structure
    if (config['state_folder']) {
      const stateFolderConfig = config['state_folder'].replace('{project-root}/', '');
      const stateFolderPath = path.join(projectRoot, stateFolderConfig);

      if (!(await fs.pathExists(stateFolderPath))) {
        logger.log(chalk.yellow(`Creating state folder: ${stateFolderConfig}`));
        await fs.ensureDir(stateFolderPath);

        // Create subdirectories
        await fs.ensureDir(path.join(stateFolderPath, 'sessions'));
        await fs.ensureDir(path.join(stateFolderPath, 'sessions', '_archive'));
        await fs.ensureDir(path.join(stateFolderPath, 'focus'));
        await fs.ensureDir(path.join(stateFolderPath, 'decisions'));

        logger.log(chalk.green('✓ State folder structure created'));
      }
    }

    logger.log(chalk.green('✓ Hackathon Suite installation complete'));
    return true;
  } catch (error) {
    logger.error(chalk.red(`Error installing module: ${error.message}`));
    return false;
  }
}

module.exports = { install };
