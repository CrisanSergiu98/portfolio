document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('console-input');
    const output = document.getElementById('console-output');
    let projectsData = [];

    // Load projects from JSON file
    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load projects.json');
            }
            return response.json();
        })
        .then(data => {
            projectsData = data.projects;
            console.log('Projects loaded:', projectsData);  // For debugging
        })
        .catch(error => {
            console.error('Error loading projects.json:', error);
            consoleController.displayText('Failed to load projects. Please try again later.');
        });

    input.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const command = input.value.trim();
            processCommand(command);
            input.value = '';
        }
    });

    const consoleController = {
        clearConsole: function () {
            output.innerHTML = '';
        },
        displayText: function (text, isJson = false) {
            if (isJson) {
                text = this.formatJson(text);
            }
            const newLine = document.createElement('p');
            newLine.innerHTML = text;
            output.appendChild(newLine);
            this.scrollToBottom();
        },
        displayProjects: function (projects) {
            if (projects.length === 0) {
                this.displayText('No projects found.');
                return;
            }
            projects.forEach(project => {
                const projectHtml = `
                    <p>
                        <span class="project-name">${project.name}</span><br>
                        <span class="project-description">${project.description}</span><br>
                        <a href="${project.github}" target="_blank" class="project-link">GitHub Link</a>
                    </p>
                `;
                this.displayText(projectHtml);
            });
        },
        formatJson: function (json) {
            let formattedText = '';
            if (typeof json === 'string') {
                json = JSON.parse(json);
            }
            for (const key in json) {
                formattedText += `<span class="json-key">${key}:</span> <span class="json-value">${json[key]}</span><br>`;
            }
            return formattedText;
        },
        scrollToBottom: function () {
            output.scrollTop = output.scrollHeight;
        }
    };

    function processCommand(command) {
        switch (command.toLowerCase()) {
            case 'help':
                consoleController.displayText('Available commands: about, skills, projects, contact, clear');
                break;
            case 'about':
                consoleController.displayText('{"Name":"Sergiu Crisan","Role":"Junior C# Developer","Description":"I am passionate about coding and love working with C# and .NET."}', true);
                break;
            case 'skills':
                consoleController.displayText('{"Languages":"C#, SQL","Frameworks":".NET, ASP.NET","Tools":"Visual Studio, Git, SQL Server"}', true);
                break;
            case 'projects':
                consoleController.displayProjects(projectsData);
                break;
            case 'contact':
                consoleController.displayText('{"Email":"cdsergiu@outlook.com","LinkedIn":"https://www.linkedin.com/in/sergiu-crisan-1a76391bb/"}', true);
                break;
            case 'clear':
                consoleController.clearConsole();
                break;
            default:
                consoleController.displayText(`'${command}' is not recognized as a valid command.`);
                break;
        }
    }
});
