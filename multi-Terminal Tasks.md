{
"version": "2.0.0",
"tasks": [
{
"label": "backend",
"type": "shell",
"command": "npm run dev",
"options": {
"cwd": "${workspaceFolder}/backend"
      },
      "problemMatcher": []
    },
    {
      "label": "frontend",
      "type": "shell",
      "command": "npm run dev",
      "options": {
        "cwd": "${workspaceFolder}/frontend"
},
"problemMatcher": []
},
{
"label": "dev:all",
"dependsOn": ["backend", "frontend"],
"dependsOrder": "parallel",
"problemMatcher": []
}
]
}
