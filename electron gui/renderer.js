const coinsList = ["Particl", "Monero", "Bitcoin", "Litecoin", "Dash", "PIVX", "Firo"];
let selectedCoins = {};
let installationPath = '';

window.onload = () => {
  coinsList.forEach((coin) => {
    const coinContainer = document.createElement('div');
    coinContainer.className = 'coin-container';

    const coinImage = document.createElement('img');
    coinImage.src = `${coin}-20.png`;
    coinImage.alt = coin;
    coinImage.width = 20;
    coinImage.height = 20;

    const coinName = document.createElement('div');
    coinName.className = 'coin-name';
    coinName.textContent = coin;
    
    if (coin === 'Particl') {
      coinContainer.classList.add('default');
      coinName.textContent += ' (default)';
    }

    coinContainer.appendChild(coinImage);
    coinContainer.appendChild(coinName);
    coinSelection.appendChild(coinContainer);
  
    if (coin !== 'Particl') {
      coinContainer.addEventListener('click', function() {
        this.classList.toggle('selected');
        selectedCoins[coin] = this.classList.contains('selected');
      });
    }
  });
      // Add event listeners
      document.getElementById('select-installation-path').addEventListener('click', async () => {
        installationPath = await window.myAPI.selectDirectory();
        document.getElementById('selected-path').textContent = installationPath;
      });

      document.getElementById('to-page2').addEventListener('click', () => {
        document.getElementById('page1').style.display = 'none';
        document.getElementById('page2').style.display = 'block';
      });

      document.getElementById('backButton2').addEventListener('click', () => {
        document.getElementById('page2').style.display = 'none';
        document.getElementById('page1').style.display = 'block';
      });

      document.getElementById('backButton3').addEventListener('click', () => {
        document.getElementById('page3').style.display = 'none';
        document.getElementById('page2').style.display = 'block';
      });

      coinSelection.addEventListener('change', (e) => {
        if (e.target && e.target.nodeName === 'INPUT') {
          selectedCoins[e.target.value] = e.target.checked;
        }
      });

      window.myAPI.onCommandData((event, data) => {
        const logTextArea = document.getElementById('log');
        logTextArea.value += data;
        logTextArea.scrollTop = logTextArea.scrollHeight;
      });

      document.getElementById('startInstallButton').addEventListener('click', async () => {
        const selectedCoinsList = Array.from(coinSelection.getElementsByClassName('selected')).map(div => div.children[1].textContent);

        document.getElementById('page2').style.display = 'none';
        document.getElementById('page3').style.display = 'block';

        // If there are no selected coins, show an error dialog
        if (selectedCoinsList.length === 0) {
          window.myAPI.showErrorBox('Error', 'Please select at least one coin.');
          return;
        }

        // Call your script with the selected options
        const cmd = `bash ./basicswap-install.sh --install-path "${installationPath}" --selected-coins "${selectedCoinsList.join(',').toLowerCase()}"`;

        // Execute the command and send updates to the textarea
        try {
          window.myAPI.runCommand(cmd);
        } catch (error) {
          console.error('Error running command:', error);
        }

        const logTextArea = document.getElementById('log');
        window.addEventListener('message', (event) => {
          if (event.data.type === 'command-data') {
            logTextArea.value += event.data.data;
            logTextArea.scrollTop = logTextArea.scrollHeight;
          }
        });

        // Show a message box when the process is done
        window.myAPI.runCommand(cmd).then(() => {
          window.myAPI.showMessageBox({
            type: 'info',
            title: 'Installation finished',
            message: 'Installation has finished'
          });
        }).catch((error) => {
          console.error('Error running command:', error);
        });
      });
    };